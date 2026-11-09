import { guard } from "@/lib/admin-guard";
import { sql } from "@/lib/db";
import { recordEvent } from "@/lib/events";

// CSV export of any business table — your data is always yours to take to the future app or a warehouse.
const TABLES = ["pharmacies", "pharmacy_stats", "drugs", "drug_stats", "customers", "searches", "requests", "ratings",
                "availability_signals", "offers", "partners", "partner_applications", "daily_metrics", "events"] as const;

function csvCell(v: unknown) {
  if (v == null) return "";
  const s = typeof v === "object" ? JSON.stringify(v) : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: Request) {
  const g = await guard(); if (g) return g;
  const table = new URL(req.url).searchParams.get("table") as (typeof TABLES)[number];
  if (!TABLES.includes(table)) return new Response("bad table", { status: 400 });
  await recordEvent({ type: "admin.export", actorType: "admin", subjectType: "table", subjectId: table });
  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(ctrl) {
      let header = false;
      const cursor = sql`SELECT * FROM ${sql(table)}`.cursor(1000);
      for await (const rows of cursor) {
        if (!header && rows[0]) { ctrl.enqueue(enc.encode(Object.keys(rows[0]).join(",") + "\n")); header = true; }
        ctrl.enqueue(enc.encode(rows.map((r) => Object.values(r).map(csvCell).join(",")).join("\n") + "\n"));
      }
      ctrl.close();
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${table}.csv"` } });
}
