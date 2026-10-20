-- Slice 7, part 4: ordering printed NFC cards.
-- An owner orders cards for their live business; the team calls to confirm and arrange payment before printing.
-- No online payment yet: the owner picks how they would like to pay (cash on delivery, FIB, FastPay, AsiaPay, ZainCash).

create table if not exists public.nfc_orders (
  id bigserial primary key,
  business_id bigint not null references public.businesses (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name_on_card text not null check (char_length(name_on_card) between 1 and 60),
  title_on_card text not null default '' check (char_length(title_on_card) <= 80),
  quantity int not null default 1 check (quantity between 1 and 50),
  unit_price_usd numeric(8, 2) not null default 15,
  delivery_address text not null check (char_length(delivery_address) between 3 and 300),
  phone text not null check (char_length(phone) between 6 and 20),
  payment text not null default 'cash' check (payment in ('cash', 'fib', 'fastpay', 'asiapay', 'zaincash')),
  status text not null default 'new' check (status in ('new', 'confirmed', 'printing', 'sent', 'delivered', 'cancelled')),
  team_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists nfc_orders_business_idx on public.nfc_orders (business_id, created_at desc);
create index if not exists nfc_orders_status_idx on public.nfc_orders (status, created_at desc);
alter table public.nfc_orders enable row level security;

create or replace function public.bmnassa_nfc_orders_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or public.bmnassa_is_staff() then
    new.updated_at := now();
    return new;
  end if;
  if tg_op = 'INSERT' then
    if not exists (select 1 from public.businesses where id = new.business_id and owner_id = auth.uid()) then
      raise exception 'You can only order cards for your own business.';
    end if;
    if not public.bmnassa_business_is_live(new.business_id) then
      raise exception 'Your business needs to be live before ordering cards.';
    end if;
    if (select count(*) from public.nfc_orders where user_id = auth.uid() and status = 'new') >= 5 then
      raise exception 'You already have orders waiting. Our team will call you soon.';
    end if;
    new.user_id := auth.uid();
    new.status := 'new';
    new.unit_price_usd := 15;
    new.team_note := null;
    new.created_at := now();
  else
    -- owners can only cancel an order the team has not confirmed yet
    if old.status <> 'new' or new.status <> 'cancelled' then
      raise exception 'Call Bmnassa to change this order.';
    end if;
    new := old;
    new.status := 'cancelled';
  end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists bmnassa_nfc_orders_guard on public.nfc_orders;
create trigger bmnassa_nfc_orders_guard before insert or update on public.nfc_orders
  for each row execute function public.bmnassa_nfc_orders_guard();

drop policy if exists "owners read their orders" on public.nfc_orders;
create policy "owners read their orders" on public.nfc_orders
  for select to authenticated using (user_id = auth.uid() or public.bmnassa_can_edit_business(business_id));
drop policy if exists "owners place orders" on public.nfc_orders;
create policy "owners place orders" on public.nfc_orders
  for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "owners cancel orders" on public.nfc_orders;
create policy "owners cancel orders" on public.nfc_orders
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "team manages orders" on public.nfc_orders;
create policy "team manages orders" on public.nfc_orders
  for all to authenticated using (public.bmnassa_is_staff()) with check (public.bmnassa_is_staff());
