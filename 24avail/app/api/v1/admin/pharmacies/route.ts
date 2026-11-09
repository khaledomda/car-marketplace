import { z } from "zod";
import { ok, fail, body, num } from "@/lib/api";
import { guard } from "@/lib/admin-guard";
import { sql } from "@/lib/db";
import { recordEvent } from "@/lib/events";
import { toE164SA, isSaudiMobile } from "@/lib/phone";

export async function GET(req: Request) {
  const g = await guard(); if (g) return g;
  const u = new URL(req.url);
  const q = u.searchParams.get("q");
  const like = q ? `%${q.replace(/[%_\\]/g, "")}%` : null;
  const rows = await sql`
    SELECT p.id, p.public_code, p.name_en, p.name_ar, p.district, p.phone, p.whatsapp, p.is_24h, p.delivery_mode, p.status,
           p.verified, p.is_demo, p.source, p.lat, p.lng, coalesce(s.requests_total,0)::int AS requests, coalesce(s.completed_services,0)::int AS completed
    FROM pharmacies p LEFT JOIN pharmacy_stats s ON s.pharmacy_id = p.id
    WHERE (${like}::text IS NULL OR p.name_en ILIKE ${like} OR p.name_ar ILIKE ${like} OR p.district ILIKE ${like})
    ORDER BY p.created_at DESC LIMIT 100 OFFSET ${num(u.searchParams.get("offset")) ?? 0}`;
  return ok({ items: rows });
}

const Schema = z.object({
  id: z.string().uuid().optional(),
  name_en: z.string().trim().max(120).nullable().optional(),
  name_ar: z.string().trim().max(120).nullable().optional(),
  district: z.string().trim().max(80).nullable().optional(),
  address: z.string().trim().max(200).nullable().optional(),
  phone: z.string().trim().max(30).nullable().optional(),
  whatsapp: z.string().trim().max(30).nullable().optional(),
  lat: z.number().min(-90).max(90).nullable().optional(),
  lng: z.number().min(-180).max(180).nullable().optional(),
  is_24h: z.boolean().optional(),
  delivery_mode: z.enum(["none", "own", "platform", "both"]).optional(),
  status: z.enum(["active", "hidden", "closed"]).optional(),
  verified: z.boolean().optional(),
});

export async function POST(req: Request) {
  const g = await guard(); if (g) return g;
  const b = await body(req, Schema);
  if (!b || (!b.id && !b.name_en && !b.name_ar)) return fail("invalid");
  const phone = b.phone !== undefined ? toE164SA(b.phone) : undefined;
  let whatsapp = b.whatsapp !== undefined ? toE164SA(b.whatsapp) : undefined;
  if (whatsapp === undefined && phone && isSaudiMobile(phone)) whatsapp = phone;
  const data: Record<string, unknown> = { ...b, phone, whatsapp };
  delete data.id;
  for (const k of Object.keys(data)) if (data[k] === undefined) delete data[k];
  try {
    if (b.id) {
      if (!Object.keys(data).length) return fail("nothing_to_update");
      await sql`UPDATE pharmacies SET ${sql(data)} WHERE id = ${b.id}`;
      await recordEvent({ type: "admin.pharmacy.updated", actorType: "admin", subjectType: "pharmacy", subjectId: b.id, payload: data });
      return ok({ id: b.id });
    }
    const [row] = await sql<{ id: string }[]>`INSERT INTO pharmacies ${sql({ ...data, source: "manual" })} RETURNING id`;
    await sql`INSERT INTO pharmacy_stats (pharmacy_id) VALUES (${row.id}) ON CONFLICT DO NOTHING`;
    await recordEvent({ type: "admin.pharmacy.created", actorType: "admin", subjectType: "pharmacy", subjectId: row.id, payload: data });
    return ok({ id: row.id });
  } catch (e) {
    const msg = String((e as Error).message || "");
    if (msg.includes("blocked_brand")) return fail("blocked_brand", 422);
    throw e;
  }
}
