/**
 * Import the Saudi FDA registered medicines list (human + herbal + health products).
 * 1. Download the Excel/CSV export from https://www.sfda.gov.sa/en/drugs-list
 *    (and the herbal/health products list if separate).
 * 2. npm run import:sfda -- path/to/file.xlsx [--type herbal]
 * Column names are matched flexibly (English or Arabic headers). Safe to re-run (upserts by reg. no.).
 */
import * as XLSX from "xlsx";
import { readFileSync } from "node:fs";
import { upsertDrugs, type DrugRow } from "./_drugs";
import { sql } from "./_db";

const file = process.argv[2];
if (!file) { console.error("Usage: npm run import:sfda -- file.xlsx [--type herbal|human|supplement]"); process.exit(1); }
const forcedType = process.argv.includes("--type") ? process.argv[process.argv.indexOf("--type") + 1] : null;

const COLS: Record<keyof Omit<DrugRow, "source" | "aliases">, RegExp> = {
  trade_name: /^(trade ?name|tradename|product ?name|الاسم التجاري)/i,
  trade_name_ar: /(arabic trade|الاسم التجاري بالعربي|اسم عربي)/i,
  generic_name: /(scientific ?name|generic|active ingredient|الاسم العلمي|المادة الفعالة)/i,
  strength: /^(strength|التركيز)(?! ?unit)/i,
  dosage_form: /(pharmaceutical ?form|dosage ?form|الشكل الصيدلاني)/i,
  route: /(administration ?route|route|طريقة الاستعمال)/i,
  package_size: /(package ?size|pack ?size|حجم العبوة)/i,
  manufacturer: /(manufacturer ?name|manufacture|الشركة المصنعة)/i,
  country: /(manufacturer ?country|country|بلد)/i,
  reg_no: /(register ?number|registration ?no|reg.? ?no|رقم التسجيل)/i,
  price_sar: /(public ?price|price|السعر)/i,
  legal_status: /(legal ?status|الوصف القانوني|نوع الصرف)/i,
  product_type: /(drug ?type|product ?type|نوع المستحضر)/i,
  atc_code: /(atc ?code|atc)/i,
};

function mapType(v: string | undefined): DrugRow["product_type"] {
  const s = (forcedType ?? v ?? "").toLowerCase();
  if (/herb|عشب/.test(s)) return "herbal";
  if (/supplement|health|مكمل/.test(s)) return "supplement";
  if (/vet|بيطري/.test(s)) return "veterinary";
  return "human";
}

async function main() {
  const wb = XLSX.read(readFileSync(file), { type: "buffer" });
  const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: null });
  if (!rows.length) throw new Error("empty sheet");
  const headers = Object.keys(rows[0]);
  const map: Partial<Record<keyof typeof COLS, string>> = {};
  for (const [k, re] of Object.entries(COLS) as [keyof typeof COLS, RegExp][]) {
    const h = headers.find((x) => re.test(x.trim()));
    if (h) map[k] = h;
  }
  console.log("column mapping:", map);
  if (!map.trade_name) throw new Error("could not find the Trade Name column");
  const get = (r: Record<string, unknown>, k: keyof typeof COLS) => { const h = map[k]; const v = h ? r[h] : null; return v == null || v === "" ? null : String(v).trim(); };
  const out: DrugRow[] = [];
  for (const r of rows) {
    const trade = get(r, "trade_name");
    if (!trade) continue;
    const strengthUnit = headers.find((h) => /strength ?unit|وحدة التركيز/i.test(h));
    const strength = [get(r, "strength"), strengthUnit ? r[strengthUnit] : null].filter(Boolean).join(" ") || null;
    const price = get(r, "price_sar");
    out.push({
      trade_name: trade, trade_name_ar: get(r, "trade_name_ar"), generic_name: get(r, "generic_name"), strength,
      dosage_form: get(r, "dosage_form"), route: get(r, "route"), package_size: get(r, "package_size"),
      manufacturer: get(r, "manufacturer"), country: get(r, "country"), reg_no: get(r, "reg_no"),
      price_sar: price && !isNaN(Number(price)) ? Number(price) : null, legal_status: get(r, "legal_status"),
      product_type: mapType(get(r, "product_type") ?? undefined), atc_code: get(r, "atc_code"), source: "sfda",
    });
  }
  const n = await upsertDrugs(out);
  await sql`INSERT INTO events (type, actor_type, payload) VALUES ('import.drugs', 'system', ${sql.json({ file, rows: n })})`;
  console.log(`imported/updated ${n} medicines`);
  await sql.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
