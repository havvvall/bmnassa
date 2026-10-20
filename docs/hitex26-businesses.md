# HITEX26 sign-ups become businesses

`supabase/migrations/006_hitex_businesses.sql` copies every HITEX26 sign-up (sent from the stand iPad, or between 6 and 9 Oct 2026) into businesses, **waiting for review** in /team. Each sign-up is copied once; running the file again copies only new ones.

What is copied: business name and description (into the language they used), category (when it is one of ours; otherwise the note says what they chose), city, phone and WhatsApp (as +9647…), the owner's name (shown on the card), address, map pin, and a team note (sign-up number, NFC cards wanted).

In /team each one shows "HITEX26" under Came from. Before approving: call the owner, choose the category if it is missing, choose district and subdistrict, fill the missing languages, tick the checklist. Test entries can be rejected.

These businesses have no owner account yet. When the owner signs up in the app, the team can link the business to them (coming with slice 5).
