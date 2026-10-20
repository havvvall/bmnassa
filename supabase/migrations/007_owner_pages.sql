-- Bmnassa version 1 · slice 5: owner dashboard and Edit my page
-- Run once in Supabase → SQL Editor (the full editor). Safe to run again.
-- Needs 001 to 006 already run.

-- 1) More about each business: links, working hours, and the owner's email for claiming it
alter table public.businesses add column if not exists instagram text;
alter table public.businesses add column if not exists facebook text;
alter table public.businesses add column if not exists tiktok text;
alter table public.businesses add column if not exists email text;
alter table public.businesses add column if not exists website text;
alter table public.businesses add column if not exists hours jsonb;        -- {"sat": ["09:00","18:00"], "fri": null, ...}
alter table public.businesses add column if not exists owner_email text;  -- typed by the team; that person's account gets the business
alter table public.businesses add column if not exists address text;
alter table public.businesses add column if not exists lat double precision;
alter table public.businesses add column if not exists lng double precision;

-- 2) Owner rules (updated): owners also cannot change the team's note, the source or the owner's email
create or replace function public.bmnassa_businesses_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
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

-- 3) Claiming: a business whose owner's email matches an account belongs to that account
create or replace function public.bmnassa_claim_by_email() returns trigger
language plpgsql security definer set search_path = public as $$
declare uid uuid;
begin
  if new.owner_id is null and coalesce(new.owner_email, '') <> '' then
    select id into uid from auth.users where lower(email) = lower(new.owner_email) limit 1;
    if uid is not null then
      new.owner_id := uid;
    end if;
  end if;
  return new;
end $$;

drop trigger if exists bmnassa_claim_by_email on public.businesses;
create trigger bmnassa_claim_by_email
  before insert or update of owner_email, owner_id on public.businesses
  for each row execute function public.bmnassa_claim_by_email();

-- When someone signs in for the first time, businesses waiting for their email become theirs
create or replace function public.bmnassa_claim_on_signup() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if coalesce(new.email, '') <> '' then
    update public.businesses set owner_id = new.id
    where owner_id is null and lower(owner_email) = lower(new.email);
  end if;
  return new;
end $$;

drop trigger if exists bmnassa_claim_on_signup on public.profiles;
create trigger bmnassa_claim_on_signup
  after insert or update of email on public.profiles
  for each row execute function public.bmnassa_claim_on_signup();

-- Owner role also follows when a live business gets its owner
drop trigger if exists bmnassa_business_owner_role on public.businesses;
create trigger bmnassa_business_owner_role
  after insert or update of status, owner_id on public.businesses
  for each row execute function public.bmnassa_business_owner_role();

-- Accounts that already exist: link businesses the team already gave an email
update public.businesses b set owner_id = u.id
from auth.users u
where b.owner_id is null and coalesce(b.owner_email, '') <> '' and lower(u.email) = lower(b.owner_email);

-- 4) Who may see and change a business's prices and photos
create or replace function public.bmnassa_can_edit_business(bid bigint) returns boolean
language sql stable security definer set search_path = public as $$
  select public.bmnassa_is_staff() or exists (select 1 from public.businesses where id = bid and owner_id = auth.uid())
$$;

create or replace function public.bmnassa_business_is_live(bid bigint) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.businesses where id = bid and status = 'approved')
$$;

-- 5) Prices (item in up to 3 languages, price in IQD)
create table if not exists public.business_prices (
  id bigint generated by default as identity primary key,
  business_id bigint not null references public.businesses (id) on delete cascade,
  item_en text, item_ku text, item_ar text,
  price_iqd bigint check (price_iqd is null or price_iqd >= 0),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists business_prices_biz_idx on public.business_prices (business_id, sort_order);

-- 6) Photos (files live in the public "business-photos" storage folder, one subfolder per business)
create table if not exists public.business_photos (
  id bigint generated by default as identity primary key,
  business_id bigint not null references public.businesses (id) on delete cascade,
  path text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists business_photos_biz_idx on public.business_photos (business_id, sort_order);

create or replace function public.bmnassa_photo_limit() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.business_photos where business_id = new.business_id) >= 8 then
    raise exception 'A business can have up to 8 photos.';
  end if;
  return new;
end $$;
drop trigger if exists bmnassa_photo_limit on public.business_photos;
create trigger bmnassa_photo_limit before insert on public.business_photos
  for each row execute function public.bmnassa_photo_limit();

do $$
declare t text;
begin
  foreach t in array array['business_prices', 'business_photos'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "anyone reads live" on public.%I', t);
    execute format('create policy "anyone reads live" on public.%I for select using (public.bmnassa_business_is_live(business_id) or public.bmnassa_can_edit_business(business_id))', t);
    execute format('drop policy if exists "owner and team change" on public.%I', t);
    execute format('create policy "owner and team change" on public.%I for all to authenticated using (public.bmnassa_can_edit_business(business_id)) with check (public.bmnassa_can_edit_business(business_id))', t);
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;
grant usage, select on all sequences in schema public to authenticated;

-- Storage folder for photos: anyone can view; only the owner or team can add or remove files
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('business-photos', 'business-photos', true, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 3145728, allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "bmnassa photos: anyone views" on storage.objects;
create policy "bmnassa photos: anyone views" on storage.objects for select
  using (bucket_id = 'business-photos');
drop policy if exists "bmnassa photos: owner adds" on storage.objects;
create policy "bmnassa photos: owner adds" on storage.objects for insert to authenticated
  with check (bucket_id = 'business-photos' and (storage.foldername(name))[1] ~ '^\d+$'
              and public.bmnassa_can_edit_business(((storage.foldername(name))[1])::bigint));
drop policy if exists "bmnassa photos: owner removes" on storage.objects;
create policy "bmnassa photos: owner removes" on storage.objects for delete to authenticated
  using (bucket_id = 'business-photos' and (storage.foldername(name))[1] ~ '^\d+$'
         and public.bmnassa_can_edit_business(((storage.foldername(name))[1])::bigint));

-- 7) Page views, call taps and WhatsApp taps per day
create table if not exists public.page_stats (
  business_id bigint not null references public.businesses (id) on delete cascade,
  day date not null default ((now() at time zone 'Asia/Baghdad')::date),
  views int not null default 0,
  calls int not null default 0,
  whatsapp int not null default 0,
  primary key (business_id, day)
);
alter table public.page_stats enable row level security;
drop policy if exists "owner and team read stats" on public.page_stats;
create policy "owner and team read stats" on public.page_stats for select to authenticated
  using (public.bmnassa_can_edit_business(business_id));
grant select on public.page_stats to authenticated;

-- Anyone's app counts a view or a tap through this one function (only for live businesses)
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
end $$;
grant execute on function public.bmnassa_track(bigint, text) to anon, authenticated;
