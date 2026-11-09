import { searchDrugs } from "@/lib/search";
import { ok, num } from "@/lib/api";
import { context, touchCustomer } from "@/lib/request-context";
import { sql } from "@/lib/db";
import { normalizeText } from "@/lib/normalize";
import { bumpDaily, recordEvent } from "@/lib/events";
import { after } from "next/server";

export async function GET(req: Request) {
  const u = new URL(req.url);
  const q = (u.searchParams.get("q") || "").slice(0, 80);
  const type = u.searchParams.get("type");
  const final = u.searchParams.get("final") === "1";
  const items = await searchDrugs(q, 12, type && ["human", "herbal", "supplement"].includes(type) ? type : undefined);

  if (final && q.trim().length >= 2) {
    const ctx = await context();
    const lat = num(u.searchParams.get("lat"));
    const lng = num(u.searchParams.get("lng"));
    after(async () => {
      await sql`INSERT INTO searches (customer_id, query, normalized, source, results_count, top_drug_id, lat, lng)
                VALUES (${ctx.customerId}, ${q}, ${normalizeText(q)}, 'text', ${items.length}, ${items[0]?.id ?? null}, ${lat}, ${lng})`;
      if (items[0]) await sql`INSERT INTO drug_stats (drug_id, search_hits) VALUES (${items[0].id}, 1)
                              ON CONFLICT (drug_id) DO UPDATE SET search_hits = drug_stats.search_hits + 1`;
      if (ctx.customerId) await touchCustomer(ctx.customerId, "searches");
      await recordEvent({ type: "search", actorType: "customer", actorId: ctx.customerId, payload: { q, results: items.length }, ipHash: ctx.ipHash });
      await bumpDaily("searches");
    });
  }
  return ok({ items });
}
