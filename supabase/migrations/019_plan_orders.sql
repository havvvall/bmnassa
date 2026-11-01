-- Plan orders: a customer picks Basic, Standard or Silver (with a +, for permanent), fills the business profile,
-- adds the card colour or design where the plan needs it, then pays (cash on delivery or FIB).
-- The team confirms the order by WhatsApp. Run this after 018 and before the app that uses it goes live.
create table if not exists public.plan_orders (
  id bigserial primary key,
  business_id bigint not null references public.businesses (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  plan_name text not null check (char_length(plan_name) between 1 and 40),
  duration text not null check (duration in ('year', 'perm')),
  price_iqd integer not null check (price_iqd >= 0),
  payment text not null check (payment in ('cash', 'fib')),
  card_color text check (card_color is null or card_color ~ '^#[0-9a-fA-F]{6}$'),
  design_url text,
  design_back_url text,
  status text not null default 'new' check (status in ('new', 'confirmed', 'done', 'cancelled')),
  created_at timestamptz not null default now()
);
create index if not exists plan_orders_business_idx on public.plan_orders (business_id, created_at desc);
alter table public.plan_orders enable row level security;

-- An owner can order a plan only for their own business
drop policy if exists plan_orders_insert_own on public.plan_orders;
create policy plan_orders_insert_own on public.plan_orders for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
  );

-- An owner sees their own orders; the team sees all of them
drop policy if exists plan_orders_select_own on public.plan_orders;
create policy plan_orders_select_own on public.plan_orders for select to authenticated
  using (user_id = auth.uid() or public.bmnassa_is_staff());
