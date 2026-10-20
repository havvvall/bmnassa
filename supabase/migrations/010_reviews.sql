-- Slice 7, part 1: reviews.
-- Only people who contacted a business through Bmnassa (tapped Call or WhatsApp while signed in) can rate it.
-- One review per account per business. Reviews go live straight away; the team can hide one afterwards.
-- The business owner can reply once per review (and edit the reply).

-- 1. Who contacted which business, and when (the latest tap is kept).
create table if not exists public.business_contacts (
  user_id uuid not null references auth.users (id) on delete cascade,
  business_id bigint not null references public.businesses (id) on delete cascade,
  kind text not null check (kind in ('call', 'whatsapp')),
  at timestamptz not null default now(),
  primary key (user_id, business_id)
);
alter table public.business_contacts enable row level security;
drop policy if exists "people read their own contacts" on public.business_contacts;
create policy "people read their own contacts" on public.business_contacts
  for select to authenticated using (user_id = auth.uid());

-- 2. Tapping Call or WhatsApp while signed in now also remembers the contact.
create or replace function public.bmnassa_track(bid bigint, kind text) returns void
language plpgsql security definer set search_path = public as $$
declare d date := (now() at time zone 'Asia/Baghdad')::date;
begin
  if kind not in ('view', 'call', 'whatsapp') or not public.bmnassa_business_is_live(bid) then
    return;
  end if;
  insert into public.page_stats (business_id, day, views, calls, whatsapp)
  values (bid, d, (kind = 'view')::int, (kind = 'call')::int, (kind = 'whatsapp')::int)
  on conflict (business_id, day) do update set
    views = public.page_stats.views + excluded.views,
    calls = public.page_stats.calls + excluded.calls,
    whatsapp = public.page_stats.whatsapp + excluded.whatsapp;
  if auth.uid() is not null and kind in ('call', 'whatsapp')
     and not exists (select 1 from public.businesses where id = bid and owner_id = auth.uid()) then
    insert into public.business_contacts (user_id, business_id, kind, at)
    values (auth.uid(), bid, kind, now())
    on conflict (user_id, business_id) do update set kind = excluded.kind, at = excluded.at;
  end if;
end $$;
grant execute on function public.bmnassa_track(bigint, text) to anon, authenticated;

-- 3. Reviews.
create table if not exists public.reviews (
  id bigserial primary key,
  business_id bigint not null references public.businesses (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  tags text[] not null default '{}',
  body text not null default '' check (char_length(body) <= 600),
  first_name text not null default '',
  contact_kind text,
  contacted_at timestamptz,
  status text not null default 'live' check (status in ('live', 'hidden')),
  hidden_reason text,
  owner_reply text check (owner_reply is null or char_length(owner_reply) <= 400),
  owner_reply_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, user_id)
);
create index if not exists reviews_business_idx on public.reviews (business_id, created_at desc);
create index if not exists reviews_recent_idx on public.reviews (created_at desc);
alter table public.reviews enable row level security;

-- Keeps every review honest whoever writes it:
-- reviewers set rating, tags and text; owners set only the reply; the team can hide.
create or replace function public.bmnassa_reviews_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  c record;
  staff boolean := auth.uid() is null or public.bmnassa_is_staff();
  is_owner boolean;
begin
  if tg_op = 'INSERT' then
    if auth.uid() is null then raise exception 'Sign in to write a review.'; end if;
    new.user_id := auth.uid();
    if not public.bmnassa_business_is_live(new.business_id) then
      raise exception 'This business is not live.';
    end if;
    if exists (select 1 from public.businesses where id = new.business_id and owner_id = auth.uid()) then
      raise exception 'You cannot rate your own business.';
    end if;
    select * into c from public.business_contacts where user_id = auth.uid() and business_id = new.business_id;
    if not found then
      raise exception 'Call or WhatsApp this business through Bmnassa first, then you can rate it.';
    end if;
    new.contact_kind := c.kind;
    new.contacted_at := c.at;
    new.status := 'live';
    new.hidden_reason := null;
    new.owner_reply := null;
    new.owner_reply_at := null;
    new.created_at := now();
  else
    new.id := old.id;
    new.business_id := old.business_id;
    new.user_id := old.user_id;
    new.contact_kind := old.contact_kind;
    new.contacted_at := old.contacted_at;
    new.created_at := old.created_at;
    is_owner := exists (select 1 from public.businesses where id = old.business_id and owner_id = auth.uid());
    if not staff then
      new.status := old.status;
      new.hidden_reason := old.hidden_reason;
    end if;
    if auth.uid() = old.user_id and not staff then
      -- the reviewer edits their own review; the reply stays
      new.owner_reply := old.owner_reply;
      new.owner_reply_at := old.owner_reply_at;
    elsif is_owner and not staff then
      -- the owner only writes the reply
      new.rating := old.rating;
      new.tags := old.tags;
      new.body := old.body;
      new.first_name := old.first_name;
      new.owner_reply := nullif(trim(coalesce(new.owner_reply, '')), '');
      new.owner_reply_at := case when new.owner_reply is null then null
        when new.owner_reply is distinct from old.owner_reply then now() else old.owner_reply_at end;
    elsif not staff then
      raise exception 'Not allowed.';
    end if;
  end if;
  -- the name shown is the reviewer's first name only, with the first letter of the last name
  if tg_op = 'INSERT' or new.user_id = auth.uid() then
    select coalesce(
             nullif(split_part(trim(full_name), ' ', 1), '')
             || coalesce(' ' || nullif(left(split_part(trim(full_name), ' ', 2), 1), '') || '.', ''),
             '')
      into new.first_name from public.profiles where id = new.user_id;
    new.first_name := coalesce(new.first_name, '');
  end if;
  new.tags := array(select distinct x from unnest(coalesce(new.tags, '{}')) x
                    where x in ('on_time', 'fair_price', 'clean_work', 'friendly', 'fast_reply'));
  new.body := trim(coalesce(new.body, ''));
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists bmnassa_reviews_guard on public.reviews;
create trigger bmnassa_reviews_guard before insert or update on public.reviews
  for each row execute function public.bmnassa_reviews_guard();

