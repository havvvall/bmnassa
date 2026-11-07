-- TEST DATA ONLY: gives approved businesses without a location a test point near the centre of Sulaymaniyah,
-- so the live map can be checked. Replace with real coordinates later (owners will add them in the app).
-- Safe to run more than once: it only touches rows whose lat/lng are still empty.
update public.businesses b
set
  lat = 35.5613 + ((abs(hashtext(b.id::text)) % 1000) - 500) / 10000.0,
  lng = 45.4305 + ((abs(hashtext(b.handle)) % 1000) - 500) / 10000.0
where b.status = 'approved'
  and (b.lat is null or b.lng is null);
