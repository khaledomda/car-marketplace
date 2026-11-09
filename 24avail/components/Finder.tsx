"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DictKey } from "@/lib/i18n";

type Dict = Record<DictKey, string>;
type Drug = {
  id: string; trade_name: string; trade_name_ar: string | null; generic_name: string | null; strength: string | null;
  dosage_form: string | null; price_sar: string | null; legal_status: string | null; product_type: string;
};
type ListItem = { drugId: string | null; name: string; generic: string | null; strength: string | null; qty: number };
type Pharmacy = {
  id: string; name: string; district: string | null; distance_km: number | null; rating: number | null; rating_count: number;
  completed: number; is_24h: boolean; delivery_mode: string; verified: boolean; is_demo: boolean; likely_has: number; contactable: boolean; masked: boolean;
};
type RxResult = { read: { name: string; strength: string | null; confidence: string }; matches: Drug[] };
type Fulfillment = "pickup" | "pharmacy_delivery" | "platform_delivery";

const LS_LIST = "a24.list";
const LS_REQ = "a24.requests";

function lsGet<T>(k: string, d: T): T {
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; }
}
function lsSet(k: string, v: unknown) {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ }
}

const Icon = {
  search: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>,
  rx: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>,
  cam: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>,
  pin: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>,
  wa: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3z" /></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="m5 12 5 5 9-10" /></svg>,
  x: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>,
};

function DrugRow({ d, dict, locale, added, onAdd }: { d: Drug; dict: Dict; locale: "ar" | "en"; added: boolean; onAdd: () => void }) {
  const rx = /prescription|rx|controlled|وصف/i.test(d.legal_status ?? "");
  const display = locale === "ar" && d.trade_name_ar ? d.trade_name_ar : d.trade_name;
  return (
    <div className="drug">
      <div className="meta">
        <div className="name">
          {display}
          {(d.strength || d.dosage_form) && <small>{[d.strength, d.dosage_form].filter(Boolean).join(" · ")}</small>}
        </div>
        <div className="gen">{d.generic_name}{locale === "ar" && d.trade_name_ar ? ` — ${d.trade_name}` : ""}</div>
        <div className="tags">
          {d.legal_status && <span className={`tag ${rx ? "rx" : "otc"}`}>{rx ? dict.rx_badge : dict.otc_badge}</span>}
          {d.product_type === "herbal" && <span className="tag herbal">{dict.herbal}</span>}
        </div>
      </div>
      {d.price_sar && <span className="price">{Number(d.price_sar).toFixed(2)} {dict.sar}</span>}
      <button className={`btn btn-sm ${added ? "btn-ghost" : "btn-primary"}`} onClick={onAdd} disabled={added} aria-label={`${dict.add} ${d.trade_name}`}>
        {added ? <>{Icon.check} {dict.added}</> : <>+ {dict.add}</>}
      </button>
    </div>
  );
}

