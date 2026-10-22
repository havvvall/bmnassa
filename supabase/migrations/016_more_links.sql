-- Bmnassa version 1 · more social links on a business: Snapchat, Viber, Telegram, X, Threads, LinkedIn
-- Run once in Supabase → SQL Editor. Safe to run again. Needs 007 already run.
-- Owners fill these in on Edit my page; they show as icons on the digital card and in the profile.
-- Like Instagram and the other links, changing them does not send the page back for review.

alter table public.businesses add column if not exists snapchat text;
alter table public.businesses add column if not exists viber text;     -- a phone number; opens a Viber chat
alter table public.businesses add column if not exists telegram text;
alter table public.businesses add column if not exists x text;
alter table public.businesses add column if not exists threads text;
alter table public.businesses add column if not exists linkedin text;

-- keep them short (a handle or a link)
do $$ begin
  alter table public.businesses add constraint businesses_more_links_len check (
    coalesce(length(snapchat), 0) <= 200 and coalesce(length(viber), 0) <= 200 and coalesce(length(telegram), 0) <= 200
    and coalesce(length(x), 0) <= 200 and coalesce(length(threads), 0) <= 200 and coalesce(length(linkedin), 0) <= 200);
exception when duplicate_object then null; end $$;

notify pgrst, 'reload schema';
