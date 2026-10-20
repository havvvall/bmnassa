-- Bmnassa version 1 · slice 6: Card Studio
-- Run once in Supabase → SQL Editor (the full editor). Safe to run again.
-- Needs 001 to 007 already run.

-- The owner's card design: style, colour, background, icon colours, which links show and in what order,
-- the wide button, the line under the name, and the card photo or logo. Owners change it freely (no approval):
-- the owner rules only send a business back for review when its name, category or phone changes.
alter table public.businesses add column if not exists card jsonb;

-- Keep the design small and well-formed
create or replace function public.bmnassa_card_check() returns trigger
language plpgsql as $$
begin
  if new.card is not null and (jsonb_typeof(new.card) <> 'object' or length(new.card::text) > 4000) then
    raise exception 'Card design is not valid.';
  end if;
  return new;
end $$;

drop trigger if exists bmnassa_card_check on public.businesses;
create trigger bmnassa_card_check
  before insert or update of card on public.businesses
  for each row execute function public.bmnassa_card_check();
