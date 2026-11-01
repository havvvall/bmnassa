-- Plan orders: a card ordered with a plan keeps the plan name, the price in IQD and the custom design.
-- Run this in the Supabase SQL editor before the app that sends these fields goes live.
alter table public.nfc_orders add column if not exists plan_name text;
alter table public.nfc_orders add column if not exists price_iqd integer check (price_iqd is null or price_iqd >= 0);
alter table public.nfc_orders add column if not exists design_url text;
