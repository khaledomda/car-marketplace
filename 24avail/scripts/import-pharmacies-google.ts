/**
 * Import every pharmacy in Al-Madinah from Google Maps (Places API — New).
 *   GOOGLE_MAPS_API_KEY=... npm run import:google
 * Scans the city in a grid so the 60-results-per-query limit is never hit, then keeps phone numbers.
 * Excluded chains (Al-Nahdi, Al-Dawaa, United) are dropped. Safe to re-run (upserts by place_id).
 */
import { sql } from "./_db";
import { MADINAH_BBOX, upsertPharmacy } from "./_pharmacies";

const KEY = process.env.GOOGLE_MAPS_API_KEY;
if (!KEY) { console.error("Set GOOGLE_MAPS_API_KEY"); process.exit(1); }

const FIELDS = [
  "places.id", "places.displayName", "places.formattedAddress", "places.location", "places.nationalPhoneNumber",
  "places.internationalPhoneNumber", "places.regularOpeningHours", "places.businessStatus", "places.addressComponents", "nextPageToken",
].join(",");

type Place = {
  id: string; displayName?: { text: string; languageCode?: string }; formattedAddress?: string; location: { latitude: number; longitude: number };
  nationalPhoneNumber?: string; internationalPhoneNumber?: string; businessStatus?: string;
  regularOpeningHours?: { periods?: Array<{ open: { day: number; hour: number }; close?: unknown }>; weekdayDescriptions?: string[] };
  addressComponents?: Array<{ longText: string; types: string[] }>;
};

async function textSearch(query: string, rect: { low: [number, number]; high: [number, number] }, language: string, pageToken?: string) {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": KEY!, "X-Goog-FieldMask": FIELDS },
    body: JSON.stringify({
      textQuery: query, includedType: "pharmacy", strictTypeFiltering: true, languageCode: language, pageSize: 20, pageToken,
      locationRestriction: { rectangle: { low: { latitude: rect.low[0], longitude: rect.low[1] }, high: { latitude: rect.high[0], longitude: rect.high[1] } } },
    }),
  });
  if (!res.ok) throw new Error(`Places ${res.status}: ${await res.text()}`);
  return (await res.json()) as { places?: Place[]; nextPageToken?: string };
}

const is24 = (p: Place) => !!p.regularOpeningHours?.periods?.some((x) => x.open.hour === 0 && !x.close) ||
  !!p.regularOpeningHours?.weekdayDescriptions?.every((d) => /24|مفتوح على مدار/i.test(d));

async function main() {
  const steps = 8; // 8x8 grid ≈ 4km cells
  const { south, west, north, east } = MADINAH_BBOX;
  const dLat = (north - south) / steps, dLng = (east - west) / steps;
  const seen = new Map<string, { ar?: Place; en?: Place }>();
  for (let i = 0; i < steps; i++) for (let j = 0; j < steps; j++) {
    const rect = { low: [south + i * dLat, west + j * dLng] as [number, number], high: [south + (i + 1) * dLat, west + (j + 1) * dLng] as [number, number] };
    for (const [q, lang] of [["صيدلية", "ar"], ["pharmacy", "en"]] as const) {
      let token: string | undefined;
      do {
        const r = await textSearch(q, rect, lang, token);
        for (const p of r.places ?? []) {
          if (p.businessStatus && p.businessStatus !== "OPERATIONAL") continue;
          const e = seen.get(p.id) ?? {};
          e[lang] = p; seen.set(p.id, e);
        }
        token = r.nextPageToken;
        if (token) await new Promise((r) => setTimeout(r, 1500));
      } while (token);
    }
    process.stdout.write(`\rgrid ${i * steps + j + 1}/${steps * steps} — ${seen.size} places`);
  }
  console.log();
  const tally: Record<string, number> = {};
  for (const [id, { ar, en }] of seen) {
    const p = (ar ?? en)!;
    const district = p.addressComponents?.find((c) => c.types.includes("sublocality") || c.types.includes("neighborhood"))?.longText ?? null;
    const res = await upsertPharmacy({
      source: "google", source_ref: id,
      name_ar: ar?.displayName?.text ?? null, name_en: en?.displayName?.text ?? null,
      district, address: p.formattedAddress ?? null, lat: p.location.latitude, lng: p.location.longitude,
      phone: p.internationalPhoneNumber ?? p.nationalPhoneNumber ?? null, is_24h: is24(p),
      opening_hours: p.regularOpeningHours?.weekdayDescriptions ?? null,
    });
    tally[res] = (tally[res] ?? 0) + 1;
  }
  await sql`INSERT INTO events (type, actor_type, payload) VALUES ('import.pharmacies', 'system', ${sql.json({ source: "google", ...tally })})`;
  console.log(tally);
  await sql.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
