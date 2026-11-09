import { getLocale } from "@/lib/locale";
import { Directory } from "@/components/Directory";
import { t } from "@/lib/i18n";

export const metadata = { title: "Pharmacies" };

export default async function Page() {
  const locale = await getLocale();
  const ar = locale === "ar";
  return (
    <section className="wrap hero">
      <span className="kicker">{t(locale, "hero_kicker")}</span>
      <h1 className="display" style={{ fontSize: "clamp(28px,5vw,44px)" }}>{t(locale, "pharmacies_nav")}</h1>
      <p className="sub">{ar ? "كل صيدليات المدينة المنورة في مكان واحد — تواصل مباشرة عبر واتساب أو اتصال." : "Every pharmacy in Al-Madinah in one place — reach them directly on WhatsApp or by phone."}</p>
      <Directory l={{
        search: ar ? "ابحث باسم الصيدلية أو الحي" : "Search by pharmacy or district",
        near: ar ? "الأقرب لي" : "Nearest", open24: t(locale, "open24"), delivers: t(locale, "delivers"),
        wa: "WhatsApp", call: t(locale, "call"), more: ar ? "المزيد" : "Load more", km: t(locale, "km"),
        completed: t(locale, "completed_n"), demo: t(locale, "demo"), none: ar ? "لا توجد نتائج." : "No results.",
      }} />
    </section>
  );
}
