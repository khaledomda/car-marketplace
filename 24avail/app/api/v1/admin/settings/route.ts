import { z } from "zod";
import { ok, fail, body } from "@/lib/api";
import { guard } from "@/lib/admin-guard";
import { sql } from "@/lib/db";
import { recordEvent } from "@/lib/events";
import { clearSettingsCache } from "@/lib/settings";

const KEYS = ["trial_mode", "payments_enabled", "reveal_pharmacy_before_payment", "search_radius_km", "enforce_search_radius",
              "service_fee", "notification_channel", "max_pharmacies_per_request"] as const;

export async function GET() {
  const g = await guard(); if (g) return g;
  return ok({ items: await sql`SELECT key, value, updated_at FROM settings ORDER BY key` });
}

export async function POST(req: Request) {
  const g = await guard(); if (g) return g;
  const b = await body(req, z.object({ key: z.enum(KEYS), value: z.unknown() }));
  if (!b) return fail("invalid");
  await sql`INSERT INTO settings (key, value) VALUES (${b.key}, ${sql.json(b.value as never)})
            ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`;
  clearSettingsCache();
  await recordEvent({ type: "admin.setting.changed", actorType: "admin", subjectType: "setting", subjectId: b.key, payload: { value: b.value } });
  return ok({ ok: true });
}
