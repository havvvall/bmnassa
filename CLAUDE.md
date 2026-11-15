# Bmnassa

Bmnassa ("بمناسە") is a mobile-first web app for finding trusted local services in Kurdistan, Iraq
(Sulaymaniyah and Erbil live; Duhok, Kirkuk and Halabja coming). It has three kinds of users:

- **Customers** browse businesses by city and category without an account, call or WhatsApp them,
  save their cards in a wallet, scan paper business cards, and rate businesses they contacted.
- **Business owners** list a business, wait for approval, then edit their page, design their digital card,
  see views and taps, reply to reviews, choose a plan and order printed NFC cards.
- **The Bmnassa team** approves sign-ups, hides reviews, handles NFC orders and suggestions in the back office (`/team`).

Everything is in English, Kurdish (Sorani) and Arabic. Kurdish and Arabic are right-to-left.

## Branches and deploys

- **`v1-accounts`** holds version 1, the app in `src/app/`. Work here (or on a branch from it).
- **`main`** is the deployed site: Vercel and Cloudflare build it automatically on every push.
  Never merge into `main` or push to it without the owner asking. Vercel also builds a preview link for every branch push.
- `bmnassa.com` shows the landing page (`src/app/landing/Landing.jsx`); `app.bmnassa.com` and every other host show the app (`src/main.jsx`).
- `src/App.jsx` (about 6,900 lines) is the old prototype. Nothing imports it any more; leave it alone unless asked.

## Run and check

    npm install
    npm run dev        # http://localhost:5173
    npm run build      # the only automated check: there are no tests or linter

After a change, run `npm run build`, then open the screens you touched in a phone-sized window,
in English and in Kurdish (right-to-left). Mobile Safari and Android Chrome are the real targets.

## Stack

- React 18 + Vite 5. **No other runtime dependencies**: no router, no state library, no UI kit, no Supabase SDK.
  Do not add npm packages without asking. Small third-party code is vendored (`src/app/vendor/qrcode.js`);
  Leaflet for maps is loaded from cdnjs at run time (`src/app/map/MapScreen.jsx`).
- Plain CSS: one stylesheet per screen folder (`browse.css`, `owner.css`, …) plus `app.css` (theme tokens, shared pieces)
  and `smooth.css` (loaded last; refines every screen).
- Supabase (Postgres, auth by email code, storage, one edge function) over plain `fetch`.

## Code map (`src/app/`)

| Path | What it is |
| --- | --- |
| `App.jsx` | The shell: routing, boot and sign-in redirects, welcome/sign-in/name/account/list-business/plans screens, bottom bar |
| `api.js` | **Every** call to Supabase: auth session, REST queries, storage uploads, RPCs. Screens never call `fetch` themselves |
| `i18n.js` | All app words: `T.key = [English, Kurdish, Arabic]`; `t(lang, key, vars)`, `pick(row, "name", lang)`, `dirOf`, `ago`, `bizCount` |
| `browse/` | Customer side: home, category results (`/c/:category`), search, business page, card page |
| `map/` | Live map of services near you |
| `wallet/` | Saved cards (businesses and scanned paper cards) |
| `scan/` | Camera, card detection and clean-up on the phone (`image.js`), text parsing (`parseCard.js`) |
| `reviews/` | Reviews list and the rate screen |
| `owner/` | Owner dashboard, Edit my page, page style, NFC card order |
| `card/` | Card Studio and the card faces (`CardFaces.jsx`, `Card3D.jsx`) |
| `plans/` | Plan chooser (`plans.js` has the nine plans and IQD prices) |
| `team/` | Back office at `/team` (English only) |
| `welcome/`, `intro/`, `landing/` | First-open screens; the intro slides are a static page in `public/intro/index.html` shown in an iframe |
| `theme.js`, `motion.js`, `Skeleton.jsx` | Themes (Auto, Bmnassa silver, Dark), motion helpers, loading placeholders |
| `hours.js`, `pageStyle.js`, `site.js` | Opening hours, owner page colours, the public host name |

`public/` also holds standalone HTML pages that are not part of the React app: the old back office (`/admin`),
event pages (`/stand`, `/register`, `/invitation`) and a few hand-made profile pages. `vercel.json` and `public/_redirects` route them.

## Routing

