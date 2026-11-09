import { sql } from "./_db";
import { buildSearchText } from "../lib/normalize";

export type DrugRow = {
  trade_name: string; trade_name_ar?: string | null; generic_name?: string | null; strength?: string | null;
  dosage_form?: string | null; route?: string | null; package_size?: string | null; manufacturer?: string | null;
  country?: string | null; reg_no?: string | null; price_sar?: number | null; legal_status?: string | null;
  product_type?: "human" | "herbal" | "supplement" | "veterinary" | "other"; atc_code?: string | null; aliases?: string[]; source: string;
};

export async function upsertDrugs(rows: DrugRow[]) {
  let n = 0;
  for (const r of rows) {
    const search_text = buildSearchText([r.trade_name, r.trade_name_ar, r.generic_name, r.aliases ?? [], r.strength, r.dosage_form]);
    const v = {
      trade_name: r.trade_name.trim(), trade_name_ar: r.trade_name_ar ?? null, generic_name: r.generic_name ?? null,
      strength: r.strength ?? null, dosage_form: r.dosage_form ?? null, route: r.route ?? null, package_size: r.package_size ?? null,
      manufacturer: r.manufacturer ?? null, country: r.country ?? null, reg_no: r.reg_no ?? null, price_sar: r.price_sar ?? null,
      legal_status: r.legal_status ?? null, product_type: r.product_type ?? "human", atc_code: r.atc_code ?? null,
      aliases: r.aliases ?? [], search_text, source: r.source,
    };
    if (v.reg_no) {
      await sql`INSERT INTO drugs ${sql(v)} ON CONFLICT (reg_no) WHERE reg_no IS NOT NULL
                DO UPDATE SET ${sql(v, "trade_name", "trade_name_ar", "generic_name", "strength", "dosage_form", "route", "package_size",
                  "manufacturer", "country", "price_sar", "legal_status", "product_type", "atc_code", "search_text", "source")}, updated_at = now()`;
    } else {
      await sql`INSERT INTO drugs ${sql(v)}
                ON CONFLICT (lower(trade_name), coalesce(lower(strength),''), coalesce(lower(dosage_form),'')) WHERE reg_no IS NULL
                DO UPDATE SET generic_name = EXCLUDED.generic_name, trade_name_ar = coalesce(EXCLUDED.trade_name_ar, drugs.trade_name_ar),
                  price_sar = coalesce(EXCLUDED.price_sar, drugs.price_sar), legal_status = coalesce(EXCLUDED.legal_status, drugs.legal_status),
                  aliases = EXCLUDED.aliases, search_text = EXCLUDED.search_text, updated_at = now()`;
    }
    n++;
  }
  return n;
}
