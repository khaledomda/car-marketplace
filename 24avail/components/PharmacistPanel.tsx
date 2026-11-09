"use client";
import { useEffect, useState } from "react";

type Item = { drug_id: string | null; name: string; strength?: string | null; qty: number };

export function PharmacistPanel({ token, initialStatus, items, ar }: { token: string; initialStatus: string; items: Item[]; ar: boolean }) {
  const [status, setStatus] = useState(initialStatus);
  const [have, setHave] = useState<Record<number, boolean>>(() => Object.fromEntries(items.map((_, i) => [i, true])));
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/v1/pharmacist/${token}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "open" }) })
      .then((r) => r.json()).then((j: { status?: string }) => j.status && setStatus(j.status)).catch(() => {});
  }, [token]);

  async function act(action: "available" | "partial" | "unavailable" | "completed") {
    setBusy(true); setErr(null);
    const availableDrugIds = items.filter((it, i) => have[i] && it.drug_id).map((it) => it.drug_id!);
    const r = await fetch(`/api/v1/pharmacist/${token}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, amount: amount ? Number(amount) : null, note: note || null, availableDrugIds }),
    }).catch(() => null);
    setBusy(false);
    if (!r?.ok) { setErr(ar ? "تعذر الحفظ، حاول مجدداً." : "Couldn't save, please retry."); return; }
    setStatus(((await r.json()) as { status: string }).status);
  }

  const allHave = items.every((_, i) => have[i]);
  const noneHave = items.every((_, i) => !have[i]);
  const answered = ["available", "partial", "unavailable"].includes(status);

  if (status === "completed")
    return <div className="notice ok" style={{ fontSize: 16 }}>✓ {ar ? "تم تسجيل إتمام الخدمة. شكراً لك!" : "Service marked as completed. Thank you!"}</div>;

  return (
    <div>
      <div className="label">{ar ? "حدد المتوفر لديك:" : "Tick what you have:"}</div>
      {items.map((it, i) => (
        <label key={i} className="li" style={{ cursor: "pointer" }}>
          <input type="checkbox" checked={!!have[i]} onChange={(e) => setHave((h) => ({ ...h, [i]: e.target.checked }))} style={{ width: 20, height: 20, accentColor: "var(--palm)" }} disabled={answered} />
          <span className="meta"><b>{it.name}</b> {it.strength && <span className="muted">{it.strength}</span>}</span>
          <span className="muted">×{it.qty}</span>
        </label>
      ))}
      {!answered && (
        <>
          <div className="row-gap" style={{ marginTop: 14 }}>
            <div className="field" style={{ flex: "1 1 160px", margin: 0 }}>
              <label htmlFor="amt">{ar ? "السعر الإجمالي (اختياري)" : "Total price (optional)"}</label>
              <input id="amt" className="input" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))} placeholder="0.00" dir="ltr" />
            </div>
            <div className="field" style={{ flex: "2 1 220px", margin: 0 }}>
              <label htmlFor="note">{ar ? "ملاحظة للمريض (اختياري)" : "Note for the patient (optional)"}</label>
              <input id="note" className="input" value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} placeholder={ar ? "مثال: يوجد بديل مماثل" : "e.g. an equivalent is available"} />
            </div>
          </div>
          <div className="row-gap" style={{ marginTop: 16 }}>
            <button className="btn btn-primary" disabled={busy || !allHave} onClick={() => act("available")}>{ar ? "متوفر بالكامل" : "All available"}</button>
            <button className="btn btn-ghost" disabled={busy || allHave || noneHave} onClick={() => act("partial")}>{ar ? "متوفر جزئياً" : "Partly available"}</button>
            <button className="btn btn-ghost" disabled={busy} onClick={() => act("unavailable")} style={{ color: "var(--bad)" }}>{ar ? "غير متوفر" : "Not available"}</button>
          </div>
        </>
      )}
      {answered && (
        <div style={{ marginTop: 16 }}>
          <div className="notice">{ar ? "تم إرسال ردك للمريض. بعد التسليم أو التوصيل اضغط:" : "Your answer was saved. After handing over or delivering, press:"}</div>
          {status !== "unavailable" && (
            <button className="btn btn-clay" style={{ marginTop: 12 }} disabled={busy} onClick={() => act("completed")}>✓ {ar ? "تم التسليم — إتمام الخدمة" : "Handed over — complete service"}</button>
          )}
        </div>
      )}
      {err && <div className="notice bad" style={{ marginTop: 10 }}>{err}</div>}
    </div>
  );
}
