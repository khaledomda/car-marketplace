import { z } from "zod";
import { ok, fail, body } from "@/lib/api";
import { rateRequest } from "@/lib/requests";
import { context } from "@/lib/request-context";

export async function POST(req: Request) {
  const b = await body(req, z.object({ token: z.string().min(10).max(80), stars: z.number().int().min(1).max(5), comment: z.string().max(600).nullable().optional() }));
  if (!b) return fail("invalid");
  const ctx = await context();
  const r = await rateRequest(b.token, b.stars, b.comment ?? null, ctx.customerId, ctx.ipHash);
  return r.ok ? ok(r) : fail(r.error!, 409);
}
