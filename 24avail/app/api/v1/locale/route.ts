import { cookies } from "next/headers";
import { ok, fail } from "@/lib/api";
import { LOCALE_COOKIE } from "@/lib/i18n";

export async function POST(req: Request) {
  const { locale } = (await req.json().catch(() => ({}))) as { locale?: string };
  if (locale !== "ar" && locale !== "en") return fail("invalid");
  (await cookies()).set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  return ok({ locale });
}
