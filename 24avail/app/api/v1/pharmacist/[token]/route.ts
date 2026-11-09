import { z } from "zod";
import { ok, fail, body, uuid } from "@/lib/api";
import { pharmacistAction } from "@/lib/requests";
import { context } from "@/lib/request-context";

const Schema = z.object({
  action: z.enum(["open", "available", "partial", "unavailable", "completed"]),
  amount: z.number().min(0).max(100000).nullable().optional(),
  note: z.string().max(500).nullable().optional(),
  availableDrugIds: z.array(uuid).max(20).optional(),
});

export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) return fail("not_found", 404);
  const b = await body(req, Schema);
  if (!b) return fail("invalid");
  const ctx = await context();
  const r = await pharmacistAction(token, b.action, { amount: b.amount ?? null, note: b.note ?? null, deviceId: ctx.customerId, ipHash: ctx.ipHash, availableDrugIds: b.availableDrugIds });
  return r.ok ? ok({ status: r.request.status }) : fail(r.error, r.error === "not_found" ? 404 : 409);
}
