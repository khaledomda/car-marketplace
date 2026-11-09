import { sql } from "./_db";
import { upsertDrugs } from "./_drugs";
import { upsertPharmacy } from "./_pharmacies";
import { SEED_DRUGS } from "../data/seed-drugs";

async function main() {
  const n = await upsertDrugs(SEED_DRUGS.map(([trade, ar, generic, strength, form, status, type, aliases]) => ({
    trade_name: trade, trade_name_ar: ar, generic_name: generic, strength: strength === "—" ? null : strength, dosage_form: form,
    legal_status: status, product_type: type ?? "human", aliases: aliases ?? [], source: "seed",
  })));
  console.log(`seeded ${n} medicines`);

  // Demo pharmacies only when explicitly asked (never in production data).
  if (process.env.SEED_DEMO === "1") {
    const demo = [
      ["Demo Pharmacy — Quba", "صيدلية تجريبية — قباء", "Quba", 24.4393, 39.6170, true],
      ["Demo Pharmacy — Al-Aziziyah", "صيدلية تجريبية — العزيزية", "Al-Aziziyah", 24.4417, 39.5776, false],
      ["Demo Pharmacy — Al-Uyun", "صيدلية تجريبية — العيون", "Al-Uyun", 24.5287, 39.5640, false],
      ["Demo Pharmacy — King Fahd", "صيدلية تجريبية — الملك فهد", "King Fahd", 24.4920, 39.5480, true],
      ["Demo Pharmacy — Sultana", "صيدلية تجريبية — سلطانة", "Sultana", 24.4808, 39.5900, false],
      ["Demo Pharmacy — Al-Haram", "صيدلية تجريبية — الحرم", "Central", 24.4683, 39.6110, true],
    ] as const;
    let i = 0;
    for (const [en, ar, district, lat, lng, h24] of demo) {
      await upsertPharmacy({ source: "demo", source_ref: `demo-${++i}`, name_en: en, name_ar: ar, district, lat, lng, phone: `0500000${String(i).padStart(3, "0")}`, is_24h: h24 });
    }
    await sql`UPDATE pharmacies SET is_demo = true, delivery_mode = CASE WHEN source_ref IN ('demo-1','demo-4') THEN 'own' ELSE 'none' END WHERE source = 'demo'`;
    await sql`INSERT INTO offers (pharmacy_id, title_ar, title_en, body_ar, body_en, badge, status, priority)
              SELECT id, 'خصم على فيتامين د', 'Vitamin D week', 'عرض تجريبي لعرض شكل بطاقة العروض.', 'Demo offer to preview the offer card.', '-15%', 'live', 1
              FROM pharmacies WHERE source_ref = 'demo-1' AND NOT EXISTS (SELECT 1 FROM offers)`;
    console.log("seeded demo pharmacies + demo offer");
  }
  await sql.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