`usePath()` in `App.jsx` reads `window.location.pathname`; `go(path)` pushes history and swaps the screen with a View Transition.
A single-word path that is not in `APP_WORDS` is a business page (`/azad-cooling`, `/azad-cooling/card`, `/reviews`, `/rate`).
**When you add a top-level route, add its first word to `APP_WORDS`**, or it will be read as a business name.

Main routes: `/welcome`, `/intro`, `/path`, `/home`, `/search`, `/c/:category`, `/map`, `/wallet`, `/scan`, `/scan/edit/:id`,
`/signin`, `/verify`, `/name`, `/account`, `/list`, `/plans`, `/plan/setup`, `/my/:id`, `/my/:id/edit`, `/my/:id/card`, `/my/:id/nfc`, `/team`.

## Data and Supabase

- The project URL and publishable key are defaults in `api.js`; `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` override them
  (use these to point a local copy at your own Supabase project).
- **The default is the live database.** Signing up, reviewing, ordering or approving while testing writes real records.
- Security lives in the database: row-level security on every table, and SQL functions (`bmnassa_is_staff`, `bmnassa_track`, …).
  The app only shows and sends; it never decides who may do what.
- Schema changes are SQL files in `supabase/migrations/` (`001`–`020`; there is no `017`), run **by hand** in
  Supabase → SQL Editor. A new change gets the next number, must be safe to run twice (`if not exists`, `create or replace`),
  and needs a "Turn it on (once)" note in its doc. `api.js` falls back gracefully when a newer column is missing
  (see `withFallback`), so the app keeps working before a migration has been run.
- `supabase/functions/scan-card/` reads card photos with Claude. It is switched off (`READ_WITH_AI = false` in `scan/Scan.jsx`)
  until billing is set up; never put an API key in the code.
- Tables: `profiles`, `cities`, `categories`, `districts`, `subdistricts`, `businesses`, `business_prices`, `business_photos`,
  `page_stats`, `business_contacts`, `reviews`, `wallet_items`, `nfc_orders`, `business_suggestions`, `plan_orders`, `scan_log`.

## Conventions

- **Every word on screen goes through `t()`** and needs all three languages in `i18n.js`. Kurdish and Arabic lines you write
  are drafts: mark them `// new (…), needs a native-speaker check`, as the file already does.
- **Right-to-left:** use logical CSS (`margin-inline-start`, `inset-inline-end`, `text-align: start`) and check that
  arrows, swipes and animations flip in Kurdish and Arabic.
- Business text comes in three columns (`name_en`, `name_ku`, `name_ar`, same for descriptions); show it with `pick()`.
- Phone numbers are stored as `+9647…`; use `normalisePhone` and `prettyPhone` from `api.js`.
- Respect **Reduce motion** (`calm()` from `motion.js`) and keep timings from the theme tokens in `app.css`.
  `docs/motion-polish.md` describes the motion rules.
- Style follows the Bmnassa design system: silver theme and a dark theme, gold accents (`--accent`). Reuse the tokens
  in `app.css` instead of new colours.
- Comments and docs are written in plain, non-technical English, because the owner reads them. Each feature "slice" has a doc in `docs/`
  (what it adds, how to turn it on, what is not in it yet); add or update one when you add a feature.

## Feature history (`docs/`)

1 accounts and email sign-in · 2 owner sign-up · 3 approvals in `/team` · 4 listing (home, results, search, card, page) ·
5 owner dashboard and Edit my page · 6 Card Studio · 7 reviews, wallet, card scanning, NFC orders.
Later work without its own doc: plans, live map, bigger Scan button, landing page.

## Claude preview (artifact)

There is a live tap-through preview of the app as a Claude artifact:
https://claude.ai/artifact/FwZ31X4q2oaMngyvE686dS (slug `78fdd8cc-39fa-4801-9b84-9ba7cd3263bd`, owned by the repo owner's Claude account).

After app changes, rebuild and republish it to that same slug:

1. `bash scripts/claude-preview/build.sh` → `dist/claude-preview/index.html`
2. Republish with the artifacts `publish_files` tool: slug above, `base_version` from `get_artifact`, file `as: index.html`.
   Only the owner's Claude account can republish it; other people can build the file and publish their own preview.

The preview runs in demo mode (`scripts/claude-preview/demo.js`): signed in as a demo owner who is also on the team, with an in-memory fake database and a PAGES tab that jumps to every screen. Add new routes to the PAGES list in `demo.js` and new tables or RPCs to its fake database when the app grows.

Details and limits: `scripts/claude-preview/README.md`.
