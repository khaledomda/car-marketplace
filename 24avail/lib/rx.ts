import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "./env";
import { searchDrugs, type DrugHit } from "./search";

export type Extracted = {
  is_readable: boolean;
  kind: "prescription" | "medicine_package" | "other";
  medicines: Array<{ name: string; generic_name: string | null; strength: string | null; form: string | null; quantity: number | null; confidence: "high" | "medium" | "low" }>;
  note: string | null;
};

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["is_readable", "kind", "medicines", "note"],
  properties: {
    is_readable: { type: "boolean" },
    kind: { type: "string", enum: ["prescription", "medicine_package", "other"] },
    medicines: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "generic_name", "strength", "form", "quantity", "confidence"],
        properties: {
          name: { type: "string" },
          generic_name: { type: ["string", "null"] },
          strength: { type: ["string", "null"] },
          form: { type: ["string", "null"] },
          quantity: { type: ["integer", "null"] },
          confidence: { type: "string", enum: ["high", "medium", "low"] },
        },
      },
    },
    note: { type: ["string", "null"] },
  },
} as const;

const SYSTEM = `You read photos for 24avail, a medicine-finder in Saudi Arabia.
The photo is either a handwritten/printed prescription (Arabic or English) or a medicine box/strip/bottle.
List every medicine you can identify: brand (trade) name as written, generic/scientific name if known,
strength, dosage form, and quantity of packs if written. Prefer names registered with the Saudi FDA.
Do not give dosing advice. Do not guess names you cannot read: lower the confidence or leave them out.
Never include patient names, IDs or doctor details in the output.`;

export const RX_MODEL = "claude-opus-5-5";

export function rxEnabled() {
  return !!env.anthropicKey;
}

export async function extractMedicines(image: Buffer, mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif"): Promise<Extracted> {
  const client = new Anthropic({ apiKey: env.anthropicKey, timeout: 60_000, maxRetries: 1 });
  const res = await client.beta.messages.create({
    model: RX_MODEL,
    max_tokens: 4000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: SYSTEM,
    output_config: { effort: "medium", format: { type: "json_schema", schema: SCHEMA as unknown as Record<string, unknown> } },
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: image.toString("base64") } },
          { type: "text", text: "Extract the medicines from this image." },
        ],
      },
    ],
  });
  if (res.stop_reason === "refusal") return { is_readable: false, kind: "other", medicines: [], note: "refused" };
  const text = res.content.map((b) => (b.type === "text" ? b.text : "")).join("");
  try {
    const parsed = JSON.parse(text) as Extracted;
    parsed.medicines = (parsed.medicines || []).slice(0, 15);
    return parsed;
  } catch {
    return { is_readable: false, kind: "other", medicines: [], note: "unparseable" };
  }
}

/** Map what was read on the photo to registry entries. */
export async function matchToRegistry(ex: Extracted) {
  const out: Array<{ read: Extracted["medicines"][number]; matches: DrugHit[] }> = [];
  for (const m of ex.medicines) {
    let matches = await searchDrugs([m.name, m.strength].filter(Boolean).join(" "), 4);
    if (!matches.length) matches = await searchDrugs(m.name, 4);
    if (!matches.length && m.generic_name) matches = await searchDrugs(m.generic_name, 4);
    out.push({ read: m, matches });
  }
  return out;
}
