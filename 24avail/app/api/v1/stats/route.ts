import { ok } from "@/lib/api";
import { countPublic } from "@/lib/pharmacies";

export const dynamic = "force-dynamic";
export async function GET() {
  return ok(await countPublic(), { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
