# Claude preview

A tap-through copy of the app that runs inside a Claude artifact, so people can try V1 from their Claude account.

**Preview link:** https://claude.ai/artifact/FwZ31X4q2oaMngyvE686dS
(artifact slug `78fdd8cc-39fa-4801-9b84-9ba7cd3263bd`, owned by havvvall's Claude account; share it from the page's Share button)

## Rebuild after a change

From the repo root:

    bash scripts/claude-preview/build.sh

This writes `dist/claude-preview/index.html` (about 4 MB, not committed). Then republish it to the same artifact
(in a Claude session: "rebuild and republish the Claude preview").

Needs: Node, `npm install` done, Playwright with Chromium (`npm i -g playwright && npx playwright install chromium`
on a laptop; Claude cloud sessions already have it), and network access to the Supabase project,
cdnjs.cloudflare.com and tile.openstreetmap.org.

## How it works

Artifacts block network requests, remote images and extra files, so the build:

1. builds the app with Vite,
2. opens it in a headless browser and records the Supabase data, business photos and map tiles it loads (`record.cjs`),
3. packs everything into one HTML page (`pack.cjs`): JS, CSS, logos, Leaflet and the intro slides inline,
4. adds demo mode (`demo.js`): a small in-memory database answers every Supabase request, seeded from the
   recording plus demo rows (reviews, stats, prices, wallet cards, an NFC order, two sign-ups waiting for approval).

## Demo mode

- The preview opens signed in as **Demo Owner**, who owns the first recorded business and is also on the team,
  so every page opens: account, owner pages, card studio, NFC orders, plans and the back office (/team).
- Signing out and in again works with any email and any 6-digit code.
- The yellow **PAGES** tab on the left jumps to any screen; "Restart the demo" clears everything.
- Saving, reviews, orders and approvals work but only in the page's memory: nothing reaches Supabase,
  and a reload starts fresh.

## Limits

- Data is a snapshot from build time. Rebuild to pick up new businesses.
- Changes are pretend and reset on reload. The camera does not open inside artifacts, so Scan shows its
  "camera blocked" state; "Edit a scanned card" in PAGES shows the result screen.
- The map only has tiles for the area the recorder visited (central Sulaymaniyah); elsewhere shows grey.
- Downloads do nothing inside artifacts.
