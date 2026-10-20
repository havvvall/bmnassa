-- Bmnassa version 1 · slice 4: listing (home, results, business card, profile)
-- Run once in Supabase → SQL Editor (the full editor). Safe to run again.
-- Needs 001 to 004 already run.

-- 1) The person's name shown on the business card (e.g. "Karwan Ahmed").
--    Filled from the owner's profile when the business is sent in; the team can change it.
alter table public.businesses add column if not exists contact_name text;

create or replace function public.bmnassa_business_contact_name() returns trigger
language plpgsql security definer set search_path = public as $$
declare who uuid;
begin
  -- Runs before the owner rules fill owner_id, so fall back to the owner signed in (never to a team member)
  who := coalesce(new.owner_id, case when public.bmnassa_is_staff() then null else auth.uid() end);
  if coalesce(new.contact_name, '') = '' and who is not null then
    select full_name into new.contact_name from public.profiles where id = who;
  end if;
  return new;
end $$;

drop trigger if exists bmnassa_business_contact_name on public.businesses;
create trigger bmnassa_business_contact_name
  before insert on public.businesses
  for each row execute function public.bmnassa_business_contact_name();

update public.businesses b set contact_name = p.full_name
from public.profiles p
where p.id = b.owner_id and coalesce(b.contact_name, '') = '' and coalesce(p.full_name, '') <> '';

-- 2) Fast lookups for the app
create index if not exists businesses_city_status_idx on public.businesses (city_id, status);
create index if not exists businesses_handle_idx on public.businesses (lower(handle));
