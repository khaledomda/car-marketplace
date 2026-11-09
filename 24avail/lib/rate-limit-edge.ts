// Sliding-window-ish fixed window limiter.
// - Default: in-memory per server instance (fine for one server / development).
// - Production at scale: set UPSTASH_REDIS_REST_URL/TOKEN and limits become global across all servers.
// Works in both the Edge (middleware) and Node runtimes (uses only fetch + Map).

type Bucket = { count: number; resetAt: number };
const mem = new Map<string, Bucket>();

export type Limit = { limit: number; windowSec: number };

export async function rateLimit(key: string, { limit, windowSec }: Limit): Promise<{ ok: boolean; remaining: number; resetSec: number }> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const windowId = Math.floor(Date.now() / 1000 / windowSec);
  const k = `rl:${key}:${windowId}`;

  if (url && token) {
    try {
      const res = await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify([["INCR", k], ["EXPIRE", k, String(windowSec + 1)]]),
        cache: "no-store",
      });
      const data = (await res.json()) as Array<{ result: number }>;
      const count = Number(data?.[0]?.result ?? 0);
      return { ok: count <= limit, remaining: Math.max(0, limit - count), resetSec: windowSec };
    } catch {
      // fall through to memory if Redis is unreachable — never take the site down
    }
  }

  const now = Date.now();
  let b = mem.get(k);
  if (!b || b.resetAt < now) {
    b = { count: 0, resetAt: now + windowSec * 1000 };
    mem.set(k, b);
    if (mem.size > 50_000) for (const [kk, v] of mem) if (v.resetAt < now) mem.delete(kk);
  }
  b.count++;
  return { ok: b.count <= limit, remaining: Math.max(0, limit - b.count), resetSec: Math.ceil((b.resetAt - now) / 1000) };
}
