-- Slice 7, part 2: the wallet.
-- Each person keeps the cards they saved: Bmnassa business cards now, scanned paper cards in part 3.
-- Only the person can see their wallet. Owners only ever see how many wallets saved their card, never who.

create table if not exists public.wallet_items (
  id bigserial primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind text not null default 'business' check (kind in ('business', 'scanned')),
  business_id bigint references public.businesses (id) on delete cascade,
  -- for scanned paper cards (part 3): name, title, company, phones, email, website, address, note
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object' and length(data::text) <= 4000),
  image_path text,
  created_at timestamptz not null default now(),
  constraint wallet_item_shape check ((kind = 'business') = (business_id is not null))
);
create unique index if not exists wallet_items_one_per_business on public.wallet_items (user_id, business_id) where business_id is not null;
create index if not exists wallet_items_user_idx on public.wallet_items (user_id, created_at desc);
alter table public.wallet_items enable row level security;

create or replace function public.bmnassa_wallet_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return new; end if;
  new.user_id := auth.uid();
  if tg_op = 'INSERT' then
    new.created_at := now();
    if new.kind = 'business' and not public.bmnassa_business_is_live(new.business_id) then
      raise exception 'This business is not live.';
    end if;
    if (select count(*) from public.wallet_items where user_id = auth.uid()) >= 500 then
      raise exception 'Your wallet is full (500 cards).';
    end if;
  else
    new.id := old.id;
    new.kind := old.kind;
    new.business_id := old.business_id;
    new.created_at := old.created_at;
  end if;
  return new;
end $$;
drop trigger if exists bmnassa_wallet_guard on public.wallet_items;
create trigger bmnassa_wallet_guard before insert or update on public.wallet_items
  for each row execute function public.bmnassa_wallet_guard();

drop policy if exists "people manage their own wallet" on public.wallet_items;
create policy "people manage their own wallet" on public.wallet_items
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- How many wallets hold a business's card (for its owner and the team).
create or replace function public.bmnassa_wallet_saves(bid bigint) returns integer
language sql stable security definer set search_path = public as $$
  select case when public.bmnassa_can_edit_business(bid)
    then (select count(*)::int from public.wallet_items where business_id = bid) else null end
$$;
grant execute on function public.bmnassa_wallet_saves(bigint) to authenticated;
