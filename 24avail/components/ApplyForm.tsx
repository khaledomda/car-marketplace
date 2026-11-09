"use client";
import { useState } from "react";

type Kind = "pharmacy" | "logistics" | "advertiser" | "other";
type L = { business: string; name: string; phone: string; msg: string; send: string; thanks: string; kind?: string };

export function ApplyForm({ kind: initial, labels, chooseKind, kindLabels }: { kind: Kind; labels: L; chooseKind?: boolean; kindLabels?: Record<Kind, string> }) {
  const [kind, setKind] = useState<Kind>(initial);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("sending");
    const r = await fetch("/api/v1/applications", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, business: f.get("business"), contact_name: f.get("contact_name") || null, phone: f.get("phone"), message: f.get("message") || null, website: f.get("website") || "" }),
    }).catch(() => null);
    setState(r?.ok ? "done" : "error");
  }
  if (state === "done") return <div className="notice ok">{labels.thanks}</div>;
  return (
    <form onSubmit={submit}>
      {chooseKind && kindLabels && (
        <div className="seg" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: 14 }}>
          {(["pharmacy", "logistics", "advertiser"] as Kind[]).map((k) => (
            <button type="button" key={k} aria-pressed={kind === k} onClick={() => setKind(k)}>{kindLabels[k]}</button>
          ))}
        </div>
      )}
      <div className="field"><label htmlFor="b">{labels.business}</label><input id="b" name="business" className="input" required minLength={2} maxLength={120} /></div>
      <div className="field"><label htmlFor="n">{labels.name}</label><input id="n" name="contact_name" className="input" maxLength={80} /></div>
      <div className="field"><label htmlFor="ph">{labels.phone}</label><input id="ph" name="phone" className="input" required inputMode="tel" dir="ltr" placeholder="05xxxxxxxx" pattern="[+0-9 ()-]{8,20}" /></div>
      <div className="field"><label htmlFor="m">{labels.msg}</label><textarea id="m" name="message" className="input" rows={3} maxLength={1000} /></div>
      <div className="hp" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
      {state === "error" && <div className="notice bad" style={{ marginBottom: 10 }}>!</div>}
      <button className="btn btn-primary" disabled={state === "sending"}>{state === "sending" && <span className="spinner" />}{labels.send}</button>
    </form>
  );
}
