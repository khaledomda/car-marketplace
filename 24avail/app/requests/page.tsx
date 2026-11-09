import { getLocale } from "@/lib/locale";
import { MyRequests } from "@/components/MyRequests";
import { t } from "@/lib/i18n";

export const metadata = { title: "My requests", robots: { index: false } };

export default async function Page() {
  const locale = await getLocale();
  return (
    <section className="wrap hero">
      <h1 className="display" style={{ fontSize: "clamp(28px,5vw,44px)" }}>{t(locale, "my_requests")}</h1>
      <p className="sub">{locale === "ar" ? "تتحدّث الحالة تلقائياً عندما يرد الصيدلي." : "Status updates automatically when the pharmacist answers."}</p>
      <MyRequests locale={locale} />
    </section>
  );
}
