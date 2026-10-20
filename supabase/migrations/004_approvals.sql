-- Bmnassa version 1 · slice 3: approval in the back office
-- Run once in Supabase → SQL Editor (the full editor). Safe to run again.
-- Needs 001, 002 and 003 already run.

-- 1) What the team decided, and when
alter table public.businesses add column if not exists reviewed_at timestamptz;
alter table public.businesses add column if not exists reviewed_by uuid references auth.users (id) on delete set null;
alter table public.businesses add column if not exists rejection_reason text;

-- 2) Page link names (bmnassa.com/azad-cooling): made from the English name when a business is first approved
create or replace function public.bmnassa_slug(txt text) returns text
language sql immutable as $$
  select nullif(trim(both '-' from regexp_replace(lower(coalesce(txt, '')), '[^a-z0-9]+', '-', 'g')), '')
$$;

-- Page names that would clash with app pages
create or replace function public.bmnassa_reserved_handle(h text) returns boolean
language sql immutable as $$
  select h = any (array['admin','team','account','list','welcome','signin','verify','name','wallet','search',
                        'register','stand','invitation','api','card','cards','help','about','terms','privacy','brand'])
$$;

create or replace function public.bmnassa_set_handle() returns trigger
language plpgsql security definer set search_path = public as $$
declare base text; candidate text; n int := 1;
begin
  if new.status = 'approved' and coalesce(new.handle, '') = '' then
    base := coalesce(public.bmnassa_slug(new.name_en), 'business-' || new.id);
    base := left(base, 40);
    candidate := base;
    while public.bmnassa_reserved_handle(candidate)
       or exists (select 1 from public.businesses where lower(handle) = candidate and id <> new.id) loop
      n := n + 1;
      candidate := base || '-' || n;
    end loop;
    new.handle := candidate;
  end if;
  return new;
end $$;

drop trigger if exists bmnassa_set_handle on public.businesses;
create trigger bmnassa_set_handle
  before insert or update of status, handle on public.businesses
  for each row execute function public.bmnassa_set_handle();

-- 3) Owner rules, updated: fixing a rejected business sends it back for review
create or replace function public.bmnassa_businesses_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or public.bmnassa_is_staff() then
    if tg_op = 'UPDATE' and new.status is distinct from old.status and new.status in ('approved', 'rejected') then
      new.reviewed_at := now();
      new.reviewed_by := auth.uid();
    end if;
    if new.status = 'approved' then
      new.rejection_reason := null;
    end if;
    new.updated_at := now();
    return new;
  end if;
  if tg_op = 'INSERT' then
    if (select count(*) from public.businesses where owner_id = auth.uid()) >= 10 then
      raise exception 'You can list up to 10 businesses. Contact Bmnassa for more.';
    end if;
    new.owner_id := auth.uid();
    new.status := 'pending';
    new.verified := false;
    new.rating := 0;
    new.reviews := 0;
    new.handle := null;
    new.created_at := now();
    new.reviewed_at := null;
    new.reviewed_by := null;
    new.rejection_reason := null;
  else
    new.id := old.id;
    new.owner_id := old.owner_id;
    new.verified := old.verified;
    new.rating := old.rating;
    new.reviews := old.reviews;
    new.handle := old.handle;
    new.created_at := old.created_at;
    new.reviewed_at := old.reviewed_at;
    new.reviewed_by := old.reviewed_by;
    if old.status = 'rejected' then
      -- The owner fixed it: back in the queue
      new.status := 'pending';
      new.rejection_reason := old.rejection_reason;
    elsif old.status = 'approved' and (new.name_en is distinct from old.name_en or new.name_ku is distinct from old.name_ku
        or new.name_ar is distinct from old.name_ar or new.category_id is distinct from old.category_id
        or new.phone is distinct from old.phone) then
      -- Changing the name, category or phone of a live business sends it back for review
      new.status := 'pending';
      new.rejection_reason := old.rejection_reason;
    else
      new.status := old.status;
      new.rejection_reason := old.rejection_reason;
    end if;
  end if;
  new.updated_at := now();
  return new;
end $$;

-- 4) The app asks "is this person on the team?" before opening the back office
grant execute on function public.bmnassa_is_staff() to authenticated;

-- 5) Live businesses that have no page name yet get one now
update public.businesses set handle = null where status = 'approved' and coalesce(handle, '') = '';
