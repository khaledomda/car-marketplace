/**
 * Free fallback: import pharmacies in Al-Madinah from OpenStreetMap (Overpass API).
 *   npm run import:osm            (or: npm run import:osm -- path/to/overpass.json)
 */
import { readFileSync } from "node:fs";
import { sql } from "./_db";
import { MADINAH_BBOX, upsertPharmacy } from "./_pharmacies";

type El = { type: string; id: number; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> };

async function main() {
  let data: { elements: El[] };
  if (process.argv[2]) data = JSON.parse(readFileSync(process.argv[2], "utf8"));
  else {
    const { south, west, north, east } = MADINAH_BBOX;
    const q = `[out:json][timeout:60];(nwr["amenity"="pharmacy"](${south},${west},${north},${east});nwr["healthcare"="pharmacy"](${south},${west},${north},${east}););out center tags;`;
    const res = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: "data=" + encodeURIComponent(q) });
    data = await res.json();
  }
  const tally: Record<string, number> = {};
  for (const e of data.elements) {
    const t = e.tags ?? {};
    const lat = e.lat ?? e.center?.lat, lng = e.lon ?? e.center?.lon;
    if (lat == null || lng == null) continue;
    const r = await upsertPharmacy({
      source: "osm", source_ref: `${e.type}/${e.id}`,
      name_ar: t["name:ar"] ?? (/[؀-ۿ]/.test(t.name ?? "") ? t.name : null),
      name_en: t["name:en"] ?? (!/[؀-ۿ]/.test(t.name ?? "") ? t.name ?? null : null),
      district: t["addr:suburb"] ?? t["addr:district"] ?? null,
      address: [t["addr:street"], t["addr:housenumber"]].filter(Boolean).join(" ") || null,
      lat, lng, phone: t.phone ?? t["contact:phone"] ?? t["contact:whatsapp"] ?? null,
      is_24h: t.opening_hours === "24/7", opening_hours: t.opening_hours ? [t.opening_hours] : null, metadata: { brand: t.brand ?? null },
    });
    tally[r] = (tally[r] ?? 0) + 1;
  }
  await sql`INSERT INTO events (type, actor_type, payload) VALUES ('import.pharmacies', 'system', ${sql.json({ source: "osm", ...tally })})`;
  console.log(tally);
  await sql.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
