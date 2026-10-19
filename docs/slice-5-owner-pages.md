# Slice 5 · Owner dashboard and Edit my page

What it adds:

- **My business** on Account: each business opens its dashboard; live ones show "Live · N views this week".
- **Dashboard** (/my/ID): status (waiting, live with a link to the page, or not approved with the reason), page views, call taps and WhatsApp taps for the last 7 days, the "Complete your page" checklist (each step opens the right part of Edit my page), and shortcuts. Card Studio, Order NFC card and My wallet say "Soon" (slices 6 and 7).
- **Edit my page** (/my/ID/edit): up to 8 photos (made small on the phone before uploading), name and description in English, Kurdish and Arabic, category, phone, the name on the card, prices in IQD, working hours (per day, or the same for every open day), map pin (tap or drag, or use my location) with an address line, and links (Instagram, Facebook, TikTok, email, website). Changing the name, category or phone of a live business sends it back for approval.
- **Customer side:** the business page shows photos, Directions (Google Maps), prices, opening hours, address and links; the card front lists Instagram, Facebook, TikTok, email and website; results and the card show "Open until 18:00" or "Closed · opens 9:00" (Baghdad time).
- **Counting:** each page or card view (once per visit) and each Call or WhatsApp tap is counted per day.
- **Owner's email** in /team: when the team types an email on a business that has no owner (HITEX26 ones, or ones added by the team), the account with that email gets the business: straight away if it exists, or the moment that person signs in for the first time. Live businesses make their new owner "Business owner".

## Turn it on (once)

Supabase → SQL Editor (the full editor) → paste `supabase/migrations/007_owner_pages.sql` → Run.

It adds the links, hours and owner's email columns, the prices and photos tables, the "business-photos" storage folder with its rules, the daily counts, and the email claiming.

## Not in this slice

Style tab / Card Studio (slice 6), Order NFC card, wallet and reviews (slice 7), "Improve with AI".

New Kurdish and Arabic lines in `src/app/i18n.js` marked "new (slice 5)" need a native-speaker check.
