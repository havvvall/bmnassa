# Slice 7, part 3: scanning paper cards

## Set-up (once)
1. **Database:** run `supabase/migrations/012_scan_cards.sql` in Supabase → SQL Editor (after 010 and 011).
2. **Claude key:** on console.anthropic.com create an API key (add billing first). Copy it.
3. **Secret:** Supabase → Edge Functions → Secrets → add `ANTHROPIC_API_KEY` with that key. Never paste the key in chat or in the code.
4. **Function:** Supabase → Edge Functions → Deploy a new function → Via Editor. Name it `scan-card`, replace the example code with `supabase/functions/scan-card/index.ts`, Deploy. Leave "Verify JWT" on.

Until steps 2–4 are done, scanning still works: the photos are cleaned and the person types the details ("Card reading isn't switched on yet").

## What people see
- **Scan card** (bottom bar), **Scan a paper card** and **+** in the wallet open the camera (/scan). Sign-in first if needed.
- **Camera:** gold frame, Front side · 1 of 2, then Back side · 2 of 2 (or "No back side"). Light button where the phone supports it, Upload a photo instead, a short vibration on Android.
- **Making your card perfect:** before and after; the steps tick off while it works: straighten and crop (finds the card's corners), fix colours and light (removes yellow light and grey shadows, keeps a coloured card its colour), sharpen text and logo, read the details (Claude). Use original or Looks good.
- **Check the details:** both cleaned sides, then Name, Company, Job title, Phone, WhatsApp, Email, Website, Instagram, Address. Fields Claude filled show an AI badge, with "AI can make mistakes, especially in Kurdish. Please check before saving." Save to my wallet.
- **In the wallet** the cleaned photo is the card; it flips to the back photo. Below it: name and job, Call, WhatsApp, Email, Website, Instagram. Edit details (/scan/edit/id) and remove (also deletes the photos).

## Privacy and cost
- Photos are stored privately in each person's own folder (bucket `wallet-scans`); only they can open them.
- The photos go to Claude only to be read; the function keeps nothing. Up to 30 reads per person per 24 hours.
- Model: Claude Haiku 4.5 (`claude-haiku-4-5-20251001`), the smallest and cheapest; check current prices on anthropic.com/pricing.

## Not in this part
- The full AI photo editing (removing fingers and coins) from the original screen; cleanup here is crop, straighten, colour and sharpen.
- Sharing a scanned card with others (the "Save this card to your wallet?" screen).
