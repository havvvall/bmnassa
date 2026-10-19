# Slice 6 · Card Studio and card pages

What it adds:

- **Card Studio** (/my/ID/card, from the owner dashboard, the "Design your card" step, or the Style tab of Edit my page), with a live preview and Flip:
  - **Content:** photo or logo on the card, the name on the card, the line under the name.
  - **Style:** Classic (black and gold), Minimal (light paper), Bold (colour and big buttons), Wallet card (the NFC card on screen).
  - **Design:** card colour (8 colours or any colour), background (solid, carbon fibre, or a photo), icon colours (app colours or match the card).
  - **Buttons:** which links show and in what order (up to 8: Call, WhatsApp, Instagram, Facebook, TikTok, Email, Website, Directions) and the wide button on the Wallet card style.
  - **Publish:** goes live straight away, no approval needed. The card link and QR code never change.
- **Card pages** (/name/card) now draw the chosen style, front and back. The Wallet card back shows the QR code on the card with "Tap or scan to save".
- The business page shows the owner's card (Wallet card look) at the top.

## Turn it on (once)

Supabase → SQL Editor (the full editor) → paste `supabase/migrations/008_card_studio.sql` → Run. It adds one column for the card design.

## Not in this slice

Add to wallet (slice 7). Styling the business page itself (layout, page colours, button shapes from the "Edit my page, style" screen) comes later.

New Kurdish and Arabic lines in `src/app/i18n.js` marked "new (slice 6)" need a native-speaker check.
