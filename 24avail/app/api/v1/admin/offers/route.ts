import { z } from "zod";
import { ok, fail, body } from "@/lib/api";
import { guard } from "@/lib/admin-guard";
import { sql } from "@/lib/db";
import { recordEvent } from "@/lib/events";

export async function GET() {
  const g = await guard(); if (g) return g;
  return ok({ items: await sql`SELECT o.*, coalesce(p.name_ar,p.name_en) AS pharmacy FROM offers o LEFT JOIN pharmacies p ON p.id=o.pharmacy_id ORDER BY o.created_at DESC LIMIT 200` });
}

const Schema = z.object({
  id: z.string().uuid().optional(),
  pharmacy_id: z.string().uuid().nullable().optional(),
  title_ar: z.string().trim().max(120).nullable().optional(),
  title_en: z.string().trim().max(120).nullable().optional(),
  body_ar: z.string().trim().max(400).nullable().optional(),
  body_en: z.string().trim().max(400).nullable().optional(),
  badge: z.string().trim().max(20).nullable().optional(),
  image_url: z.string().url().startsWith("https://").nullable().optional(),
  link_url: z.string().url().startsWith("https://").nullable().optional(),
  placement: z.enum(["home", "results", "pharmacy"]).optional(),
  sponsored: z.boolean().optional(),
  fee_amount: z.number().min(0).optional(),
  priority: z.number().int().optional(),
  status: z.enum(["pending", "live", "paused", "ended"]).optional(),
  ends_at: z.string().datetime().nullable().optional(),
});

export async function POST(req: Request) {
  const g = await guard(); if (g) return g;
  const b = await body(req, Schema);
  if (!b) return fail("invalid");
  const data: Record<string, unknown> = { ...b };
  delete data.id;
  for (const k of Object.keys(data)) if (data[k] === undefined) delete data[k];
  const [row] = b.id
    ? await sql<{ id: string }[]>`UPDATE offers SET ${sql(data)} WHERE id = ${b.id} RETURNING id`
    : await sql<{ id: string }[]>`INSERT INTO offers ${sql(data)} RETURNING id`;
  await recordEvent({ type: b.id ? "admin.offer.updated" : "admin.offer.created", actorType: "admin", subjectType: "offer", subjectId: row.id, payload: data });
  return ok({ id: row.id });
}
