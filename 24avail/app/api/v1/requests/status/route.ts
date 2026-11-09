import { z } from "zod";
import { ok, fail, body } from "@/lib/api";
import { getByCustomerTokens } from "@/lib/requests";
import { tokenHash } from "@/lib/crypto";

export async function POST(req: Request) {
  const b = await body(req, z.object({ tokens: z.array(z.string().min(10).max(80)).max(50) }));
  if (!b) return fail("invalid");
  const rows = await getByCustomerTokens(b.tokens);
  const byHash = new Map(b.tokens.map((t) => [tokenHash(t), t]));
  return ok({ items: rows.map(({ token_hash, ...r }) => ({ ...r, token: byHash.get(token_hash) })) });
}
