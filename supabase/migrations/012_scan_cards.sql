-- Slice 7, part 3: scanning paper cards into the wallet.
-- Photos of scanned cards are private: each person's photos live in their own folder and only they can open them.
-- Reading a card with AI is limited per person per day, so a key can't be run up by one account.

-- 1. Private photo store
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('wallet-scans', 'wallet-scans', false, 4194304, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "people open their own scans" on storage.objects;
create policy "people open their own scans" on storage.objects
  for select to authenticated
  using (bucket_id = 'wallet-scans' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "people add their own scans" on storage.objects;
create policy "people add their own scans" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'wallet-scans' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "people remove their own scans" on storage.objects;
create policy "people remove their own scans" on storage.objects
  for delete to authenticated
  using (bucket_id = 'wallet-scans' and (storage.foldername(name))[1] = auth.uid()::text);

-- 2. Daily limit for AI reading (the scan-card function asks before each read)
create table if not exists public.scan_log (
  id bigserial primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  at timestamptz not null default now()
);
create index if not exists scan_log_user_idx on public.scan_log (user_id, at desc);
alter table public.scan_log enable row level security;
-- no policies: nobody reads or writes this table directly

create or replace function public.bmnassa_scan_start() returns integer
language plpgsql security definer set search_path = public as $$
declare used int;
declare daily int := 30;
begin
  if auth.uid() is null then raise exception 'Sign in to scan cards.'; end if;
  select count(*) into used from public.scan_log where user_id = auth.uid() and at > now() - interval '24 hours';
  if used >= daily then raise exception 'scan_limit'; end if;
  insert into public.scan_log (user_id) values (auth.uid());
  return daily - used - 1;
end $$;
revoke all on function public.bmnassa_scan_start() from public, anon;
grant execute on function public.bmnassa_scan_start() to authenticated;

-- 3. A scanned card keeps the back photo path in its details (data.back_path); the front is image_path.
-- People can change the details of their own scanned cards later (the wallet guard already keeps kind and owner fixed).
