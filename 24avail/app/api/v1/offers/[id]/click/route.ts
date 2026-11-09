import { ok, fail, uuid } from "@/lib/api";
import { sql } from "@/lib/db";
import { recordEvent } from "@/lib/events";
import { context } from "@/lib/request-context";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!uuid.safeParse(id).success) return fail("bad_id");
  const [o] = await sql<{ link_url: string | null }[]>`UPDATE offers SET clicks = clicks + 1 WHERE id = ${id} RETURNING link_url`;
  const ctx = await context();
  await recordEvent({ type: "offer.click", actorType: "customer", actorId: ctx.customerId, subjectType: "offer", subjectId: id, ipHash: ctx.ipHash });
  return ok({ link: o?.link_url ?? null });
}
