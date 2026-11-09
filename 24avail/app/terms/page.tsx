import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export const metadata = { title: "Terms & disclaimer" };

export default async function Page() {
  const locale = await getLocale();
  const ar = locale === "ar";
  const items = ar ? [
    ["المرحلة التجريبية", t(locale, "trial")],
    ["إخلاء المسؤولية", t(locale, "liability")],
    ["دقة المعلومات", "بيانات الأدوية مأخوذة من سجل المستحضرات المسجلة لدى الهيئة العامة للغذاء والدواء ومصادر عامة، وبيانات الصيدليات من مصادر عامة مثل خرائط جوجل. قد تحتوي على أخطاء أو تكون غير محدثة؛ التوفر والسعر النهائيان يحددهما الصيدلي."],
    ["الخصوصية", "لا نحتفظ بصور الوصفات، بل نستخرج أسماء الأدوية فقط. لا نخزّن عناوين IP بشكل صريح. نستخدم معرّفاً مجهولاً لجهازك لحفظ طلباتك وتقييماتك."],
    ["مستقبلاً", "قد تُضاف لاحقاً خدمات مدفوعة (رسوم خدمة بسيطة، الدفع عبر المنصة، التوصيل) وسيتم الإعلان عنها بوضوح قبل تطبيقها ولن تُطبّق بأثر رجعي."],
  ] : [
    ["Trial phase", t(locale, "trial")],
    ["Disclaimer", t(locale, "liability")],
    ["Accuracy", "Medicine data comes from the Saudi FDA registered-products list and public sources; pharmacy data from public sources such as Google Maps. It may contain errors or be out of date; final availability and price are set by the pharmacist."],
    ["Privacy", "We do not keep prescription photos — only the medicine names read from them. IP addresses are never stored in clear. An anonymous device id keeps your requests and ratings."],
    ["In the future", "Paid services may be added later (a small service fee, in-platform payment, delivery). They will be clearly announced before they apply and never retroactively."],
  ];
  return (
    <section className="wrap hero" style={{ maxWidth: 820 }}>
      <h1 className="display" style={{ fontSize: "clamp(28px,5vw,44px)" }}>{t(locale, "terms")}</h1>
      {items.map(([h, p]) => (<div key={h} style={{ marginBottom: 22 }}><h2 style={{ fontSize: 19, marginBottom: 4 }}>{h}</h2><p style={{ margin: 0, color: "var(--ink-2)" }}>{p}</p></div>))}
    </section>
  );
}
