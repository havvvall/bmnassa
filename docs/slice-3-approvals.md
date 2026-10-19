# Slice 3 · Approval in the back office

What it adds: the new back office at **/team** (English only), following the signed-off "Back office, approvals" screen.

- **Pending approval:** every business waiting for review, newest first, with search by name or phone and city filters. The Languages column shows how many languages are still missing.
- **Review panel:** owner, category (can be corrected), city, district, subdistrict and phone, with Call owner and WhatsApp buttons. Name and description in English, Kurdish and Arabic, with a red dot on each missing language. A 5-line approval checklist.
- **Approve and publish:** possible only when the name is filled in all 3 languages (and the description too, if the owner wrote one) and every checklist line is ticked. The business goes live, gets its page name (bmnassa.com/azad-cooling, made from the English name), and its owner becomes "Business owner".
- **Reject with reason:** pick a ready reason or write one. The owner sees "Not approved" and the reason under My business.
- **Businesses:** every business with status filters (Live, Waiting for review, Not approved, Hidden). Approved or rejected businesses can be moved back to pending.
- Categories, cities and admins stay in the old back office (/admin) for now; the sidebar links to it.

Only team accounts can open /team. The database checks every change, so the page cannot be used by anyone else even if they find it.

## Turn it on (once)

Supabase → SQL Editor (the full editor) → paste `supabase/migrations/004_approvals.sql` → Run.

It adds when and by whom a business was reviewed, the rejection reason, and page names. Live businesses that had no page name get one.

## Not in this slice

The owner is not sent a message yet; they see the new status in the app. Messages by email or WhatsApp come later. The AI pre-check from the design comes in a later version.
