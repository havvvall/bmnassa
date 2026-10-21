-- 014 · "Most called this week" on the home screen
-- Adds up call and WhatsApp taps per category for one city over the last 7 days.
-- Only category totals come out (never one business's numbers), and only categories
-- with at least 3 taps, so a category with a single business does not give its count away.

create or replace function public.bmnassa_top_called(city text, days int default 7)
returns table (category_id text, taps bigint)
language sql stable security definer set search_path = public as $$
  select b.category_id::text, sum(s.calls + s.whatsapp)::bigint as taps
  from public.page_stats s
  join public.businesses b on b.id = s.business_id
  where b.city_id = city
    and public.bmnassa_business_is_live(b.id)
    and s.day >= ((now() at time zone 'Asia/Baghdad')::date - greatest(1, least(days, 31)) + 1)
  group by b.category_id
  having sum(s.calls + s.whatsapp) >= 3
  order by taps desc
  limit 5;
$$;
revoke all on function public.bmnassa_top_called(text, int) from public;
grant execute on function public.bmnassa_top_called(text, int) to anon, authenticated;
