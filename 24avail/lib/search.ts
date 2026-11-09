import "server-only";
import { sql } from "./db";
import { normalizeText } from "./normalize";
import { TTLCache } from "./lru";

export type DrugHit = {
  id: string;
  trade_name: string;
  trade_name_ar: string | null;
  generic_name: string | null;
  strength: string | null;
  dosage_form: string | null;
  package_size: string | null;
  manufacturer: string | null;
  price_sar: string | null;
  legal_status: string | null;
  product_type: string;
  reg_no: string | null;
  score: number;
};

const cache = new TTLCache<DrugHit[]>(5000, 120_000);
export const MAX_RESULTS = 20; // hard cap: the registry can't be dumped through the API

/**
 * Search the medicine registry by brand, generic or scientific name (Arabic or English).
 * Uses PostgreSQL trigram indexes: typo tolerant, sub-10ms on ~50k rows.
 * Interface is deliberately small so it can be swapped for Meilisearch/OpenSearch later.
 */
export async function searchDrugs(q: string, limit = 12, type?: string): Promise<DrugHit[]> {
  const n = normalizeText(q).slice(0, 80);
  if (n.length < 2) return [];
  limit = Math.min(Math.max(1, limit), MAX_RESULTS);
  const key = `${n}|${limit}|${type ?? ""}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const like = "%" + n.replace(/[%_\\]/g, (m) => "\\" + m) + "%";
  const rows = await sql<DrugHit[]>`
    SELECT d.id, d.trade_name, d.trade_name_ar, d.generic_name, d.strength, d.dosage_form, d.package_size,
           d.manufacturer, d.price_sar::text AS price_sar, d.legal_status, d.product_type, d.reg_no,
           (CASE WHEN d.search_text LIKE ${n + "%"} THEN 1.0
                 WHEN d.search_text LIKE ${like} THEN 0.7 ELSE 0 END
            + word_similarity(${n}, d.search_text)
            + coalesce(ln(1 + s.search_hits) / 50, 0))::float AS score
    FROM drugs d
    LEFT JOIN drug_stats s ON s.drug_id = d.id
    WHERE d.active
      AND (${type ?? null}::text IS NULL OR d.product_type = ${type ?? null})
      AND (d.search_text LIKE ${like} OR ${n} <% d.search_text)
    ORDER BY score DESC, d.trade_name
    LIMIT ${limit}`;
  cache.set(key, rows);
  return rows;
}

export async function getDrugsByIds(ids: string[]) {
  if (!ids.length) return [];
  return sql<{ id: string; trade_name: string; generic_name: string | null; strength: string | null; dosage_form: string | null }[]>`
    SELECT id, trade_name, generic_name, strength, dosage_form FROM drugs WHERE id = ANY(${ids}::uuid[]) AND active`;
}
