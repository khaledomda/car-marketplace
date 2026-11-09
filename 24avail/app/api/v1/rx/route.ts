import { after } from "next/server";
import { ok, fail } from "@/lib/api";
import { extractMedicines, matchToRegistry, rxEnabled, RX_MODEL } from "@/lib/rx";
import { context } from "@/lib/request-context";
import { sha256 } from "@/lib/crypto";
import { sql } from "@/lib/db";
import { recordEvent, bumpDaily } from "@/lib/events";
import { normalizeText } from "@/lib/normalize";

export const maxDuration = 60;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

export async function POST(req: Request) {
  if (!rxEnabled()) return fail("rx_disabled", 503);
  const form = await req.formData().catch(() => null);
  const file = form?.get("image");
  const kind = form?.get("kind") === "drug_photo" ? "drug_photo" : "prescription";
  if (!(file instanceof File)) return fail("no_image");
  if (file.size > 5 * 1024 * 1024) return fail("too_large", 413);
  const type = TYPES.find((t) => t === file.type);
  if (!type) return fail("bad_type", 415);

  const buf = Buffer.from(await file.arrayBuffer());
  // verify magic bytes, not just the declared type
  const sig = buf.subarray(0, 12).toString("hex");
  const real = sig.startsWith("ffd8ff") || sig.startsWith("89504e47") || sig.startsWith("47494638") || (sig.startsWith("52494646") && buf.subarray(8, 12).toString() === "WEBP");
  if (!real) return fail("bad_type", 415);

  const ctx = await context();
  let extracted;
  try {
    extracted = await extractMedicines(buf, type);
  } catch (e) {
    console.error("[rx]", e);
    return fail("rx_failed", 502);
  }
  const matched = await matchToRegistry(extracted);
  after(async () => {
    await sql`INSERT INTO rx_uploads (customer_id, kind, image_sha256, bytes, extracted, matched, model)
              VALUES (${ctx.customerId}, ${kind}, ${sha256(buf)}, ${buf.length}, ${sql.json(extracted as never)},
                      ${sql.json(matched.map((m) => ({ read: m.read.name, ids: m.matches.map((x) => x.id) })) as never)}, ${RX_MODEL})`;
    for (const m of matched)
      await sql`INSERT INTO searches (customer_id, query, normalized, source, results_count, top_drug_id)
                VALUES (${ctx.customerId}, ${m.read.name}, ${normalizeText(m.read.name)}, ${kind}, ${m.matches.length}, ${m.matches[0]?.id ?? null})`;
    await recordEvent({ type: `rx.${kind}`, actorType: "customer", actorId: ctx.customerId, payload: { found: extracted.medicines.length }, ipHash: ctx.ipHash });
    await bumpDaily(kind === "prescription" ? "rx_reads" : "photo_reads");
  });
  return ok({ kind: extracted.kind, readable: extracted.is_readable, results: matched });
}
