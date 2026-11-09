# 24avail

**دواؤك، متاح في أقرب صيدلية** — patients in Al-Madinah Al-Munawwarah search any registered medicine or herbal product (brand, generic or scientific name, Arabic or English), or upload a prescription / medicine photo. Then they ask the nearest pharmacies on WhatsApp in one tap. Pharmacists confirm availability and completion from a link in the message. Every action is recorded so nothing is lost when the mobile app launches.

> Trial phase: free for patients and pharmacies, no fees. Built so that payments, service fees, pharmacy accounts, in-app notifications, the 7 km radius and hiding pharmacies until payment can be switched on later from the admin panel.

---

## What's inside

| Area | What it does |
|---|---|
| **Medicine search** | PostgreSQL trigram search over the SFDA registry plus herbal products. Handles typos and Arabic letter variants (أ/ا, ة/ه, ى/ي, diacritics, Arabic digits). Caps results so the database can't be dumped. Hot queries are cached. |
| **Prescription / photo reading** | `/api/v1/rx` sends the photo to Claude vision and gets back a structured list of medicines, then matches each one to the registry. The result goes straight into the search bar, and confident matches go into the patient's list. The image is **not stored**, only its SHA-256 fingerprint and the extracted names. |
| **Pharmacy ranking** | Ranks by distance (when the patient shares location), then by availability learned from past pharmacist answers, completed services and rating. Phone numbers are never sent in page HTML. |
| **WhatsApp requests** | Each request gets a reference (`24A-XXXXXX`), a prefilled bilingual WhatsApp message, and a secret pharmacist link (`/p/<token>`). |
| **Pharmacist confirmation** | One page to mark the request available, partly available, unavailable or completed, with an optional price and note. Updates counters, average response time and learned stock. A confirmation from the customer's own device is flagged and kept out of public stats. |
| **Ratings & history** | The patient sees live status on `/requests` and rates the pharmacy after it answers. |
| **Delivery** | Each request records how the patient wants it: pickup, pharmacy delivery, or platform delivery. Platform delivery switches on automatically once an active logistics partner exists. There are `deliveries` and adapter modules (`lib/partners`) for courier companies. |
| **Offers & paid ads** | Pharmacy offer cards plus a **"Drop your offer here"** paid ad slot that collects advertiser leads. Offers track impressions, clicks and fees. |
| **Partners** | Logistics companies, pharmacy groups, advertisers, insurers and payment providers are rows in `partners`, added from the admin panel. New integration styles are one adapter file. |
| **Admin "control room"** | `/admin`: KPIs, top searches (including searches with no results, which show what to stock), pharmacy performance, recent requests, pharmacies, partners, offers, applications, feature flags, and CSV export of every table. |
| **Excluded chains** | Al-Nahdi, Al-Dawaa and United are blocked in three places: in the importers, in the admin API, and by a **database trigger** (`blocked_brands`) that rejects them whatever the source. |

## Data that is kept forever (ready for the app)

* `events`: an append-only ledger of every search, visit, request, answer, completion, rating, admin change and import. UPDATE, DELETE and TRUNCATE are blocked by trigger.
* Counters for fast pages: `pharmacy_stats` (views, appearances, contacts, requests, answers, completions, rating sum/count, response time), `drug_stats`, `customers`, `daily_metrics`. All of them can be rebuilt from `events`.
* `availability_signals`: learned inventory per pharmacy × medicine.
* `customers.id` is the anonymous device id used today. `customers.account_id` links devices to real accounts when the app launches, so history, ratings and searches carry over.
* Tables that already exist for later: `pharmacy_accounts`, `payments`, `deliveries`, `partners`, `settings` (feature flags).

## Run it locally

```bash
cp .env.example .env.local
```

Edit `.env.local`: set `DATABASE_URL`, `APP_SECRET` (32+ characters) and `PUBLIC_BASE_URL`.

```bash
npm install
```

