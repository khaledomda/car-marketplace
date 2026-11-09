import "server-only";
import { sql } from "./db";
import { randomToken, tokenHash, refCode } from "./crypto";
import { recordEvent, bumpDaily } from "./events";
import { env } from "./env";
import { waLink, isSaudiMobile } from "./phone";
import { getSettings } from "./settings";

export type RequestItem = { drug_id: string | null; name: string; strength?: string | null; qty: number };
export type Fulfillment = "pickup" | "pharmacy_delivery" | "platform_delivery";

function haversine(aLat: number, aLng: number, bLat: number, bLng: number) {
  const r = (x: number) => (x * Math.PI) / 180;
  const h = Math.sin(r(bLat - aLat) / 2) ** 2 + Math.cos(r(aLat)) * Math.cos(r(bLat)) * Math.sin(r(bLng - aLng) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

const FULFILL_AR: Record<Fulfillment, string> = {
  pickup: "استلام من الصيدلية",
  pharmacy_delivery: "توصيل من الصيدلية",
  platform_delivery: "توصيل عبر 24avail",
};
const FULFILL_EN: Record<Fulfillment, string> = {
  pickup: "Pickup at pharmacy",
  pharmacy_delivery: "Delivery by pharmacy",
  platform_delivery: "Delivery via 24avail",
};

export function composeMessage(ref: string, items: RequestItem[], f: Fulfillment, confirmUrl: string) {
  const lines = items.map((i) => `• ${i.name}${i.strength ? " " + i.strength : ""} × ${i.qty}`).join("\n");
  return [
    "السلام عليكم 🌿",
    "هل يتوفر لديكم الآتي؟",
    lines,
    `طريقة الاستلام: ${FULFILL_AR[f]}`,
    "",
    "Hello, is the following available?",
    `Fulfilment: ${FULFILL_EN[f]}`,
    "",
    `رقم الطلب / Ref: ${ref}`,
    `للصيدلي — تأكيد التوفر وإتمام الخدمة (مجاناً):`,
    confirmUrl,
    "— 24avail",
  ].join("\n");
}

export async function createRequestBatch(input: {
  customerId: string;
  pharmacyIds: string[];
  items: RequestItem[];
  fulfillment: Fulfillment;
  lat?: number | null;
  lng?: number | null;
  ipHash: string | null;
}) {
  const s = await getSettings();
  const ids = Array.from(new Set(input.pharmacyIds)).slice(0, s.max_pharmacies_per_request);
  const pharmacies = await sql<{ id: string; whatsapp: string | null; phone: string | null; lat: number | null; lng: number | null; name_en: string | null; name_ar: string | null }[]>`
    SELECT id, whatsapp, phone, lat, lng, name_en, name_ar FROM pharmacies WHERE id = ANY(${ids}::uuid[]) AND status = 'active'`;
  const batchId = crypto.randomUUID();
  const out: Array<{ pharmacy_id: string; ref: string; wa_url: string | null; tel: string | null; customer_token: string }> = [];

  for (const p of pharmacies) {
    const ref = refCode();
    const pharmToken = randomToken();
    const custToken = randomToken();
    const dist = input.lat != null && input.lng != null && p.lat != null && p.lng != null
      ? haversine(input.lat, input.lng, p.lat, p.lng) : null;
    await sql`
      INSERT INTO requests (ref_code, batch_id, customer_id, pharmacy_id, items, fulfillment,
                            customer_lat, customer_lng, distance_km, status, pharmacist_token_hash,
                            customer_token_hash, created_ip_hash, service_fee)
      VALUES (${ref}, ${batchId}, ${input.customerId}, ${p.id}, ${sql.json(input.items as never)}, ${input.fulfillment},
              ${input.lat ?? null}, ${input.lng ?? null}, ${dist}, 'sent', ${tokenHash(pharmToken)},
              ${tokenHash(custToken)}, ${input.ipHash}, ${s.service_fee.type === "flat" ? s.service_fee.amount : 0})`;
    await sql`INSERT INTO pharmacy_stats (pharmacy_id, requests_total, contact_clicks, last_activity_at) VALUES (${p.id}, 1, 1, now())
              ON CONFLICT (pharmacy_id) DO UPDATE SET requests_total = pharmacy_stats.requests_total + 1,
                contact_clicks = pharmacy_stats.contact_clicks + 1, last_activity_at = now()`;
    const confirmUrl = `${env.publicBaseUrl}/p/${pharmToken}`;
    const msg = composeMessage(ref, input.items, input.fulfillment, confirmUrl);
    const wa = p.whatsapp && isSaudiMobile(p.whatsapp) ? waLink(p.whatsapp, msg) : null;
    out.push({ pharmacy_id: p.id, ref, wa_url: wa, tel: !wa && p.phone ? p.phone : null, customer_token: custToken });
    await recordEvent({
      type: "request.created", actorType: "customer", actorId: input.customerId, subjectType: "request", subjectId: ref,
      payload: { batchId, pharmacyId: p.id, items: input.items, fulfillment: input.fulfillment, distanceKm: dist, channel: wa ? "whatsapp" : "call" },
      ipHash: input.ipHash,
    });
  }

  const drugIds = input.items.map((i) => i.drug_id).filter(Boolean) as string[];
  if (drugIds.length)
    await sql`INSERT INTO drug_stats (drug_id, request_count) SELECT unnest(${drugIds}::uuid[]), 1
              ON CONFLICT (drug_id) DO UPDATE SET request_count = drug_stats.request_count + 1`;
  await bumpDaily("requests", out.length);
  return { batchId, requests: out };
}

export type PharmacistView = {
  id: string; ref_code: string; status: string; items: RequestItem[]; fulfillment: Fulfillment;
  distance_km: number | null; created_at: string; pharmacy_name: string; quoted_amount: string | null; pharmacist_note: string | null;
};

export async function getByPharmacistToken(token: string) {
  const [r] = await sql<(PharmacistView & { pharmacy_id: string; customer_id: string })[]>`
    SELECT r.id, r.ref_code, r.status, r.items, r.fulfillment, r.distance_km, r.created_at::text, r.quoted_amount::text,
           r.pharmacist_note, r.pharmacy_id, r.customer_id, coalesce(p.name_ar, p.name_en) AS pharmacy_name
    FROM requests r JOIN pharmacies p ON p.id = r.pharmacy_id
    WHERE r.pharmacist_token_hash = ${tokenHash(token)}`;
  return r ?? null;
}

const ANSWERABLE = new Set(["sent", "opened", "available", "partial", "unavailable"]);

export async function pharmacistAction(token: string, action: "open" | "available" | "partial" | "unavailable" | "completed",
  extra: { amount?: number | null; note?: string | null; deviceId?: string | null; ipHash?: string | null; availableDrugIds?: string[] }) {
  const r = await getByPharmacistToken(token);
  if (!r) return { ok: false as const, error: "not_found" };
  // If the "pharmacist" answers from the customer's own device, keep the data but flag it, so
  // self-confirmations never inflate public ratings/completions. Same-IP is only logged as a soft
  // signal: Saudi mobile networks put many people behind one IP (CGNAT).
  const [orig] = await sql<{ created_ip_hash: string | null }[]>`SELECT created_ip_hash FROM requests WHERE id = ${r.id}`;
  const suspicious = !!extra.deviceId && extra.deviceId === r.customer_id;
  const sameIp = !!extra.ipHash && extra.ipHash === orig?.created_ip_hash;

  if (action === "open") {
    if (r.status === "sent") await sql`UPDATE requests SET status = 'opened', opened_at = now() WHERE id = ${r.id}`;
    await recordEvent({ type: "request.opened", actorType: "pharmacist", subjectType: "request", subjectId: r.ref_code, payload: { suspicious, sameIp }, ipHash: extra.ipHash });
    return { ok: true as const, request: { ...r, status: r.status === "sent" ? "opened" : r.status } };
  }

  if (action === "completed") {
    if (r.status === "completed") return { ok: true as const, request: r };
    if (!["available", "partial", "opened", "sent"].includes(r.status)) return { ok: false as const, error: "invalid_state" };
    await sql.begin(async (tx) => {
      await tx`UPDATE requests SET status = 'completed', completed_at = now(), flagged = flagged OR ${suspicious},
               quoted_amount = coalesce(${extra.amount ?? null}, quoted_amount) WHERE id = ${r.id}`;
      if (!suspicious)
        await tx`INSERT INTO pharmacy_stats (pharmacy_id, completed_services, last_activity_at) VALUES (${r.pharmacy_id}, 1, now())
                 ON CONFLICT (pharmacy_id) DO UPDATE SET completed_services = pharmacy_stats.completed_services + 1, last_activity_at = now()`;
    });
    await recordEvent({ type: "request.completed", actorType: "pharmacist", subjectType: "request", subjectId: r.ref_code,
      payload: { pharmacyId: r.pharmacy_id, amount: extra.amount ?? null, suspicious, sameIp }, ipHash: extra.ipHash });
    await bumpDaily("completed");
    return { ok: true as const, request: { ...r, status: "completed" } };
  }

  if (!ANSWERABLE.has(r.status)) return { ok: false as const, error: "invalid_state" };
  const firstAnswer = r.status === "sent" || r.status === "opened";
  const allDrugIds = r.items.map((i) => i.drug_id).filter(Boolean) as string[];
  const availIds = action === "available" ? allDrugIds : action === "partial" ? (extra.availableDrugIds ?? []).filter((x) => allDrugIds.includes(x)) : [];
  const unavailIds = allDrugIds.filter((x) => !availIds.includes(x));

  await sql.begin(async (tx) => {
    await tx`UPDATE requests SET status = ${action}, responded_at = coalesce(responded_at, now()),
             quoted_amount = ${extra.amount ?? null}, pharmacist_note = ${extra.note?.slice(0, 500) ?? null},
             flagged = flagged OR ${suspicious} WHERE id = ${r.id}`;
    if (firstAnswer && !suspicious) {
      const col = action === "unavailable" ? "requests_unavailable" : "requests_available";
      await tx`INSERT INTO pharmacy_stats (pharmacy_id) VALUES (${r.pharmacy_id}) ON CONFLICT DO NOTHING`;
      await tx`UPDATE pharmacy_stats SET ${tx(col)} = ${tx(col)} + 1, last_activity_at = now(),
               avg_response_secs = coalesce(avg_response_secs * 0.9 + 0.1 * extract(epoch FROM now() - ${r.created_at}::timestamptz),
                                            extract(epoch FROM now() - ${r.created_at}::timestamptz))
               WHERE pharmacy_id = ${r.pharmacy_id}`;
    }
    if (!suspicious) {
      for (const d of availIds)
        await tx`INSERT INTO availability_signals (pharmacy_id, drug_id, available_count, last_available_at)
                 VALUES (${r.pharmacy_id}, ${d}, 1, now())
                 ON CONFLICT (pharmacy_id, drug_id) DO UPDATE SET available_count = availability_signals.available_count + 1,
                   last_available_at = now(), last_answer_at = now()`;
      for (const d of unavailIds)
        await tx`INSERT INTO availability_signals (pharmacy_id, drug_id, unavailable_count)
                 VALUES (${r.pharmacy_id}, ${d}, 1)
                 ON CONFLICT (pharmacy_id, drug_id) DO UPDATE SET unavailable_count = availability_signals.unavailable_count + 1,
                   last_answer_at = now()`;
      if (availIds.length)
        await tx`INSERT INTO drug_stats (drug_id, available_count) SELECT unnest(${availIds}::uuid[]), 1
                 ON CONFLICT (drug_id) DO UPDATE SET available_count = drug_stats.available_count + 1`;
    }
  });
  await recordEvent({ type: `request.${action}`, actorType: "pharmacist", subjectType: "request", subjectId: r.ref_code,
    payload: { pharmacyId: r.pharmacy_id, amount: extra.amount ?? null, availIds, unavailIds, suspicious, sameIp }, ipHash: extra.ipHash });
  return { ok: true as const, request: { ...r, status: action } };
}

export async function getByCustomerTokens(tokens: string[]) {
  const hashes = tokens.slice(0, 50).map(tokenHash);
  if (!hashes.length) return [];
  return sql<{ ref_code: string; status: string; items: RequestItem[]; created_at: string; pharmacy_name: string; quoted_amount: string | null;
               pharmacist_note: string | null; rated: boolean; token_hash: string }[]>`
    SELECT r.ref_code, r.status, r.items, r.created_at::text, coalesce(p.name_ar, p.name_en) AS pharmacy_name,
           r.quoted_amount::text, r.pharmacist_note, (rt.id IS NOT NULL) AS rated, r.customer_token_hash AS token_hash
    FROM requests r JOIN pharmacies p ON p.id = r.pharmacy_id LEFT JOIN ratings rt ON rt.request_id = r.id
    WHERE r.customer_token_hash = ANY(${hashes})
    ORDER BY r.created_at DESC`;
}

export async function rateRequest(token: string, stars: number, comment: string | null, customerId: string | null, ipHash: string | null) {
  const [r] = await sql<{ id: string; pharmacy_id: string; customer_id: string; status: string; ref_code: string; flagged: boolean }[]>`
    SELECT id, pharmacy_id, customer_id, status, ref_code, flagged FROM requests WHERE customer_token_hash = ${tokenHash(token)}`;
  if (!r) return { ok: false, error: "not_found" };
  if (!["completed", "available", "partial", "unavailable"].includes(r.status)) return { ok: false, error: "not_ready" };
  const inserted = await sql`INSERT INTO ratings (request_id, pharmacy_id, customer_id, stars, comment)
    VALUES (${r.id}, ${r.pharmacy_id}, ${r.customer_id}, ${stars}, ${comment?.slice(0, 600) ?? null})
    ON CONFLICT (request_id) DO NOTHING RETURNING id`;
  if (!inserted.length) return { ok: false, error: "already_rated" };
  if (!r.flagged)
    await sql`INSERT INTO pharmacy_stats (pharmacy_id, rating_sum, rating_count) VALUES (${r.pharmacy_id}, ${stars}, 1)
              ON CONFLICT (pharmacy_id) DO UPDATE SET rating_sum = pharmacy_stats.rating_sum + ${stars}, rating_count = pharmacy_stats.rating_count + 1`;
  await recordEvent({ type: "rating.created", actorType: "customer", actorId: customerId ?? r.customer_id, subjectType: "request", subjectId: r.ref_code,
    payload: { stars, pharmacyId: r.pharmacy_id, flagged: r.flagged }, ipHash });
  return { ok: true };
}
