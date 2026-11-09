import { after } from "next/server";
import { ok } from "@/lib/api";
import { context, touchCustomer } from "@/lib/request-context";
import { bumpDaily, recordEvent } from "@/lib/events";

// Page-visit beacon (keeps pages cacheable while still counting every visit).
export async function POST(req: Request) {
  const { path } = (await req.json().catch(() => ({}))) as { path?: string };
  const ctx = await context();
  after(async () => {
    if (ctx.customerId) await touchCustomer(ctx.customerId, null);
    await bumpDaily("visits");
    await recordEvent({ type: "visit", actorType: "customer", actorId: ctx.customerId, payload: { path: String(path || "/").slice(0, 100) }, ipHash: ctx.ipHash });
  });
  return ok({ ok: true });
}
