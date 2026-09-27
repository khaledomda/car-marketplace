# موقع أفضل المعروض للسيارات — Best Car Offers (used-car search engine, Saudi Arabia)

Daleel helps people who have little experience buying used cars (first-time buyers, and women who want a
trusted advisor) find the best deal from trusted platforms and sellers. It installs on a phone as an app (PWA)
and works in Arabic (default), English and Urdu (اردو).

**Trial period:** the app does not ask for or collect any money. There are no payment endpoints in the code.

## What is in the app

A search engine that saves buyers time: choose budget (from 5,000 SAR), make, model, years, city, body type
and features, and get **direct links to live results** on each platform, ranked by trust score.

| Feature | Notes |
| --- | --- |
| Direct links per platform | Haraj `/tags/<city>_<model year>/`, Syarah `/en/autos/<make>/<model>/<year>`, CarSwitch `/en/<city>/used-cars/<make>/<model>/<year>-price`, OpenSooq `/en/<city>/cars/cars-for-sale/<make>/<model>/<year>`, Motory `/en/cars-for-sale/<city>-haraj/<make>/<model>/`, YallaMotor `/used-cars/<make>/<model>/<year>` (URL formats checked Sept 2026; builders in `public/app.js` → `LINKS`) |
| Deep search | Google search limited to the six sites, with the model, years, city and chosen features (e.g. "فتحة سقف", "مالك واحد") so it matches words inside the ads |
| Real options for your budget | Models that fit the amount, each with direct Haraj / OpenSooq / Syarah / deep-search links |
| Best option, blurred until terms accepted | 500 SAR on completed purchase, buyer's own liability, no legal action, no money now |
| Liability in red | "We guide you; you are responsible for inspection, verification and avoiding fraud" above results, in Safety, terms and footer |
| No contact details collected | Name / phone / WhatsApp are off until official paperwork is complete (shown as "coming soon") |
| Trust score per platform, seller trust checker, ratings, visit counter | as before |
| Languages | Arabic (default), English, Urdu |

Why links and not copied listings: the platforms' ads are their content; copying (scraping) them breaks their
terms. Linking to their filtered live results is allowed and always up to date. A later phase can add official
data feeds or partnerships.

## Data collected

Stored in `data/db.json` locally or Upstash Redis on Vercel: visits (anonymous visitor id, page, language, referrer, UTM, screen size,
hashed IP, user agent, country/city on Vercel), searches (budget, make, model, years, city, body, features), terms acceptances and ratings.
The admin page shows top searched models, cities and features. The privacy policy in the app describes this
in line with the Saudi Personal Data Protection Law (PDPL).

## Deploy to Vercel

1. Upload this folder to Vercel (drag the unzipped folder into **vercel.com/new**, or push it to GitHub and import
   the repo). Framework preset: **Other**. No build command is needed; `vercel.json` sets everything.
2. The site works straight away in **demo mode** (each visitor's data stays on their own device).
3. To save requests, visits and ratings for real: in the Vercel project open **Storage → Marketplace →
   Upstash for Redis** (free plan), create a database and connect it to the project. It adds
   `KV_REST_API_URL` and `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`).
4. In **Settings → Environment Variables** add `ADMIN_TOKEN` with a long secret, then **Redeploy**.
5. Open `https://<your-site>.vercel.app/admin` and enter the token.

On Vercel the visits log also records the visitor's country, region and city from Vercel's geo headers.

## Run on your own server

```bash
ADMIN_TOKEN=choose-a-long-secret npm start     # http://localhost:3000, admin at /admin
```

No dependencies; Node 20+. Data is saved to `data/db.json`. `npm run build:demo` writes a static
backend-free copy to `dist/demo`.

## Code map

- `public/` the app (static files): `index.html`, `styles.css`, `app.js` (logic + Arabic/English/Urdu text), `data.js` (content)
- `lib/core.js` the API shared by both setups; `lib/file-store.js` JSON storage; `lib/redis-store.js` Upstash storage
- `api/index.js` Vercel function; `server.js` local server; `vercel.json` Vercel settings

## Updating content

Everything editorial lives in `public/data.js`: platform scores, pros and cons, budget tiers, the blurred
"best pick" for each tier, seller-check signals and cities. Scores and prices are team estimates
(September 2026); review them every quarter.

### Research notes behind the scores (Sept 2026)

- Syarah: 200+ point inspection, 1-year warranty, 10-day return, delivery; app rating 4.6 (company-reported), Trustpilot 1.8 from only 21 reviews.
- CarSwitch KSA (SafeSwitch): 200-point inspection, condition report, free warranty for cars under 12 years and 200,000 km, helps with ownership transfer.
- Motory, YallaMotor: large marketplaces with dealers and individuals; private listings are not inspected.
- Haraj, OpenSooq: largest stock and lowest prices but no inspection or warranty and reported scams; use with the seller checker.
- Official checks: Mojaz history report, Najm accident inquiry, Absher ownership transfer.

## Next steps (not built yet)

- Payments (switched off for the trial), inspection booking, maintenance, delivery.
- Native app store packaging (the PWA can be wrapped with Capacitor or a TWA).
- Moving storage from a JSON file to a database before real traffic.
