import { ok } from "@/lib/api";
import { guard } from "@/lib/admin-guard";
import { sql } from "@/lib/db";

export async function GET() {
  const g = await guard(); if (g) return g;
  const [totals] = await sql`
    SELECT (SELECT count(*)::int FROM pharmacies WHERE status='active') AS pharmacies,
           (SELECT count(*)::int FROM drugs) AS drugs,
           (SELECT count(*)::int FROM customers) AS customers,
           (SELECT count(*)::int FROM searches) AS searches,
           (SELECT count(*)::int FROM requests) AS requests,
           (SELECT count(*)::int FROM requests WHERE status='completed' AND NOT flagged) AS completed,
           (SELECT count(*)::int FROM requests WHERE flagged) AS flagged,
           (SELECT count(*)::int FROM ratings) AS ratings,
           (SELECT count(*)::int FROM rx_uploads) AS rx_reads,
           (SELECT count(*)::int FROM events) AS events,
           (SELECT count(*)::int FROM partner_applications WHERE status='new') AS new_applications`;
  const daily = await sql`SELECT day::text, metric, value::int FROM daily_metrics WHERE day > current_date - 30 ORDER BY day`;
  const topSearches = await sql`SELECT normalized AS q, count(*)::int AS n, sum(CASE WHEN results_count=0 THEN 1 ELSE 0 END)::int AS misses
                                FROM searches WHERE created_at > now() - interval '30 days' GROUP BY 1 ORDER BY 2 DESC LIMIT 15`;
  const topPharmacies = await sql`SELECT p.id, coalesce(p.name_ar,p.name_en) AS name, s.requests_total::int, s.completed_services::int,
                                    s.rating_count::int, CASE WHEN s.rating_count>0 THEN round(s.rating_sum::numeric/s.rating_count,1) END AS rating,
                                    round(s.avg_response_secs::numeric/60,1) AS avg_response_min
                                  FROM pharmacy_stats s JOIN pharmacies p ON p.id=s.pharmacy_id ORDER BY s.requests_total DESC LIMIT 15`;
  const recent = await sql`SELECT r.ref_code, r.status, r.flagged, r.fulfillment, r.created_at::text, coalesce(p.name_ar,p.name_en) AS pharmacy
                           FROM requests r JOIN pharmacies p ON p.id=r.pharmacy_id ORDER BY r.created_at DESC LIMIT 20`;
  return ok({ totals, daily, topSearches, topPharmacies, recent });
}
