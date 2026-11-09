import { z } from "zod";
import { ok, fail, body } from "@/lib/api";
import { guard } from "@/lib/admin-guard";
import { sql } from "@/lib/db";
import { recordEvent } from "@/lib/events";
import { availableAdapters } from "@/lib/partners";

export async function GET() {
  const g = await guard(); if (g) return g;
  return ok({ items: await sql`SELECT * FROM partners ORDER BY created_at DESC`, adapters: availableAdapters });
}

const Schema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(["logistics", "pharmacy_group", "advertiser", "insurer", "payment", "other"]),
  name: z.string().trim().min(2).max(120),
  name_ar: z.string().trim().max(120).nullable().optional(),
  contact: z.record(z.string()).optional(),
  config: z.object({ adapter: z.string() }).passthrough().optional(),
  coverage: z.record(z.unknown()).optional(),
  active: z.boolean().optional(),
});

export async function POST(req: Request) {
  const g = await guard(); if (g) return g;
  const b = await body(req, Schema);
  if (!b) return fail("invalid");
  const data = {
    type: b.type, name: b.name, name_ar: b.name_ar ?? null, active: b.active ?? true,
    contact: sql.json((b.contact ?? {}) as never), config: sql.json((b.config ?? { adapter: "manual" }) as never),
    coverage: sql.json((b.coverage ?? {}) as never),
  };
  const [row] = b.id
    ? await sql<{ id: string }[]>`UPDATE partners SET ${sql(data)}, updated_at = now() WHERE id = ${b.id} RETURNING id`
    : await sql<{ id: string }[]>`INSERT INTO partners ${sql(data)} RETURNING id`;
  await recordEvent({ type: b.id ? "admin.partner.updated" : "admin.partner.created", actorType: "admin", subjectType: "partner", subjectId: row.id, payload: { type: b.type, name: b.name } });
  return ok({ id: row.id });
}
