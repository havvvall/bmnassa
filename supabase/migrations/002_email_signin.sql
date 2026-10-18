-- Bmnassa version 1 · slice 1b: sign in with an email code
-- Run once in Supabase → SQL Editor (the full editor, not the side panel). Safe to run again.
-- Needs 001_accounts.sql already run.

-- 1) Profiles keep the email too (phone stays for later, when SMS codes come back)
alter table public.profiles add column if not exists email text;
create unique index if not exists profiles_email_key on public.profiles (lower(email));

-- 2) A new sign-in creates its profile with the email or the phone it signed in with
create or replace function public.bmnassa_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, phone, email)
  values (
    new.id,
    case when coalesce(new.phone, '') = '' then null else '+' || ltrim(new.phone, '+') end,
    nullif(lower(coalesce(new.email, '')), '')
  )
  on conflict (id) do nothing;
  return new;
end $$;

-- People who already signed in get their email filled in
insert into public.profiles (id, phone, email)
select id,
       case when coalesce(phone, '') = '' then null else '+' || ltrim(phone, '+') end,
       nullif(lower(coalesce(email, '')), '')
from auth.users
on conflict (id) do update set email = coalesce(public.profiles.email, excluded.email);

-- 3) Nobody changes their own email from the app (only the team can)
create or replace function public.bmnassa_profiles_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
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
  if new.email is distinct from old.email and not public.bmnassa_is_staff() then
    new.email := old.email;
  end if;
  new.id := old.id;
  new.created_at := old.created_at;
  new.updated_at := now();
  return new;
end $$;

-- 4) Make Haval a team member (run this line again after your first sign-in)
update public.profiles set role = 'team' where lower(email) = 'haval.rizgar96@gmail.com';
