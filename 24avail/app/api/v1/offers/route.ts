import { ok } from "@/lib/api";
import { sql } from "@/lib/db";

export async function GET(req: Request) {
  const placement = new URL(req.url).searchParams.get("placement") || "home";
  const rows = await sql`
    SELECT o.id, o.title_en, o.title_ar, o.body_en, o.body_ar, o.badge, o.image_url, o.sponsored,
           coalesce(p.name_ar, p.name_en) AS pharmacy_name_ar, coalesce(p.name_en, p.name_ar) AS pharmacy_name_en
    FROM offers o LEFT JOIN pharmacies p ON p.id = o.pharmacy_id
    WHERE o.status = 'live' AND o.placement = ${placement} AND o.starts_at <= now() AND (o.ends_at IS NULL OR o.ends_at > now())
    ORDER BY o.sponsored DESC, o.priority DESC, o.created_at DESC LIMIT 8`;
  if (rows.length) sql`UPDATE offers SET impressions = impressions + 1 WHERE id = ANY(${rows.map((r) => r.id as string)}::uuid[])`.catch(() => {});
  return ok({ items: rows });
}