```bash
npm run db:migrate
```

```bash
npm run db:seed
```

Add `SEED_DEMO=1` to the seed command (`SEED_DEMO=1 npm run db:seed`) to also create six clearly marked demo pharmacies.

```bash
npm run admin:hash -- "a-strong-admin-password"
```

Put the printed `ADMIN_PASSWORD_HASH=...` line in `.env.local`.

```bash
npm run dev
```

Prescription reading needs `ANTHROPIC_API_KEY`. Without it, the upload buttons show "coming soon".

## Load the real data

**Pharmacies from Google Maps.** Uses the Places API (New). It scans Madinah in a grid, in Arabic and English, keeps phone numbers, marks mobiles as WhatsApp, and drops the excluded chains. Safe to re-run.

```bash
GOOGLE_MAPS_API_KEY=... npm run import:google
```

The free fallback uses OpenStreetMap (fewer phone numbers):

```bash
npm run import:osm
```

**All SFDA-registered medicines and herbal products.** Download the Excel export from the SFDA drugs list at sfda.gov.sa (and the herbal / health-products list if it is separate). Then:

```bash
npm run import:sfda -- ./sfda-drugs.xlsx
```

```bash
npm run import:sfda -- ./sfda-herbal.xlsx --type herbal
```

Headers are matched automatically in English or Arabic, and rows upsert by registration number.

## Deploy (built to grow)

* **App:** Vercel (or any Node host). Pages and APIs are stateless, so scale out by adding instances.
* **Database:** managed PostgreSQL (Neon, Supabase, RDS) through its **connection pooler**. Set `DB_PREPARE=false` when using PgBouncer transaction mode.
* **Rate limits across servers:** set `UPSTASH_REDIS_REST_URL` / `TOKEN`. Without them, limits are per instance.
* **Later, at large scale:** move search to Meilisearch or OpenSearch behind the same `searchDrugs()` interface. Partition `events` / `searches` by month. Use PostGIS for geo.

## Security & anti-copying

* All data access is server-side. Browsers never see the database, pharmacy phone lists, or business logic. Production builds ship no source maps.
* Public APIs answer only real sessions of this site: a signed device cookie is issued by middleware. Known bot and scraper user agents are refused, cross-origin POSTs are rejected, rate limits apply per route, and results are capped.
* Pharmacy numbers are released one at a time, logged and rate limited, or only inside a generated WhatsApp link.
* Tokens in links are stored only as HMAC hashes. IPs are stored only as keyed hashes. Prescription images are never stored.
* Strict security headers: CSP, HSTS, frame-deny, nosniff, referrer and permissions policy. `/p/*`, `/admin` and `/api` are excluded from indexing.
* Admin uses a scrypt password hash, an HttpOnly SameSite=strict signed cookie, a login rate limit, and every admin action is in the ledger.
* All inputs are validated with zod. Uploads are checked by magic bytes and size. Form spam is caught with a honeypot.
* Proprietary licence (see `LICENSE`).

## Switching on the next phases (admin → settings)

| Setting | Today | Later |
|---|---|---|
| `enforce_search_radius` / `search_radius_km` | `false` / `7` | `true`: only pharmacies within 7 km of the patient |
| `reveal_pharmacy_before_payment` | `true` | `false`: names and numbers stay masked until payment |
| `payments_enabled`, `service_fee` | off / 0 | on, with the fee type and amount |
| `notification_channel` | `whatsapp` | `app` |

## Project map

```
app/            pages (home, pharmacies, requests, partners, terms, admin, /p/[token]) + /api/v1/*
components/     UI (Finder, PharmacistPanel, AdminConsole, ...)
lib/            search, pharmacies, requests, rx (Claude vision), settings, events, security helpers, partner adapters
db/migrations/  forward-only SQL migrations
scripts/        migrate, seed, importers (Google, OSM, SFDA), admin password hash
data/           starter medicine catalogue
```
