import "server-only";
import { cookies, headers } from "next/headers";
import { unsign, ipHash } from "./crypto";
import { sql } from "./db";

export const DEVICE_COOKIE = "a24d";

export async function clientIp(): Promise<string | null> {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null);
}

/** Anonymous device id issued (signed) by middleware. It becomes the customer id the future app links to. */
export async function deviceId(): Promise<string | null> {
  const c = await cookies();
  const v = unsign(c.get(DEVICE_COOKIE)?.value);
  return v && /^[0-9a-f-]{36}$/.test(v) ? v : null;
}

export async function context() {
  const [id, ip] = await Promise.all([deviceId(), clientIp()]);
  return { customerId: id, ipHash: ipHash(ip) };
}

export async function touchCustomer(id: string, field: "searches" | "requests" | null, locale?: string) {
  try {
    if (field === "searches")
      await sql`INSERT INTO customers (id, locale, searches) VALUES (${id}, ${locale ?? null}, 1)
                ON CONFLICT (id) DO UPDATE SET searches = customers.searches + 1, last_seen = now()`;
    else if (field === "requests")
      await sql`INSERT INTO customers (id, locale, requests) VALUES (${id}, ${locale ?? null}, 1)
                ON CONFLICT (id) DO UPDATE SET requests = customers.requests + 1, last_seen = now()`;
    else
      await sql`INSERT INTO customers (id, locale) VALUES (${id}, ${locale ?? null})
                ON CONFLICT (id) DO UPDATE SET visits = customers.visits + 1, last_seen = now()`;
  } catch (e) {
    console.error("[customers]", e);
  }
}
