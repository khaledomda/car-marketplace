import { getLocale } from "@/lib/locale";
import { dictionary } from "@/lib/i18n";
import { ApplyForm } from "@/components/ApplyForm";

export const metadata = { title: "Partners" };

export default async function Page() {
  const locale = await getLocale();
  const d = dictionary(locale);
  const ar = locale === "ar";
  const points = ar
    ? [["مجاني الآن", "لا رسوم ولا عمولة خلال المرحلة التجريبية."], ["عملاء قريبون منك", "نوجّه لك المرضى الأقرب لصيدليتك، برسالة واتساب جاهزة."], ["سمعة تُبنى وتُحفظ", "كل خدمة مكتملة وكل تقييم يُحفظ وينتقل معك للتطبيق القادم."], ["توصيل وشركاء", "شركات التوصيل والمعلنون ينضمون بسهولة دون تعقيد."]]
    : [["Free for now", "No fees or commission during the trial."], ["Patients near you", "We route nearby patients to you with a ready WhatsApp message."], ["A reputation you keep", "Every completed service and rating is stored and moves with you to the coming app."], ["Delivery & partners", "Logistics companies and advertisers plug in without friction."]];
  return (
    <section className="wrap hero">
      <span className="kicker">{d.for_pharmacies}</span>
      <h1 className="display" style={{ fontSize: "clamp(28px,5vw,46px)" }}>{ar ? "لنكبر معاً في المدينة المنورة" : "Let's grow together in Madinah"}</h1>
      <div className="grid-main has-list" style={{ marginTop: 10 }}>
        <div className="steps" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {points.map(([h, p]) => <div className="step" key={h}><h4>{h}</h4><p>{p}</p></div>)}
        </div>
        <div className="card"><div className="card-b" style={{ paddingTop: 18 }}>
          <ApplyForm kind="pharmacy" chooseKind
            kindLabels={{ pharmacy: ar ? "صيدلية" : "Pharmacy", logistics: ar ? "شركة توصيل" : "Logistics", advertiser: ar ? "معلن" : "Advertiser", other: ar ? "أخرى" : "Other" }}
            labels={{ business: d.form_business, name: d.form_name, phone: d.form_phone, msg: d.form_msg, send: d.form_send, thanks: d.form_thanks }} />
        </div></div>
      </div>
    </section>
  );
}
