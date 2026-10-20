# Slice 7, part 4: NFC card orders

Database update: `supabase/migrations/013_nfc_orders.sql` (run once in Supabase → SQL Editor).

## Owners
- Dashboard → **Order NFC card** (/my/id/nfc): a preview of the printed card in the card's colour, name on the card, the line under the name, quantity (1–50, $15 each), delivery address, phone for delivery, and how they would like to pay (cash on delivery, FIB, FastPay, AsiaPay, ZainCash). Total, Place order, "Our team calls you to confirm before printing."
- Nothing is charged in the app: payment is arranged when the team calls. Online payment needs merchant accounts with each payment company (later).
- After ordering: "Order received" and the list of their orders with status (Waiting for our call, Confirmed, Printing, On the way, Delivered, Cancelled). They can cancel an order until the team confirms it.
- Only for the owner's own business, and only once it is live. Up to 5 orders waiting at once. The price is set by the database, not the phone.

## Team
- Back office → **NFC orders**: open orders first; business, name and line on the card, cards and total, address with a tap-to-call phone, how they pay, a status menu and a team note (e.g. "paid FIB, called 12:30").
