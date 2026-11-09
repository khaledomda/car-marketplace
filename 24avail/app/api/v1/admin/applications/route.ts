import { z } from "zod";
import { ok, fail, body } from "@/lib/api";
import { guard } from "@/lib/admin-guard";
import { sql } from "@/lib/db";

export async function GET() {
  const g = await guard(); if (g) return g;
  return ok({ items: await sql`SELECT * FROM partner_applications ORDER BY created_at DESC LIMIT 200` });
}
export async function POST(req: Request) {
  const g = await guard(); if (g) return g;
  const b = await body(req, z.object({ id: z.string().uuid(), status: z.enum(["new", "contacted", "accepted", "rejected"]) }));
  if (!b) return fail("invalid");
  await sql`UPDATE partner_applications SET status = ${b.status} WHERE id = ${b.id}`;
  return ok({ ok: true });
}
