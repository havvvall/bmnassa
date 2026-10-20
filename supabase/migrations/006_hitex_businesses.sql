-- Bmnassa version 1 · HITEX26 sign-ups become businesses waiting for review
-- Run once in Supabase → SQL Editor (the full editor). Safe to run again: a sign-up is copied only once.
-- Needs 001 to 005 already run.

-- 1) Places on a business for what the sign-up form collected
alter table public.businesses add column if not exists address text;        -- area or street, building, apartment
alter table public.businesses add column if not exists lat double precision; -- map pin
alter table public.businesses add column if not exists lng double precision;
alter table public.businesses add column if not exists map_link text;
alter table public.businesses add column if not exists source text;         -- 'app', 'hitex26', 'register form', 'team'
alter table public.businesses add column if not exists team_note text;      -- only the team sees this in /team

-- 2) Iraqi mobile numbers in one format: +9647XXXXXXXXX (null if it is not one)
create or replace function public.bmnassa_phone(p text) returns text
language plpgsql immutable as $$
declare d text := regexp_replace(coalesce(p, ''), '\D', '', 'g');
begin
  if d like '00%' then d := substr(d, 3); end if;
  if d like '964%' then d := substr(d, 4); end if;
  if d like '0%' then d := substr(d, 2); end if;
  if d ~ '^7\d{9}$' then return '+964' || d; end if;
  return null;
end $$;

-- 3) Copy the HITEX26 sign-ups (stand iPad, or sent between 6 and 9 Oct 2026) that are not businesses yet
do $$
declare r record; lang text; new_id bigint; cat text; note text; addr text;
begin
  for r in
    select * from public.registrations
    -- not copied yet (a business made earlier in the old back office and since deleted counts as not copied)
    where (business_id is null or not exists (select 1 from public.businesses b where b.id = registrations.business_id))
      and coalesce(status, 'new') not in ('rejected', 'deleted', 'spam')
      and (coalesce(source, '') ilike '%hitex%'
           or (created_at >= '2026-10-06 00:00:00+03' and created_at < '2026-10-10 00:00:00+03'))
    order by created_at
  loop
    lang := case lower(coalesce(r.language, ''))
              when 'kurdish' then 'ku' when 'ku' then 'ku'
              when 'arabic' then 'ar' when 'ar' then 'ar'
              else 'en' end;
    cat := case when r.category_id is not null and exists (select 1 from public.categories c where c.id = r.category_id)
                then r.category_id end;
    addr := nullif(concat_ws(', ', nullif(trim(r.area), ''), nullif(trim(r.building), ''), nullif(trim(r.apartment), '')), '');
    note := nullif(concat_ws(' · ',
      'From HITEX26 sign-up #' || r.id,
      case when cat is null and coalesce(r.category_other, r.category_id) is not null
           then 'Category they chose: ' || coalesce(nullif(trim(r.category_other), ''), r.category_id) end,
      case when r.nfc then 'Wants ' || coalesce(r.nfc_qty, 1) || ' NFC card(s)' || coalesce(' named "' || nullif(trim(r.nfc_name), '') || '"', '') end,
      nullif(trim(r.note), '')), '');

    insert into public.businesses (
      status, source, category_id, city_id, phone, whatsapp, contact_name,
      name_en, name_ku, name_ar, description_en, description_ku, description_ar, sent_in_language,
      address, lat, lng, map_link, team_note, created_at)
    values (
      'pending', 'hitex26', cat,
      case when exists (select 1 from public.cities c where c.id = r.city_id) then r.city_id end,
      public.bmnassa_phone(r.phone),
      coalesce(public.bmnassa_phone(r.whatsapp), public.bmnassa_phone(r.phone)),
      nullif(trim(r.owner), ''),
      case when lang = 'en' then nullif(trim(r.business_name), '') end,
      case when lang = 'ku' then nullif(trim(r.business_name), '') end,
      case when lang = 'ar' then nullif(trim(r.business_name), '') end,
      case when lang = 'en' then nullif(trim(r.description), '') end,
      case when lang = 'ku' then nullif(trim(r.description), '') end,
      case when lang = 'ar' then nullif(trim(r.description), '') end,
      lang, addr,
      case when r.lat::text ~ '^-?\d+(\.\d+)?$' then r.lat::text::double precision end,
      case when r.lng::text ~ '^-?\d+(\.\d+)?$' then r.lng::text::double precision end,
      nullif(trim(r.map_link), ''), note, coalesce(r.created_at, now()))
    returning id into new_id;

    update public.registrations set business_id = new_id where id = r.id;
  end loop;
end $$;

-- 4) What came in: one row per HITEX26 business now waiting in /team
select b.id, coalesce(b.name_en, b.name_ku, b.name_ar) as business, b.contact_name, b.phone, b.city_id, b.category_id, b.team_note
from public.businesses b where b.source = 'hitex26' order by b.created_at;