export function Finder({ dict, locale, rxEnabled, platformDelivery }: { dict: Dict; locale: "ar" | "en"; rxEnabled: boolean; platformDelivery: boolean }) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Drug[] | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [list, setList] = useState<ListItem[]>([]);
  const [rx, setRx] = useState<{ state: "idle" | "reading" | "done" | "error" | "off"; results: RxResult[] }>({ state: "idle", results: [] });
  const [fulfillment, setFulfillment] = useState<Fulfillment>("pickup");
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [locState, setLocState] = useState<"idle" | "asking" | "on" | "denied">("idle");
  const [pharmacies, setPharmacies] = useState<Pharmacy[] | null>(null);
  const [phBusy, setPhBusy] = useState(false);
  const [sent, setSent] = useState<Record<string, "sending" | "sent" | string>>({});
  const boxRef = useRef<HTMLDivElement>(null);
  const reqSeq = useRef(0);
  const finalTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setList(lsGet<ListItem[]>(LS_LIST, [])); }, []);
  useEffect(() => { lsSet(LS_LIST, list); }, [list]);

  // close suggestions on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => { if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const runSearch = useCallback(async (value: string, final: boolean) => {
    const v = value.trim();
    if (v.length < 2) { setHits(null); return; }
    const seq = ++reqSeq.current;
    setBusy(true);
    try {
      const p = new URLSearchParams({ q: v });
      if (final) p.set("final", "1");
      if (final && loc) { p.set("lat", String(loc.lat)); p.set("lng", String(loc.lng)); }
      const r = await fetch(`/api/v1/drugs/search?${p}`);
      const j = (await r.json()) as { items?: Drug[] };
      if (seq === reqSeq.current) { setHits(j.items ?? []); setOpen(true); }
    } catch { /* offline */ } finally {
      if (seq === reqSeq.current) setBusy(false);
    }
  }, [loc]);

  // debounce: suggestions at 160ms, log as a real search when typing pauses
  useEffect(() => {
    const t = setTimeout(() => runSearch(q, false), 160);
    if (finalTimer.current) clearTimeout(finalTimer.current);
    finalTimer.current = setTimeout(() => { if (q.trim().length >= 3) runSearch(q, true); }, 1400);
    return () => clearTimeout(t);
  }, [q, runSearch]);

  const inList = useMemo(() => new Set(list.map((i) => i.drugId).filter(Boolean)), [list]);

  const add = (d: Drug) => {
    if (inList.has(d.id)) return;
    setList((l) => [...l, { drugId: d.id, name: d.trade_name, generic: d.generic_name, strength: d.strength, qty: 1 }]);
    setPharmacies(null);
    setSent({});
  };

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>, kind: "prescription" | "drug_photo") {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!rxEnabled) { setRx({ state: "off", results: [] }); return; }
    setRx({ state: "reading", results: [] });
    try {
      const img = await downscale(f);
      const fd = new FormData();
      fd.set("image", img, "photo.jpg");
      fd.set("kind", kind);
      const r = await fetch("/api/v1/rx", { method: "POST", body: fd });
      if (r.status === 503) { setRx({ state: "off", results: [] }); return; }
      const j = (await r.json()) as { results?: RxResult[] };
      const results = j.results ?? [];
      setRx({ state: results.length ? "done" : "error", results });
      // automatically put what was read into the search bar
      if (results[0]) { const first = results[0].matches[0]?.trade_name ?? results[0].read.name; setQ(first); }
      // auto-add confident, unambiguous matches
      for (const res of results) if (res.read.confidence === "high" && res.matches[0]) add(res.matches[0]);
    } catch {
      setRx({ state: "error", results: [] });
    }
  }

  function askLocation() {
    if (!("geolocation" in navigator)) { setLocState("denied"); return; }
    setLocState("asking");
    navigator.geolocation.getCurrentPosition(
      (p) => { setLoc({ lat: p.coords.latitude, lng: p.coords.longitude }); setLocState("on"); },
      () => setLocState("denied"),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 120000 },
    );
  }

  const loadPharmacies = useCallback(async () => {
    setPhBusy(true);
    try {
      const p = new URLSearchParams({ limit: "12" });
      const ids = list.map((i) => i.drugId).filter(Boolean) as string[];
      if (ids.length) p.set("drugs", ids.join(","));
      if (loc) { p.set("lat", String(loc.lat)); p.set("lng", String(loc.lng)); }
      if (fulfillment === "pharmacy_delivery") p.set("delivery", "1");
      const r = await fetch(`/api/v1/pharmacies?${p}`);
      const j = (await r.json()) as { items?: Pharmacy[] };
      setPharmacies(j.items ?? []);
    } finally { setPhBusy(false); }
  }, [list, loc, fulfillment]);

  useEffect(() => { if (pharmacies) loadPharmacies(); /* re-rank when location/fulfillment changes */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc, fulfillment]);

  async function ask(ph: Pharmacy) {
    // open the window synchronously so mobile browsers don't block it, then point it at WhatsApp
    const win = window.open("", "_blank");
    setSent((s) => ({ ...s, [ph.id]: "sending" }));
    try {
      const r = await fetch("/api/v1/requests", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pharmacyIds: [ph.id], fulfillment,
          items: list.map((i) => ({ drugId: i.drugId, name: i.name, qty: i.qty })),
          lat: loc?.lat ?? null, lng: loc?.lng ?? null,
        }),
      });
      const j = (await r.json()) as { requests?: Array<{ pharmacy_id: string; ref: string; wa_url: string | null; tel: string | null; customer_token: string }> };
      const req = j.requests?.[0];
      if (!req) throw new Error("failed");
      const saved = lsGet<Array<{ token: string; ref: string; at: number }>>(LS_REQ, []);
      lsSet(LS_REQ, [{ token: req.customer_token, ref: req.ref, at: Date.now() }, ...saved].slice(0, 50));
      const target = req.wa_url ?? (req.tel ? `tel:${req.tel}` : null);
      if (target && win) win.location.href = target;
      else if (target) window.location.href = target;
      else win?.close();
      setSent((s) => ({ ...s, [ph.id]: req.ref }));
    } catch {
      win?.close();
      setSent((s) => { const n = { ...s }; delete n[ph.id]; return n; });
    }
  }

  const hasList = list.length > 0;

  return (
    <div className="finder">
      <div ref={boxRef} style={{ position: "relative" }}>
        <form className="searchbox" role="search" onSubmit={(e) => { e.preventDefault(); runSearch(q, true); }}>
          {Icon.search}
          <label htmlFor="q" className="sr">{dict.search_ph}</label>
          <input
            id="q" value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => hits && setOpen(true)}
            placeholder={dict.search_ph} autoComplete="off" spellCheck={false} enterKeyHint="search" maxLength={80}
          />
          {busy && <span className="spinner" style={{ color: "var(--muted)" }} />}
          <button className="btn btn-primary" type="submit">{locale === "ar" ? "ابحث" : "Search"}</button>
        </form>
        {open && hits && (
          <div className="suggest" role="listbox">
            {hits.length === 0 ? <div className="empty">{dict.no_results}</div> :
              hits.map((d) => <DrugRow key={d.id} d={d} dict={dict} locale={locale} added={inList.has(d.id)} onAdd={() => add(d)} />)}
          </div>
        )}
      </div>

      <div className="uploads">
        <label className="upload">
          <span className="ic">{Icon.rx}</span>{dict.upload_rx}
          <input type="file" accept="image/*" onChange={(e) => onPhoto(e, "prescription")} />
        </label>
        <label className="upload alt">
          <span className="ic">{Icon.cam}</span>{dict.upload_drug}
          <input type="file" accept="image/*" capture="environment" onChange={(e) => onPhoto(e, "drug_photo")} />
        </label>
        <span className="privacy">{dict.rx_privacy}</span>
      </div>

      {rx.state !== "idle" && (
        <div style={{ marginTop: 16 }}>
          {rx.state === "reading" && <div className="notice row-gap"><span className="spinner" /> {dict.reading}</div>}
          {rx.state === "off" && <div className="notice warn">{dict.rx_off}</div>}
          {rx.state === "error" && <div className="notice bad">{dict.rx_none}</div>}
          {rx.state === "done" && (
            <div className="card">
              <div className="card-h"><h3>{dict.rx_found}</h3><button className="x" onClick={() => setRx({ state: "idle", results: [] })} aria-label={dict.close}>{Icon.x}</button></div>
              <div>
                {rx.results.map((r, i) => (
                  <div key={i} style={{ borderTop: "1px solid var(--line)" }}>
                    <div style={{ padding: "10px 16px 0", fontSize: 13.5 }} className="muted">
                      «{r.read.name}{r.read.strength ? ` ${r.read.strength}` : ""}» {r.read.confidence !== "high" && <span className="tag gold">{locale === "ar" ? "تحقق" : "check"}</span>}
                    </div>
                    {r.matches.length ? r.matches.slice(0, 2).map((d) => <DrugRow key={d.id} d={d} dict={dict} locale={locale} added={inList.has(d.id)} onAdd={() => add(d)} />)
                      : <div className="empty" style={{ textAlign: "start" }}>{dict.no_results}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {hasList && (
        <div className="grid-main has-list">
          <div>
            {!pharmacies && (
              <div className="card"><div className="card-b" style={{ paddingTop: 18 }}>
                <p style={{ marginTop: 0 }} className="muted">{locale === "ar" ? "اختر طريقة الاستلام ثم اعرض الصيدليات القريبة." : "Choose how you want it, then see nearby pharmacies."}</p>
                <div className="row-gap">
                  <button className="btn btn-ghost" onClick={askLocation} disabled={locState === "asking" || locState === "on"}>
                    {Icon.pin} {locState === "on" ? dict.loc_on : dict.use_loc}
                  </button>
                  <button className="btn btn-primary" onClick={loadPharmacies} disabled={phBusy}>{phBusy ? <span className="spinner" /> : null}{dict.find_ph}</button>
                </div>
                {locState === "denied" && <p className="privacy" style={{ marginBottom: 0 }}>{dict.loc_denied}</p>}
              </div></div>
            )}
            {pharmacies && (
              <>
                <div className="row-gap" style={{ justifyContent: "space-between", marginBottom: 12 }}>
                  <h2 className="display" style={{ margin: 0, fontSize: 24 }}>{locale === "ar" ? "الصيدليات" : "Pharmacies"}</h2>
                  {locState !== "on" && <button className="btn btn-ghost btn-sm" onClick={askLocation}>{Icon.pin} {dict.use_loc}</button>}
                </div>
                {locState === "denied" && <p className="privacy">{dict.loc_denied}</p>}
                <div className="ph-list">
                  {pharmacies.length === 0 && <div className="card empty">{locale === "ar" ? "لا توجد صيدليات مطابقة حالياً." : "No matching pharmacies yet."}</div>}
                  {pharmacies.map((p) => {
                    const st = sent[p.id];
                    return (
                      <div className="ph" key={p.id}>
                        <div>
                          <div className="nm">{p.name} {p.is_demo && <span className="tag gold">{dict.demo}</span>}</div>
                          <div className="sub">
                            {p.distance_km != null && <span className="dist">{p.distance_km} {dict.km}</span>}
                            {p.district && <span>{p.district}</span>}
                            {p.rating != null && <span><span className="stars">★</span> {p.rating} ({p.rating_count})</span>}
                            {p.completed > 0 && <span>{p.completed} {dict.completed_n}</span>}
                          </div>
                          <div className="tags">
                            {p.likely_has > 0 && <span className="tag otc">{dict.likely}</span>}
                            {p.is_24h && <span className="tag">{dict.open24}</span>}
                            {p.delivery_mode !== "none" && <span className="tag">{dict.delivers}</span>}
                            {p.verified && <span className="tag gold">{dict.verified}</span>}
                          </div>
                        </div>
                        <div className="acts">
                          {st && st !== "sending" ? <span className="sent">{Icon.check} {dict.sent} · {st}</span> : (
                            <button className="btn btn-wa btn-sm" disabled={!p.contactable || st === "sending"} onClick={() => ask(p)}>
                              {st === "sending" ? <span className="spinner" /> : Icon.wa} {dict.ask_wa}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <aside className="slip" aria-label={dict.my_list}>
            <div className="slip-h"><h3 className="display">{dict.my_list}</h3><span className="count">{list.length}</span></div>
            <div className="slip-b">
              {list.map((it, idx) => (
                <div className="li" key={(it.drugId ?? it.name) + idx}>
                  <div className="meta">
                    <div style={{ fontWeight: 600 }}>{it.name} {it.strength && <small className="muted">{it.strength}</small>}</div>
                    {it.generic && <div className="muted" style={{ fontSize: 13 }}>{it.generic}</div>}
                  </div>
                  <div className="qty" aria-label={dict.qty}>
                    <button onClick={() => setList((l) => l.map((x, i) => i === idx ? { ...x, qty: Math.max(1, x.qty - 1) } : x))} aria-label="-">−</button>
                    <span>{it.qty}</span>
                    <button onClick={() => setList((l) => l.map((x, i) => i === idx ? { ...x, qty: Math.min(20, x.qty + 1) } : x))} aria-label="+">+</button>
                  </div>
                  <button className="x" onClick={() => { setList((l) => l.filter((_, i) => i !== idx)); setSent({}); }} aria-label={dict.remove}>{Icon.x}</button>
                </div>
              ))}
              <div className="label">{dict.how_get}</div>
              <div className="seg">
                <button aria-pressed={fulfillment === "pickup"} onClick={() => setFulfillment("pickup")}>{dict.pickup}</button>
                <button aria-pressed={fulfillment === "pharmacy_delivery"} onClick={() => setFulfillment("pharmacy_delivery")}>{dict.pharmacy_delivery}</button>
                <button aria-pressed={fulfillment === "platform_delivery"} disabled={!platformDelivery} title={platformDelivery ? undefined : dict.soon} onClick={() => setFulfillment("platform_delivery")}>{dict.platform_delivery}{!platformDelivery && <small>{dict.soon}</small>}</button>
              </div>
              <p className="privacy" style={{ margin: "14px 0 0" }}>{dict.data_note}</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

/** Shrink big phone photos before upload: faster on mobile data, cheaper to read. */
async function downscale(file: File, max = 1800): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale);
    c.height = Math.round(bmp.height * scale);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    return await new Promise((res) => c.toBlob((b) => res(b ?? file), "image/jpeg", 0.85));
  } catch {
    return file;
  }
}
