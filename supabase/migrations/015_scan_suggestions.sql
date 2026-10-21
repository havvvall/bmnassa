-- 015 · Scanned cards help grow Bmnassa, with consent
-- 1) "Suggest for Bmnassa": someone who scanned a paper card can send it to the team privately.
--    The team calls the business; only if they agree does a listing go live.
-- 2) Home banner: how many paper cards were scanned this month (a number only),
--    and the live businesses that joined after being suggested.

create table if not exists public.business_suggestions (
  id bigserial primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  wallet_item_id bigint references public.wallet_items (id) on delete set null,
  city_id text references public.cities (id),
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object' and length(data::text) <= 4000),
  image_path text,
  back_path text,
  note text not null default '' check (char_length(note) <= 300),
  status text not null default 'new' check (status in ('new', 'contacted', 'joined', 'declined')),
  business_id bigint references public.businesses (id) on delete set null,
  team_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists business_suggestions_one_per_item on public.business_suggestions (user_id, wallet_item_id) where wallet_item_id is not null;
create index if not exists business_suggestions_status_idx on public.business_suggestions (status, created_at desc);
create index if not exists business_suggestions_joined_idx on public.business_suggestions (business_id) where status = 'joined';
alter table public.business_suggestions enable row level security;

-- Keeps suggestions honest: people send their own scanned cards (copied from their wallet), the team handles the rest
create or replace function public.bmnassa_suggestions_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare w public.wallet_items;
begin
  if auth.uid() is null or public.bmnassa_is_staff() then
    if new.status = 'joined' and new.business_id is null then
      raise exception 'Link the business that joined.';
    end if;
    new.updated_at := now();
    return new;
  end if;
  if tg_op <> 'INSERT' then
    raise exception 'Only the Bmnassa team can change a suggestion.';
  end if;
  select * into w from public.wallet_items where id = new.wallet_item_id and user_id = auth.uid() and kind = 'scanned';
  if not found then
    raise exception 'You can only suggest cards you scanned.';
  end if;
  if (select count(*) from public.business_suggestions where user_id = auth.uid() and created_at > now() - interval '1 day') >= 20 then
    raise exception 'That is a lot of suggestions for one day. Try again tomorrow.';
  end if;
  new.user_id := auth.uid();
  new.data := w.data;
  new.image_path := w.image_path;
  new.back_path := nullif(w.data ->> 'back_path', '');
  new.status := 'new';
  new.business_id := null;
  new.team_note := null;
  new.created_at := now();
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists bmnassa_suggestions_guard on public.business_suggestions;
create trigger bmnassa_suggestions_guard before insert or update on public.business_suggestions
  for each row execute function public.bmnassa_suggestions_guard();

drop policy if exists "people read their suggestions" on public.business_suggestions;
create policy "people read their suggestions" on public.business_suggestions
  for select to authenticated using (user_id = auth.uid());
drop policy if exists "people send suggestions" on public.business_suggestions;
create policy "people send suggestions" on public.business_suggestions
  for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "team manages suggestions" on public.business_suggestions;
create policy "team manages suggestions" on public.business_suggestions
  for all to authenticated using (public.bmnassa_is_staff()) with check (public.bmnassa_is_staff());
grant select, insert on public.business_suggestions to authenticated;
grant update, delete on public.business_suggestions to authenticated;
grant usage, select on sequence public.business_suggestions_id_seq to authenticated;

-- The team can open the photos of suggested cards (and only those)
drop policy if exists "team opens suggested scans" on storage.objects;
create policy "team opens suggested scans" on storage.objects
  for select to authenticated
  using (bucket_id = 'wallet-scans' and public.bmnassa_is_staff()
         and exists (select 1 from public.business_suggestions s where s.image_path = name or s.back_path = name));

-- Home: paper cards scanned this month, as one number
create or replace function public.bmnassa_scan_stats()
returns int language sql stable security definer set search_path = public as $$
  select count(*)::int from public.wallet_items
  where kind = 'scanned'
    and created_at >= date_trunc('month', now() at time zone 'Asia/Baghdad') at time zone 'Asia/Baghdad';
$$;
revoke all on function public.bmnassa_scan_stats() from public;
grant execute on function public.bmnassa_scan_stats() to anon, authenticated;

-- Home: live businesses that joined after someone suggested their paper card, newest first
create or replace function public.bmnassa_joined_from_scans(city text)
returns table (business_id bigint, joined_at timestamptz)
language sql stable security definer set search_path = public as $$
  select s.business_id, max(s.updated_at)
  from public.business_suggestions s
  join public.businesses b on b.id = s.business_id
  where s.status = 'joined' and b.city_id = city and public.bmnassa_business_is_live(b.id)
  group by s.business_id
  order by max(s.updated_at) desc
  limit 10;
$$;
revoke all on function public.bmnassa_joined_from_scans(text) from public;
grant execute on function public.bmnassa_joined_from_scans(text) to anon, authenticated;
