import { sql } from "./_db";
import { toE164SA, isSaudiMobile } from "../lib/phone";

// Excluded chains — also enforced by a database trigger (see 001_init.sql).
export const BLOCKED = [/nahdi/i, /النهدي/, /\bdawaa\b/i, /\bal[- ]?dawa\b/i, /صيدليات\s+الدواء/, /^\s*(صيدلية\s+)?الدواء\s*$/, /\bunited\s*pharm/i, /صيدليات?\s+المتحدة/];
export const isBlocked = (...names: Array<string | null | undefined>) => names.some((n) => n && BLOCKED.some((re) => re.test(n)));

// Rough bounding box of Al-Madinah Al-Munawwarah urban area
export const MADINAH_BBOX = { south: 24.33, west: 39.42, north: 24.62, east: 39.80 };

export type PharmacyIn = {
  source: string; source_ref: string; name_en?: string | null; name_ar?: string | null; district?: string | null;
  address?: string | null; lat: number; lng: number; phone?: string | null; is_24h?: boolean; opening_hours?: unknown; metadata?: unknown;
};

export async function upsertPharmacy(p: PharmacyIn): Promise<"inserted" | "updated" | "blocked" | "skipped"> {
  if (isBlocked(p.name_en, p.name_ar)) return "blocked";
  if (!p.name_en && !p.name_ar) return "skipped";
  const phone = toE164SA(p.phone);
  const whatsapp = phone && isSaudiMobile(phone) ? phone : null;
  try {
    const [r] = await sql<{ inserted: boolean }[]>`
      INSERT INTO pharmacies (source, source_ref, name_en, name_ar, district, address, lat, lng, phone, whatsapp, is_24h, opening_hours, metadata)
      VALUES (${p.source}, ${p.source_ref}, ${p.name_en ?? null}, ${p.name_ar ?? null}, ${p.district ?? null}, ${p.address ?? null},
              ${p.lat}, ${p.lng}, ${phone}, ${whatsapp}, ${p.is_24h ?? false}, ${p.opening_hours ? sql.json(p.opening_hours as never) : null},
              ${sql.json((p.metadata ?? {}) as never)})
      ON CONFLICT (source, source_ref) DO UPDATE SET
        name_en = coalesce(EXCLUDED.name_en, pharmacies.name_en), name_ar = coalesce(EXCLUDED.name_ar, pharmacies.name_ar),
        district = coalesce(EXCLUDED.district, pharmacies.district), address = coalesce(EXCLUDED.address, pharmacies.address),
        lat = EXCLUDED.lat, lng = EXCLUDED.lng,
        phone = coalesce(pharmacies.phone, EXCLUDED.phone),          -- never overwrite a number an admin corrected
        whatsapp = coalesce(pharmacies.whatsapp, EXCLUDED.whatsapp),
        is_24h = EXCLUDED.is_24h OR pharmacies.is_24h,
        opening_hours = coalesce(EXCLUDED.opening_hours, pharmacies.opening_hours)
      RETURNING (xmax = 0) AS inserted`;
    await sql`INSERT INTO pharmacy_stats (pharmacy_id) SELECT id FROM pharmacies WHERE source = ${p.source} AND source_ref = ${p.source_ref} ON CONFLICT DO NOTHING`;
    return r.inserted ? "inserted" : "updated";
  } catch (e) {
    if (String((e as Error).message).includes("blocked_brand")) return "blocked";
    throw e;
  }
}
