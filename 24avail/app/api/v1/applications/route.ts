import { z } from "zod";
import { ok, fail, body, saPhone } from "@/lib/api";
import { sql } from "@/lib/db";
import { recordEvent } from "@/lib/events";
import { context } from "@/lib/request-context";

const Schema = z.object({
  kind: z.enum(["pharmacy", "logistics", "advertiser", "other"]),
  business: z.string().trim().min(2).max(120),
  contact_name: z.string().trim().max(80).optional().nullable(),
  phone: saPhone,
  message: z.string().trim().max(1000).optional().nullable(),
  website: z.string().max(0).optional(), // honeypot: humans never fill this
});

export async function POST(req: Request) {
  const b = await body(req, Schema);
  if (!b) return fail("invalid");
  const ctx = await context();
  const [row] = await sql<{ id: string }[]>`
    INSERT INTO partner_applications (kind, business, contact_name, phone, message)
    VALUES (${b.kind}, ${b.business}, ${b.contact_name ?? null}, ${b.phone}, ${b.message ?? null}) RETURNING id`;
  await recordEvent({ type: "application.created", actorType: "customer", actorId: ctx.customerId, subjectType: "application", subjectId: row.id, payload: { kind: b.kind }, ipHash: ctx.ipHash });
  return ok({ ok: true });
}
