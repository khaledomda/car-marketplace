# Daleel | دليل — expert used-car buying guide for Saudi Arabia

Daleel helps people who have little experience buying used cars (first-time buyers, and women who want a
trusted advisor) find the best deal from trusted platforms and sellers. It installs on a phone as an app (PWA)
and works in Arabic (default) and English.

**Trial period:** the app does not ask for or collect any money. There are no payment endpoints in the code.

## What is in the app

| Feature | Where |
| --- | --- |
| Trial banner: "the app will not ask you for any money for now" | top of every screen, terms, footer |
| Two request modes: "I want a specific car" or "My budget" (from 5,000 SAR) | `#request` |
| Live budget guidance: models, expected age/mileage, best places to search | right of the form |
| **Best option, blurred** until the buyer accepts the terms (500 SAR fee on completed purchase, on the buyer's own liability, "we will not sue you", no money now) | `#best`, terms modal |
| Trust score (%) for each platform from 6 weighted criteria, with breakdown | `#platforms`, `public/data.js` |
| Seller trust checker (%) for individual sellers on Haraj/OpenSooq | `#safety` |
| Responsibility notice: we guide you; you are responsible for the mechanical and other checks; later we will inspect, and maybe add maintenance and delivery | `#safety`, `#roadmap` |
| Ratings (stars + comments) and visit counter shown publicly | hero stats, `#rate` |
| Female advisor option, WhatsApp-only contact option | request form |
| Admin dashboard: visits per day, requests, ratings, terms acceptances, CSV export, request status | `/admin` |

## Data collected

Stored in `data/db.json` (ignored by git): visits (anonymous visitor id, page, language, referrer, UTM, screen size,
hashed IP, user agent), car requests, terms acceptances and ratings. The privacy policy in the app describes this
in line with the Saudi Personal Data Protection Law (PDPL).

## Run

```bash
ADMIN_TOKEN=choose-a-long-secret npm start     # http://localhost:3000, admin at /admin
```

No dependencies; Node 18+. `npm run build:demo` writes a static backend-free copy to `dist/demo`
(demo mode keeps data on the device only).

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
