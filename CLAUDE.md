# Bmnassa

- Version 1 of the app lives in `src/app/` on the `v1-accounts` branch. `main` is the deployed site (Vercel + Cloudflare); do not merge into it without asking.
- Data comes from the live Supabase project (`src/app/api.js`). Testing sign-up, reviews or orders writes real records.

## Claude preview (artifact)

There is a live tap-through preview of the app as a Claude artifact:
https://claude.ai/artifact/FwZ31X4q2oaMngyvE686dS (slug `78fdd8cc-39fa-4801-9b84-9ba7cd3263bd`).

After app changes, rebuild and republish it to that same slug:

1. `bash scripts/claude-preview/build.sh` → `dist/claude-preview/index.html`
2. Republish with the artifacts `publish_files` tool: slug above, `base_version` from `get_artifact`, file `as: index.html`.

Details and limits: `scripts/claude-preview/README.md`.
