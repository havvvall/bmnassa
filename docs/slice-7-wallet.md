# Slice 7, part 2: the wallet

Database update: `supabase/migrations/011_wallet.sql` (run once in Supabase → SQL Editor).

## What people see
- **Save to wallet** on every business page (next to Share this card) and on the card screen (under "Prices, reviews and location"). Not signed in: sign in first, then they come back. Once saved it shows "In your wallet" and opens the wallet.
- **/wallet** (bottom bar → Wallet): the gold "Bmnassa Wallet" page from the signed-off screen. Cards sit in a stack in each owner's card colour; tap one and it slides to the front. The front card shows its links, turns over to its QR code (swipe sideways or the flip button), opens the full card, or is removed (bin button).
- Search your cards, sort Newest first or A to Z (the ••• button), "+" to add a card (find a business; scanning paper cards comes in part 3), the card count and "Scan a paper card".
- Not signed in: "Create your free wallet" with Sign in with email. Empty wallet: "Your wallet is empty" with Find a business.

## Privacy
- Only the person can see their wallet. Owners see only a number on their dashboard ("Saved in 17 wallets"), never who.

## Owners
- Dashboard → My wallet opens their own wallet.

## Ready for part 3
- The wallet already holds "scanned" paper cards (name, title, company, phone, email) and draws them as light paper cards with a "Scanned" tag.
