# Slice 2 · Owner sign-up

What it adds: a signed-in person can list a business. The form asks for the business name, category, city, district, subdistrict, phone (also used for WhatsApp) and an optional description, in the language they use. The business is saved as "Waiting for review" and shows under My business on the Account page. Signing in first is required; someone who opens /list while signed out comes back to it after signing in.

## Turn it on (once)

1. **Database.** Supabase → SQL Editor (the full editor) → paste `supabase/migrations/003_owner_signup.sql` → Run.
   - Adds the districts and subdistricts tables, filled from the locations list of 15 Oct 2026 (36 districts, 146 subdistricts). Rows with `needs_check = true` still need a local check; the team can fix names in the Table Editor.
   - Gives businesses an owner, district, subdistrict, and descriptions in 3 languages.
   - Rules: anyone sees live (approved) businesses; owners see their own whatever the status; a new business is always "pending"; owners cannot approve, verify or move a business to someone else; changing the name, category or phone of a live business sends it back for review; the team can change anything.
   - When the team sets a business to approved, its owner's role becomes "Business owner".
2. **Approve.** Until slice 3 builds the new approval screen, approve in today's back office (/admin → Pending approval), and fill in the English name there.

## Not in this slice

Map pin, photos, prices and opening hours come with Edit my page (slice 5). The approval screen with the language check is slice 3.

The Kurdish and Arabic lines in `src/app/i18n.js` marked "new (slice 2)" need a native-speaker check.
