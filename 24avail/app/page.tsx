import { getLocale } from "@/lib/locale";
import { dictionary } from "@/lib/i18n";
import { Finder } from "@/components/Finder";
import { DropOffer } from "@/components/DropOffer";
import { sql } from "@/lib/db";
import { countPublic } from "@/lib/pharmacies";
import { rxEnabled } from "@/lib/rx";

export const dynamic = "force-dynamic";

type Offer = { id: string; title_ar: string | null; title_en: string | null; body_ar: string | null; body_en: string | null; badge: string | null; pharmacy: string | null; sponsored: boolean };

export default async function Home() {
  const locale = await getLocale();
  const d = dictionary(locale);
  const [stats, offers, [{ logistics }]] = await Promise.all([
    countPublic(),
    sql<Offer[]>`SELECT o.id, o.title_ar, o.title_en, o.body_ar, o.body_en, o.badge, o.sponsored,
                   ${locale === "ar" ? sql`coalesce(p.name_ar, p.name_en)` : sql`coalesce(p.name_en, p.name_ar)`} AS pharmacy
                 FROM offers o LEFT JOIN pharmacies p ON p.id = o.pharmacy_id
                 WHERE o.status = 'live' AND o.placement = 'home' AND o.starts_at <= now() AND (o.ends_at IS NULL OR o.ends_at > now())
                 ORDER BY o.sponsored DESC, o.priority DESC LIMIT 5`,
    sql<{ logistics: number }[]>`SELECT count(*)::int AS logistics FROM partners WHERE type = 'logistics' AND active`,
  ]);
  const fmt = new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US");
  const formLabels = { business: d.form_business, name: d.form_name, phone: d.form_phone, msg: d.form_msg, send: d.form_send, thanks: d.form_thanks };

  return (
    <>
      <section className="wrap hero">
        <div className="hero-top">
          <div>
            <span className="kicker">{d.hero_kicker}</span>
            <h1 className="display">{d.hero_title}</h1>
            <p className="sub">{d.hero_sub}</p>
          </div>
          {/* an example of what a request looks like once pharmacies answer */}
          <div className="slip hero-slip" aria-hidden="true">
            <div className="slip-h"><span>{locale === "ar" ? "مثال لطلب" : "Example request"}</span><span className="ref" dir="ltr">24A-K7P2QM</span></div>
            <div className="slip-b">
              <div className="li"><span className="meta"><b>Augmentin</b> <span className="muted">1 g</span></span><span className="muted">×1</span></div>
              <div className="li"><span className="meta"><b>Panadol</b> <span className="muted">500 mg</span></span><span className="muted">×2</span></div>
              <div className="li"><span className="meta">{locale === "ar" ? "صيدلية في قباء · ١٫٢ كم" : "Pharmacy in Quba · 1.2 km"}</span><span className="tag otc">{locale === "ar" ? "متوفر ✓" : "Available ✓"}</span></div>
              <div className="li"><span className="meta">{locale === "ar" ? "صيدلية في العوالي · ٢٫٨ كم" : "Pharmacy in Al-Awali · 2.8 km"}</span><span className="tag">{locale === "ar" ? "بانتظار الرد" : "Waiting"}</span></div>
            </div>
          </div>
        </div>
        <Finder dict={d} locale={locale} rxEnabled={rxEnabled()} platformDelivery={logistics > 0} />
      </section>

      <section className="wrap block" aria-labelledby="offers-t">
        <h2 id="offers-t" className="display section-t">{d.offers_title}</h2>
        <p className="section-sub">{locale === "ar" ? "عروض حقيقية من صيدليات المدينة." : "Real offers from Madinah pharmacies."}</p>
        <div className="offers">
          {offers.map((o) => (
            <article className="offer" key={o.id}>
              {o.badge && <span className="badge" dir="ltr">{o.badge}</span>}
              <h4>{locale === "ar" ? o.title_ar ?? o.title_en : o.title_en ?? o.title_ar}</h4>
              <p>{locale === "ar" ? o.body_ar ?? o.body_en : o.body_en ?? o.body_ar}</p>
              <span className="by">{o.pharmacy}{o.sponsored ? (locale === "ar" ? " · ممول" : " · Sponsored") : ""}</span>
            </article>
          ))}
          <DropOffer title={d.drop_offer_title} sub={d.drop_offer_sub} cta={d.drop_offer_cta} close={d.close} labels={formLabels} />
        </div>
      </section>

      <section className="wrap block" aria-labelledby="how-t">
        <h2 id="how-t" className="display section-t">{d.how_title}</h2>
        <div className="steps" style={{ marginTop: 16 }}>
          <div className="step"><h4>{d.how1_t}</h4><p>{d.how1_d}</p></div>
          <div className="step"><h4>{d.how2_t}</h4><p>{d.how2_d}</p></div>
          <div className="step"><h4>{d.how3_t}</h4><p>{d.how3_d}</p></div>
        </div>
      </section>

      <section className="wrap block">
        <div className="stats">
          <div className="stat"><b>{fmt.format(stats.pharmacies)}</b><span>{d.stats_ph}</span></div>
          <div className="stat"><b>{fmt.format(stats.drugs)}</b><span>{d.stats_drugs}</span></div>
          <div className="stat"><b>{fmt.format(stats.searches)}</b><span>{d.stats_searches}</span></div>
          <div className="stat"><b>{fmt.format(stats.completed)}</b><span>{d.stats_done}</span></div>
        </div>
      </section>
    </>
  );
}
