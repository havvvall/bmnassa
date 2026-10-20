# Slice 4 · Listing

What it adds: the customer side of Bmnassa, open to everyone without an account.

- **Home** (/home): city picker, search, every category (large tiles, small tiles, or a list with the number of businesses), and "Own a business? List it free". Bottom bar: Home, Wallet, Scan card, Account (Wallet and Scan card say they are coming in a later update).
- **Results** (/c/plumbing): live businesses in the chosen city, sorted by Top rated or Latest added, with a Filters row for districts, as a list or as tiles. Each row has a Call button.
- **Empty category:** shown, never hidden, with "Ask Bmnassa to find one" (opens WhatsApp to Bmnassa with the category and city filled in), other categories, another city, and "List it free".
- **Search** (/search): name, service, description, category or phone, in any of the 3 languages.
- **Business card** (/azad-cooling/card): the dark card with the person's name, Call and WhatsApp, Save contact (a contact file the phone can add), and on the back a QR code, the link and Share. Swipe sideways to flip, down to go back.
- **Business page** (/azad-cooling): the small card, Call, WhatsApp, Share this card, Save contact, About and Location.
- Shared links open straight on the card or page, even for someone who never opened Bmnassa before.

## Turn it on (once)

Supabase → SQL Editor (the full editor) → paste `supabase/migrations/005_listing.sql` → Run.

It adds the name shown on the card (filled from the owner's profile; the team can change it in /team) and two indexes so lists load fast.

## Not in this slice

Directions (needs the map pin), prices, opening hours, photos, Instagram/email/website links (slice 5, Edit my page). Reviews and Save to wallet (slice 7). Nearest-first sorting needs map pins. Ask Bmnassa chat comes later; for now the empty-category button opens WhatsApp.

The QR code generator is in `src/app/vendor/qrcode.js` (Apache 2.0, from qrcode-terminal).

New Kurdish and Arabic lines in `src/app/i18n.js` marked "new (slice 4)" need a native-speaker check.
