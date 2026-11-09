import { findPharmacies } from "@/lib/pharmacies";
import { ok, num } from "@/lib/api";
import { getLocale } from "@/lib/locale";

export async function GET(req: Request) {
  const u = new URL(req.url);
  const lat = num(u.searchParams.get("lat"));
  const lng = num(u.searchParams.get("lng"));
  const valid = lat != null && lng != null && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
  const drugIds = (u.searchParams.get("drugs") || "").split(",").filter((x) => /^[0-9a-f-]{36}$/.test(x));
  const res = await findPharmacies({
    lat: valid ? lat : null, lng: valid ? lng : null, drugIds,
    q: u.searchParams.get("q")?.slice(0, 60) || undefined,
    open24: u.searchParams.get("open24") === "1",
    delivery: u.searchParams.get("delivery") === "1",
    limit: Math.min(num(u.searchParams.get("limit")) ?? 12, 30),
    offset: Math.max(0, Math.min(num(u.searchParams.get("offset")) ?? 0, 2000)),
    locale: await getLocale(),
  });
  return ok(res);
}
