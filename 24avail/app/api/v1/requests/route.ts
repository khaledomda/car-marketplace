import { z } from "zod";
import { ok, fail, body, uuid } from "@/lib/api";
import { createRequestBatch } from "@/lib/requests";
import { context, touchCustomer } from "@/lib/request-context";
import { getDrugsByIds } from "@/lib/search";

const Schema = z.object({
  pharmacyIds: z.array(uuid).min(1).max(10),
  items: z.array(z.object({ drugId: uuid.nullable(), name: z.string().trim().min(1).max(120), qty: z.number().int().min(1).max(20) })).min(1).max(15),
  fulfillment: z.enum(["pickup", "pharmacy_delivery", "platform_delivery"]),
  lat: z.number().min(-90).max(90).nullable().optional(),
  lng: z.number().min(-180).max(180).nullable().optional(),
});

export async function POST(req: Request) {
  const b = await body(req, Schema);
  if (!b) return fail("invalid");
  const ctx = await context();
  if (!ctx.customerId) return fail("no_session", 401);
  // trust the registry, not the client, for names of known drugs
  const known = new Map((await getDrugsByIds(b.items.map((i) => i.drugId).filter(Boolean) as string[])).map((d) => [d.id, d]));
  const items = b.items.map((i) => {
    const d = i.drugId ? known.get(i.drugId) : undefined;
    return { drug_id: d ? d.id : null, name: d ? d.trade_name : i.name, strength: d?.strength ?? null, qty: i.qty };
  });
  const res = await createRequestBatch({
    customerId: ctx.customerId, pharmacyIds: b.pharmacyIds, items, fulfillment: b.fulfillment,
    lat: b.lat ?? null, lng: b.lng ?? null, ipHash: ctx.ipHash,
  });
  await touchCustomer(ctx.customerId, "requests");
  return ok(res);
}
