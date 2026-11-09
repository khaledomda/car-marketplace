"use client";
import { useEffect, useState } from "react";

type P = { id: string; name: string; district: string | null; distance_km: number | null; rating: number | null; rating_count: number; completed: number; is_24h: boolean; delivery_mode: string; is_demo: boolean; contactable: boolean };
type L = Record<"search" | "near" | "open24" | "delivers" | "wa" | "call" | "more" | "km" | "completed" | "demo" | "none", string>;

export function Directory({ l }: { l: L }) {
  const [items, setItems] = useState<P[]>([]);
  const [q, setQ] = useState("");
  const [open24, setOpen24] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [offset, setOffset] = useState(0);
  const [more, setMore] = useState(true);
  const [contact, setContact] = useState<Record<string, { whatsapp: string | null; phone: string | null }>>({});

  async function load(reset: boolean) {
    const p = new URLSearchParams({ limit: "24", offset: String(reset ? 0 : offset) });
    if (q.trim()) p.set("q", q.trim());
    if (open24) p.set("open24", "1");
    if (delivery) p.set("delivery", "1");
    if (loc) { p.set("lat", String(loc.lat)); p.set("lng", String(loc.lng)); }
    const r = await fetch(`/api/v1/pharmacies?${p}`);
    const j = (await r.json()) as { items?: P[] };
    const got = j.items ?? [];
    setItems((x) => (reset ? got : [...x, ...got]));
    setOffset((reset ? 0 : offset) + got.length);
    setMore(got.length === 24);
  }
  useEffect(() => { const t = setTimeout(() => load(true), 250); return () => clearTimeout(t); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, open24, delivery, loc]);

  async function reveal(id: string) {
    const r = await fetch(`/api/v1/pharmacies/${id}/contact`, { method: "POST" });
    if (!r.ok) return;
    const j = (await r.json()) as { whatsapp: string | null; phone: string | null };
    setContact((c) => ({ ...c, [id]: j }));
  }

  return (
    <>
      <div className="row-gap" style={{ marginBottom: 16 }}>
        <input className="input" style={{ maxWidth: 340 }} value={q} onChange={(e) => setQ(e.target.value)} placeholder={l.search} />
        <button className="btn btn-ghost btn-sm" aria-pressed={!!loc} onClick={() => navigator.geolocation?.getCurrentPosition((p) => setLoc({ lat: p.coords.latitude, lng: p.coords.longitude }))}>📍 {l.near}</button>
        <button className={`btn btn-sm ${open24 ? "btn-primary" : "btn-ghost"}`} onClick={() => setOpen24(!open24)}>{l.open24}</button>
        <button className={`btn btn-sm ${delivery ? "btn-primary" : "btn-ghost"}`} onClick={() => setDelivery(!delivery)}>{l.delivers}</button>
      </div>
      <div className="ph-list">
        {items.length === 0 && <div className="card empty">{l.none}</div>}
        {items.map((p) => (
          <div className="ph" key={p.id}>
            <div>
              <div className="nm">{p.name} {p.is_demo && <span className="tag gold">{l.demo}</span>}</div>
              <div className="sub">
                {p.distance_km != null && <span className="dist">{p.distance_km} {l.km}</span>}
                {p.district && <span>{p.district}</span>}
                {p.rating != null && <span><span className="stars">★</span> {p.rating} ({p.rating_count})</span>}
                {p.completed > 0 && <span>{p.completed} {l.completed}</span>}
              </div>
              <div className="tags">{p.is_24h && <span className="tag">{l.open24}</span>}{p.delivery_mode !== "none" && <span className="tag">{l.delivers}</span>}</div>
            </div>
            <div className="acts">
              {contact[p.id] ? (
                <>
                  {contact[p.id].whatsapp && <a className="btn btn-wa btn-sm" href={contact[p.id].whatsapp!} target="_blank" rel="noopener noreferrer">{l.wa}</a>}
                  {contact[p.id].phone && <a className="btn btn-ghost btn-sm" href={`tel:${contact[p.id].phone}`} dir="ltr">{contact[p.id].phone}</a>}
                </>
              ) : p.contactable && <button className="btn btn-ghost btn-sm" onClick={() => reveal(p.id)}>{l.call} / {l.wa}</button>}
            </div>
          </div>
        ))}
      </div>
      {more && items.length > 0 && <div style={{ textAlign: "center", marginTop: 16 }}><button className="btn btn-ghost" onClick={() => load(false)}>{l.more}</button></div>}
    </>
  );
}
