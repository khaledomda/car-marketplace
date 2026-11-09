import "server-only";
import { sql } from "./db";
import { getSettings } from "./settings";

export type PublicPharmacy = {
  id: string;
  code: string;
  name: string;
  name_ar: string | null;
  name_en: string | null;
  district: string | null;
  lat: number | null;
  lng: number | null;
  is_24h: boolean;
  delivery_mode: string;
  verified: boolean;
  is_demo: boolean;
  distance_km: number | null;
  rating: number | null;
  rating_count: number;
  completed: number;
  likely_has: number;
  contactable: boolean;
  masked: boolean;
};

type Row = {
  id: string; public_code: string; name_en: string | null; name_ar: string | null; district: string | null;
  lat: number | null; lng: number | null; is_24h: boolean; delivery_mode: string; verified: boolean; is_demo: boolean;
  distance_km: number | null; rating_sum: string | null; rating_count: string | null; completed_services: string | null;
  likely_has: number; contactable: boolean;
};

function present(r: Row, reveal: boolean, locale: "ar" | "en"): PublicPharmacy {
  const rc = Number(r.rating_count ?? 0);
  const name = (locale === "ar" ? r.name_ar || r.name_en : r.name_en || r.name_ar) || "";
  return {
    id: r.id,
    code: r.public_code,
    name: reveal ? name : (locale === "ar" ? `صيدلية #${r.public_code}` : `Pharmacy #${r.public_code}`),
    name_ar: reveal ? r.name_ar : null,
    name_en: reveal ? r.name_en : null,
    district: r.district,
    lat: reveal ? r.lat : r.lat == null ? null : Math.round(r.lat * 100) / 100,
    lng: reveal ? r.lng : r.lng == null ? null : Math.round(r.lng * 100) / 100,
    is_24h: r.is_24h,
    delivery_mode: r.delivery_mode,
    verified: r.verified,
    is_demo: r.is_demo,
    distance_km: r.distance_km == null ? null : Math.round(r.distance_km * 10) / 10,
    rating: rc ? Math.round((Number(r.rating_sum) / rc) * 10) / 10 : null,
    rating_count: rc,
    completed: Number(r.completed_services ?? 0),
    likely_has: Number(r.likely_has ?? 0),
    contactable: r.contactable,
    masked: !reveal,
  };
}

/**
 * Rank pharmacies for a customer. Distance first (when location is shared), then learned
 * availability for the requested medicines, then completed services & rating.
 * Phone numbers are never returned here.
 */
export async function findPharmacies(opts: {
  lat?: number | null; lng?: number | null; drugIds?: string[]; limit?: number; offset?: number;
  q?: string; locale: "ar" | "en"; open24?: boolean; delivery?: boolean;
}): Promise<{ items: PublicPharmacy[]; radiusKm: number; enforced: boolean }> {
  const s = await getSettings();
  const hasLoc = typeof opts.lat === "number" && typeof opts.lng === "number";
  const lat = hasLoc ? opts.lat! : null;
  const lng = hasLoc ? opts.lng! : null;
  const radius = s.search_radius_km;
  const enforce = s.enforce_search_radius && hasLoc;
  const drugIds = (opts.drugIds ?? []).slice(0, 20);
  const limit = Math.min(opts.limit ?? 20, 50);
  const q = opts.q?.trim() ? `%${opts.q.trim().replace(/[%_\\]/g, "")}%` : null;
  // bounding-box prefilter keeps the distance math cheap even with thousands of pharmacies
  const dLat = radius / 111;
  const dLng = hasLoc ? radius / (111 * Math.cos((lat! * Math.PI) / 180)) : 0;

  const rows = await sql<Row[]>`
    WITH base AS (
      SELECT p.*,
        CASE WHEN ${lat}::float8 IS NULL OR p.lat IS NULL THEN NULL ELSE
          6371 * 2 * asin(sqrt(power(sin(radians(p.lat - ${lat}::float8) / 2), 2) +
            cos(radians(${lat}::float8)) * cos(radians(p.lat)) * power(sin(radians(p.lng - ${lng}::float8) / 2), 2)))
        END AS distance_km
      FROM pharmacies p
      WHERE p.status = 'active'
        AND (${q}::text IS NULL OR p.name_en ILIKE ${q} OR p.name_ar ILIKE ${q} OR p.district ILIKE ${q})
        AND (${!!opts.open24} = false OR p.is_24h)
        AND (${!!opts.delivery} = false OR p.delivery_mode <> 'none')
        AND (${enforce} = false OR (p.lat BETWEEN ${(lat ?? 0) - dLat} AND ${(lat ?? 0) + dLat}
                                AND p.lng BETWEEN ${(lng ?? 0) - dLng} AND ${(lng ?? 0) + dLng}))
    )
    SELECT b.id, b.public_code, b.name_en, b.name_ar, b.district, b.lat, b.lng, b.is_24h, b.delivery_mode,
           b.verified, b.is_demo, b.distance_km,
           st.rating_sum::text, st.rating_count::text, st.completed_services::text,
           (b.whatsapp IS NOT NULL OR b.phone IS NOT NULL) AS contactable,
           coalesce((SELECT count(*)::int FROM availability_signals a
                     WHERE a.pharmacy_id = b.id AND a.drug_id = ANY(${drugIds}::uuid[])
                       AND a.last_available_at > now() - interval '30 days'), 0) AS likely_has
    FROM base b
    LEFT JOIN pharmacy_stats st ON st.pharmacy_id = b.id
    WHERE (${enforce} = false OR b.distance_km <= ${radius})
    ORDER BY
      CASE WHEN b.distance_km IS NULL THEN 1 ELSE 0 END,
      (coalesce(b.distance_km, 0)
        - 0.8 * (SELECT count(*) FROM availability_signals a WHERE a.pharmacy_id = b.id AND a.drug_id = ANY(${drugIds}::uuid[]) AND a.last_available_at > now() - interval '30 days')
        - 0.05 * ln(1 + coalesce(st.completed_services, 0))
        - CASE WHEN b.whatsapp IS NULL THEN -0.5 ELSE 0 END),
      coalesce(st.completed_services, 0) DESC,
      b.is_demo ASC,
      b.name_en NULLS LAST
    LIMIT ${limit} OFFSET ${opts.offset ?? 0}`;

  const items = rows.map((r) => present(r, s.reveal_pharmacy_before_payment, opts.locale));
  // record visibility (feeds "search appearances" metric) without blocking the response
  if (items.length && drugIds.length) {
    sql`INSERT INTO pharmacy_stats (pharmacy_id, search_appearances)
        SELECT unnest(${items.map((i) => i.id)}::uuid[]), 1
        ON CONFLICT (pharmacy_id) DO UPDATE SET search_appearances = pharmacy_stats.search_appearances + 1`.catch(() => {});
  }
  return { items, radiusKm: radius, enforced: enforce };
}

export async function countPublic() {
  const [r] = await sql<{ pharmacies: number; drugs: number; herbal: number; searches: number; completed: number; requests: number }[]>`
    SELECT
      (SELECT count(*)::int FROM pharmacies WHERE status = 'active') AS pharmacies,
      (SELECT count(*)::int FROM drugs WHERE active) AS drugs,
      (SELECT count(*)::int FROM drugs WHERE active AND product_type = 'herbal') AS herbal,
      (SELECT count(*)::int FROM searches) AS searches,
      (SELECT count(*)::int FROM requests WHERE status = 'completed' AND NOT flagged) AS completed,
      (SELECT count(*)::int FROM requests) AS requests`;
  return r;
}
