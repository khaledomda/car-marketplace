"use client";
import { useEffect, useState } from "react";

type R = { ref_code: string; status: string; items: Array<{ name: string; strength?: string | null; qty: number }>; created_at: string; pharmacy_name: string;
  quoted_amount: string | null; pharmacist_note: string | null; rated: boolean; token?: string };

export function MyRequests({ locale }: { locale: "ar" | "en" }) {
  const ar = locale === "ar";
  const [items, setItems] = useState<R[] | null>(null);
  const [rating, setRating] = useState<Record<string, number>>({});
  const S: Record<string, [string, string]> = {
    sent: ["أُرسل", "Sent"], opened: ["شاهدها الصيدلي", "Seen by pharmacist"], available: ["متوفر ✓", "Available ✓"],
    partial: ["متوفر جزئياً", "Partly available"], unavailable: ["غير متوفر", "Not available"], completed: ["مكتمل", "Completed"],
    cancelled: ["ملغي", "Cancelled"], expired: ["منتهي", "Expired"],
  };
  async function load() {
    let tokens: string[] = [];
    try { tokens = (JSON.parse(localStorage.getItem("a24.requests") || "[]") as Array<{ token: string }>).map((x) => x.token); } catch {}
    if (!tokens.length) { setItems([]); return; }
    const r = await fetch("/api/v1/requests/status", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tokens }) });
    setItems(((await r.json()) as { items?: R[] }).items ?? []);
  }
  useEffect(() => { load(); const i = setInterval(load, 20000); return () => clearInterval(i); }, []);
  async function rate(token: string, stars: number) {
    setRating((x) => ({ ...x, [token]: stars }));
    await fetch("/api/v1/requests/rate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, stars }) });
    load();
  }
  if (!items) return <div className="notice"><span className="spinner" /></div>;
  if (!items.length) return <div className="card empty">{ar ? "لا توجد طلبات بعد على هذا الجهاز." : "No requests on this device yet."}</div>;
  return (
    <div className="ph-list">
      {items.map((r) => (
        <div className="ph" key={r.ref_code} style={{ gridTemplateColumns: "1fr" }}>
          <div className="row-gap" style={{ justifyContent: "space-between" }}>
            <div className="nm">{r.pharmacy_name}</div>
            <span className={`tag ${r.status === "available" || r.status === "completed" ? "otc" : r.status === "unavailable" ? "rx" : ""}`}>{(S[r.status] ?? [r.status, r.status])[ar ? 0 : 1]}</span>
          </div>
          <div className="sub"><span dir="ltr">{r.ref_code}</span><span>{new Date(r.created_at).toLocaleString(ar ? "ar-SA" : "en-GB", { dateStyle: "medium", timeStyle: "short" })}</span></div>
          <div style={{ fontSize: 14 }}>{r.items.map((i) => `${i.name}${i.strength ? " " + i.strength : ""} ×${i.qty}`).join(" · ")}</div>
          {(r.quoted_amount || r.pharmacist_note) && <div className="notice ok">{r.quoted_amount && <b>{Number(r.quoted_amount).toFixed(2)} {ar ? "ر.س" : "SAR"} </b>}{r.pharmacist_note}</div>}
          {r.token && !r.rated && ["available", "partial", "unavailable", "completed"].includes(r.status) && (
            <div className="row-gap"><span className="muted" style={{ fontSize: 14 }}>{ar ? "قيّم الصيدلية:" : "Rate the pharmacy:"}</span>
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} className="x" style={{ fontSize: 22, color: (rating[r.token!] ?? 0) >= s ? "var(--gold)" : "var(--line-2)" }} onClick={() => rate(r.token!, s)} aria-label={`${s}`}>★</button>
              ))}
            </div>
          )}
          {r.rated && <span className="muted" style={{ fontSize: 13 }}>{ar ? "شكراً لتقييمك" : "Thanks for rating"}</span>}
        </div>
      ))}
    </div>
  );
}
