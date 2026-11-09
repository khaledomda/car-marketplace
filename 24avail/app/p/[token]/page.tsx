import Link from "next/link";
import { notFound } from "next/navigation";
import { getByPharmacistToken } from "@/lib/requests";
import { getLocale } from "@/lib/locale";
import { PharmacistPanel } from "@/components/PharmacistPanel";

export const metadata = { title: "Pharmacist confirmation", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const F: Record<string, [string, string]> = {
  pickup: ["استلام من الصيدلية", "Pickup at pharmacy"],
  pharmacy_delivery: ["توصيل من الصيدلية", "Delivery by pharmacy"],
  platform_delivery: ["توصيل عبر 24avail", "Delivery via 24avail"],
};

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) notFound();
  const r = await getByPharmacistToken(token);
  if (!r) notFound();
  const ar = (await getLocale()) === "ar";
  return (
    <section className="wrap hero" style={{ maxWidth: 720 }}>
      <span className="kicker">{ar ? "للصيدلي" : "For the pharmacist"} · {r.pharmacy_name}</span>
      <h1 className="display" style={{ fontSize: "clamp(26px,5vw,38px)" }}>{ar ? "طلب دواء" : "Medicine request"} <span dir="ltr" style={{ color: "var(--clay)" }}>{r.ref_code}</span></h1>
      <div className="slip" style={{ position: "relative" }}>
        <div className="slip-h">
          <span>{(F[r.fulfillment] ?? ["", ""])[ar ? 0 : 1]}</span>
          {r.distance_km != null && <span className="dist">{Math.round(r.distance_km * 10) / 10} {ar ? "كم" : "km"}</span>}
        </div>
        <div className="slip-b"><PharmacistPanel token={token} initialStatus={r.status} items={r.items} ar={ar} /></div>
      </div>
      <p className="privacy" style={{ marginTop: 18 }}>
        {ar ? "الخدمة مجانية بالكامل خلال المرحلة التجريبية. تأكيدك يرفع تقييم صيدليتك وعدد خدماتها المكتملة في 24avail." : "Completely free during the trial. Your confirmations raise your pharmacy's rating and completed-services count on 24avail."}{" "}
        <Link href="/partners">{ar ? "انضم كصيدلية شريكة" : "Join as a partner pharmacy"}</Link>
      </p>
    </section>
  );
}
