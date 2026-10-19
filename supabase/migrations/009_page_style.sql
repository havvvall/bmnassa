-- Bmnassa version 1 · page style (Edit my page → Style)
-- Run once in Supabase → SQL Editor (the full editor). Safe to run again.
-- Needs 001 to 008 already run.

-- How the business page looks: layout, main colour, background colour or photo, button shape.
-- Owners change it freely (no approval), like the card design.
alter table public.businesses add column if not exists page_style jsonb;

create or replace function public.bmnassa_page_style_check() returns trigger
language plpgsql as $$
begin
  if new.page_style is not null and (jsonb_typeof(new.page_style) <> 'object' or length(new.page_style::text) > 2000) then
    raise exception 'Page style is not valid.';
  end if;
  return new;
end $$;

drop trigger if exists bmnassa_page_style_check on public.businesses;
create trigger bmnassa_page_style_check
  before insert or update of page_style on public.businesses
  for each row execute function public.bmnassa_page_style_check();