drop policy if exists "anyone reads live reviews" on public.reviews;
create policy "anyone reads live reviews" on public.reviews
  for select to anon, authenticated
  using (status = 'live' and public.bmnassa_business_is_live(business_id));
drop policy if exists "reviewers read their own" on public.reviews;
create policy "reviewers read their own" on public.reviews
  for select to authenticated using (user_id = auth.uid());
drop policy if exists "owners read their reviews" on public.reviews;
create policy "owners read their reviews" on public.reviews
  for select to authenticated
  using (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));
drop policy if exists "reviewers write their own" on public.reviews;
create policy "reviewers write their own" on public.reviews
  for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "reviewers edit their own" on public.reviews;
create policy "reviewers edit their own" on public.reviews
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "reviewers delete their own" on public.reviews;
create policy "reviewers delete their own" on public.reviews
  for delete to authenticated using (user_id = auth.uid());
drop policy if exists "owners reply" on public.reviews;
create policy "owners reply" on public.reviews
  for update to authenticated
  using (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()))
  with check (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));
drop policy if exists "team manages reviews" on public.reviews;
create policy "team manages reviews" on public.reviews
  for all to authenticated using (public.bmnassa_is_staff()) with check (public.bmnassa_is_staff());

-- 4. The business's star rating and review count follow its live reviews.
create or replace function public.bmnassa_businesses_guard_internal() returns boolean
language sql stable as $$ select coalesce(current_setting('bmnassa.internal', true), '') = 'on' $$;

create or replace function public.bmnassa_review_totals() returns trigger
language plpgsql security definer set search_path = public as $$
declare bid bigint := coalesce(new.business_id, old.business_id);
begin
  perform set_config('bmnassa.internal', 'on', true);
  update public.businesses b set
    reviews = s.n,
    rating = s.avg
  from (select count(*)::int n, coalesce(round(avg(rating)::numeric, 1), 0) avg
        from public.reviews where business_id = bid and status = 'live') s
  where b.id = bid;
  perform set_config('bmnassa.internal', '', true);
  return null;
end $$;
drop trigger if exists bmnassa_review_totals on public.reviews;
create trigger bmnassa_review_totals after insert or update or delete on public.reviews
  for each row execute function public.bmnassa_review_totals();

-- The business guard lets that internal update through (it only changes rating and reviews).
create or replace function public.bmnassa_businesses_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if public.bmnassa_businesses_guard_internal() and tg_op = 'UPDATE' then
    return new;
  end if;
  if auth.uid() is null or public.bmnassa_is_staff() then
    if tg_op = 'UPDATE' and new.status is distinct from old.status and new.status in ('approved', 'rejected') then
      new.reviewed_at := now();
      new.reviewed_by := auth.uid();
    end if;
    if new.status = 'approved' then
      new.rejection_reason := null;
    end if;
    new.owner_email := nullif(lower(trim(coalesce(new.owner_email, ''))), '');
    new.updated_at := now();
    return new;
  end if;
  if tg_op = 'INSERT' then
    if (select count(*) from public.businesses where owner_id = auth.uid()) >= 10 then
      raise exception 'You can list up to 10 businesses. Contact Bmnassa for more.';
    end if;
    new.owner_id := auth.uid();
    new.status := 'pending';
    new.verified := false;
    new.rating := 0;
    new.reviews := 0;
    new.handle := null;
    new.created_at := now();
    new.reviewed_at := null;
    new.reviewed_by := null;
    new.rejection_reason := null;
    new.team_note := null;
    new.source := 'app';
    new.owner_email := null;
  else
    new.id := old.id;
    new.owner_id := old.owner_id;
    new.verified := old.verified;
    new.rating := old.rating;
    new.reviews := old.reviews;
    new.handle := old.handle;
    new.created_at := old.created_at;
    new.reviewed_at := old.reviewed_at;
    new.reviewed_by := old.reviewed_by;
    new.team_note := old.team_note;
    new.source := old.source;
    new.owner_email := old.owner_email;
    if old.status = 'rejected' then
      new.status := 'pending';
      new.rejection_reason := old.rejection_reason;
    elsif old.status = 'approved' and (new.name_en is distinct from old.name_en or new.name_ku is distinct from old.name_ku
        or new.name_ar is distinct from old.name_ar or new.category_id is distinct from old.category_id
        or new.phone is distinct from old.phone) then
      new.status := 'pending';
      new.rejection_reason := old.rejection_reason;
    else
      new.status := old.status;
      new.rejection_reason := old.rejection_reason;
    end if;
  end if;
  new.updated_at := now();
  return new;
end $$;

-- 5. Start every business from its real reviews (test numbers from before go back to 0).
update public.businesses b set reviews = 0, rating = 0
where not exists (select 1 from public.reviews r where r.business_id = b.id and r.status = 'live')
  and (coalesce(b.reviews, 0) <> 0 or coalesce(b.rating, 0) <> 0);
