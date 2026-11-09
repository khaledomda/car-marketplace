import "server-only";
import { sql } from "./db";

export type Settings = {
  trial_mode: boolean;
  payments_enabled: boolean;
  reveal_pharmacy_before_payment: boolean;
  search_radius_km: number;
  enforce_search_radius: boolean;
  service_fee: { type: "flat" | "percent"; amount: number; currency: string };
  notification_channel: "whatsapp" | "app";
  max_pharmacies_per_request: number;
};

const DEFAULTS: Settings = {
  trial_mode: true,
  payments_enabled: false,
  reveal_pharmacy_before_payment: true,
  search_radius_km: 7,
  enforce_search_radius: false,
  service_fee: { type: "flat", amount: 0, currency: "SAR" },
  notification_channel: "whatsapp",
  max_pharmacies_per_request: 5,
};

let cache: { at: number; value: Settings } | null = null;

/** Feature flags live in the database so business rules change without a redeploy. */
export async function getSettings(): Promise<Settings> {
  if (cache && Date.now() - cache.at < 30_000) return cache.value;
  const rows = await sql<{ key: string; value: unknown }[]>`SELECT key, value FROM settings`;
  const value = { ...DEFAULTS } as Record<string, unknown>;
  for (const r of rows) if (r.key in DEFAULTS) value[r.key] = r.value;
  cache = { at: Date.now(), value: value as Settings };
  return cache.value;
}

export function clearSettingsCache() { cache = null; }
