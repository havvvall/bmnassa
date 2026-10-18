-- Bmnassa version 1 · slice 1: accounts
-- Run once in Supabase → SQL Editor. Safe to run again.
-- Needs the back-office setup already in place (bmnassa_admins, bmnassa_is_admin(), cities).

-- 1) One profile per signed-in person
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  phone text unique,
  full_name text,
  language text not null default 'ku' check (language in ('en', 'ku', 'ar')),
  city_id text references public.cities (id),
  role text not null default 'customer' check (role in ('customer', 'owner', 'team')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Is the person signed in part of the Bmnassa team?
--    Team = a profile with role 'team', or a back-office email in bmnassa_admins.
create or replace function public.bmnassa_is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select public.bmnassa_is_admin()
      or exists (select 1 from public.profiles where id = auth.uid() and role = 'team')
$$;

-- 3) A new sign-in creates its profile automatically
create or replace function public.bmnassa_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, phone)
  values (new.id, case when coalesce(new.phone, '') = '' then null else '+' || ltrim(new.phone, '+') end)
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists bmnassa_on_auth_user_created on auth.users;
create trigger bmnassa_on_auth_user_created
  after insert on auth.users
  for each row execute function public.bmnassa_new_user();

-- People who signed in before this ran also get a profile
insert into public.profiles (id, phone)
select id, case when coalesce(phone, '') = '' then null else '+' || ltrim(phone, '+') end
from auth.users
on conflict (id) do nothing;

-- 4) Only the team can change a role; nobody changes their phone from the app
create or replace function public.bmnassa_profiles_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  -- SQL Editor and server jobs (no signed-in user) may change anything
  if auth.uid() is null then
    new.updated_at := now();
    return new;
  end if;
  if new.role is distinct from old.role and not public.bmnassa_is_staff() then
    raise exception 'Only the Bmnassa team can change a role';
  end if;
  if new.phone is distinct from old.phone and not public.bmnassa_is_staff() then
    new.phone := old.phone;
  end if;
  new.id := old.id;
  new.created_at := old.created_at;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists bmnassa_profiles_guard on public.profiles;
create trigger bmnassa_profiles_guard
  before update on public.profiles
  for each row execute function public.bmnassa_profiles_guard();

-- 5) Who can see and change profiles
alter table public.profiles enable row level security;

drop policy if exists "read own profile or team" on public.profiles;
create policy "read own profile or team" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.bmnassa_is_staff());

drop policy if exists "update own profile or team" on public.profiles;
create policy "update own profile or team" on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.bmnassa_is_staff())
  with check (id = auth.uid() or public.bmnassa_is_staff());

drop policy if exists "create own profile" on public.profiles;
create policy "create own profile" on public.profiles
  for insert to authenticated
  with check (id = auth.uid() and role = 'customer');

grant select, insert, update on public.profiles to authenticated;
revoke all on public.profiles from anon;

-- 6) Make Haval a team member once he has signed in with his phone (run again after the first sign-in)
update public.profiles set role = 'team' where phone = '+9647701218832';
