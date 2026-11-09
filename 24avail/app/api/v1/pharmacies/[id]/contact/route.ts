import { ok, fail, uuid } from "@/lib/api";
import { sql } from "@/lib/db";
import { context } from "@/lib/request-context";
import { recordEvent } from "@/lib/events";
import { isSaudiMobile, waLink } from "@/lib/phone";
import { getSettings } from "@/lib/settings";

// Numbers are never in page HTML; they are handed out one at a time, logged and rate limited.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!uuid.safeParse(id).success) return fail("bad_id");
  const s = await getSettings();
  if (!s.reveal_pharmacy_before_payment) return fail("hidden_until_payment", 403);
  const [p] = await sql<{ id: string; phone: string | null; whatsapp: string | null }[]>`
    SELECT id, phone, whatsapp FROM pharmacies WHERE id = ${id} AND status = 'active'`;
  if (!p) return fail("not_found", 404);
  const ctx = await context();
  await sql`INSERT INTO pharmacy_stats (pharmacy_id, contact_clicks, profile_views) VALUES (${id}, 1, 1)
            ON CONFLICT (pharmacy_id) DO UPDATE SET contact_clicks = pharmacy_stats.contact_clicks + 1, profile_views = pharmacy_stats.profile_views + 1`;
  await recordEvent({ type: "pharmacy.contact", actorType: "customer", actorId: ctx.customerId, subjectType: "pharmacy", subjectId: id, ipHash: ctx.ipHash });
  const greet = "السلام عليكم، تواصلت معكم عبر 24avail.\nHello, I found you on 24avail.";
  return ok({
    whatsapp: p.whatsapp && isSaudiMobile(p.whatsapp) ? waLink(p.whatsapp, greet) : null,
    phone: p.phone ?? p.whatsapp,
  });
}
