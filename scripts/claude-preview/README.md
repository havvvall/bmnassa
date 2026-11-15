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
3. packs everything into one HTML page (`pack.cjs`): JS, CSS, logos, Leaflet and the intro slides inline;
   a small script answers Supabase requests from the recording.

## Limits

- Data is a snapshot from build time. Rebuild to pick up new businesses.
- Sign-in, reviews, saving, card scanning and orders return an error (no real backend).
- The map only has tiles for the area the recorder visited (central Sulaymaniyah); elsewhere shows grey.
- Downloads do nothing inside artifacts.
