"use client";
import { useCallback, useEffect, useState } from "react";

type Any = Record<string, unknown>;
const TABS = ["overview", "pharmacies", "partners", "offers", "applications", "settings", "export"] as const;
type Tab = (typeof TABS)[number];

async function api<T = Any>(path: string, body?: unknown): Promise<T> {
  const r = await fetch(`/api/v1/admin/${path}`, body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : undefined);
  if (r.status === 401) throw new Error("unauthorized");
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "error");
  return j as T;
}

function Table({ rows, cols }: { rows: Any[]; cols: string[] }) {
  return (
    <div className="scroll-x"><table className="table"><thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{cols.map((c) => <td key={c}>{typeof r[c] === "object" && r[c] !== null ? JSON.stringify(r[c]) : String(r[c] ?? "—")}</td>)}</tr>)}</tbody></table></div>
  );
}

function Login({ onDone }: { onDone: () => void }) {
  const [pw, setPw] = useState(""); const [err, setErr] = useState(false);
  return (
    <form className="card" style={{ maxWidth: 380 }} onSubmit={async (e) => { e.preventDefault(); try { await api("login", { password: pw }); onDone(); } catch { setErr(true); } }}>
      <div className="card-b" style={{ paddingTop: 18 }}>
        <div className="field"><label htmlFor="pw">Admin password</label><input id="pw" type="password" className="input" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" /></div>
        {err && <div className="notice bad" style={{ marginBottom: 10 }}>Wrong password (or ADMIN_PASSWORD_HASH not set)</div>}
        <button className="btn btn-primary">Sign in</button>
      </div>
    </form>
  );
}

function JsonForm({ fields, onSubmit, submitLabel }: { fields: Array<[string, string, "text" | "number" | "bool" | "select", string[]?]>; onSubmit: (v: Any) => Promise<void>; submitLabel: string }) {
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <form className="card" style={{ marginBottom: 16 }} onSubmit={async (e) => {
      e.preventDefault();
      const f = new FormData(e.currentTarget); const v: Any = {};
      for (const [k, , type] of fields) {
        const raw = f.get(k);
        if (type === "bool") v[k] = raw === "on";
        else if (raw === null || raw === "") continue;
        else v[k] = type === "number" ? Number(raw) : String(raw);
      }
      try { await onSubmit(v); setMsg("Saved ✓"); (e.target as HTMLFormElement).reset(); } catch (err) { setMsg("Error: " + (err as Error).message); }
    }}>
      <div className="card-b" style={{ paddingTop: 16, display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))" }}>
        {fields.map(([k, label, type, opts]) => (
          <div className="field" key={k} style={{ margin: 0 }}>
            <label htmlFor={k}>{label}</label>
            {type === "bool" ? <input id={k} name={k} type="checkbox" style={{ width: 20, height: 20 }} /> :
              type === "select" ? <select id={k} name={k} className="input">{opts!.map((o) => <option key={o}>{o}</option>)}</select> :
                <input id={k} name={k} className="input" type={type === "number" ? "number" : "text"} step="any" />}
          </div>
        ))}
        <div style={{ alignSelf: "end" }}><button className="btn btn-primary">{submitLabel}</button> {msg && <span className="muted">{msg}</span>}</div>
      </div>
    </form>
  );
}

export function AdminConsole() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [data, setData] = useState<Any | null>(null);

  const load = useCallback(async (t: Tab) => {
    setData(null);
    try {
      if (t === "export") { setData({}); setAuthed(true); return; }
      setData(await api(t)); setAuthed(true);
    } catch (e) { if ((e as Error).message === "unauthorized") setAuthed(false); }
  }, []);
  useEffect(() => { load(tab); }, [tab, load]);

  if (authed === false) return <Login onDone={() => load(tab)} />;
  const items = (data?.items as Any[]) ?? [];

  return (
    <div>
      <div className="tabs">
        {TABS.map((t) => <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>{t}</button>)}
        <button onClick={async () => { await api("logout", {}); setAuthed(false); }}>logout</button>
      </div>
      {!data && <div className="notice"><span className="spinner" /></div>}

      {data && tab === "overview" && (
        <div style={{ display: "grid", gap: 18 }}>
          <div className="stats">{Object.entries(data.totals as Any).map(([k, v]) => <div className="stat" key={k}><b>{String(v)}</b><span>{k}</span></div>)}</div>
          <div className="card"><div className="card-h"><h3>Top searches (30d)</h3></div><div className="card-b"><Table rows={data.topSearches as Any[]} cols={["q", "n", "misses"]} /></div></div>
          <div className="card"><div className="card-h"><h3>Pharmacy performance</h3></div><div className="card-b"><Table rows={data.topPharmacies as Any[]} cols={["name", "requests_total", "completed_services", "rating", "rating_count", "avg_response_min"]} /></div></div>
          <div className="card"><div className="card-h"><h3>Recent requests</h3></div><div className="card-b"><Table rows={data.recent as Any[]} cols={["ref_code", "pharmacy", "status", "fulfillment", "flagged", "created_at"]} /></div></div>
        </div>
      )}

      {data && tab === "pharmacies" && (
        <>
          <JsonForm submitLabel="Add / update pharmacy" onSubmit={async (v) => { await api("pharmacies", v); load("pharmacies"); }} fields={[
            ["id", "id (leave empty to add)", "text"], ["name_ar", "Name (AR)", "text"], ["name_en", "Name (EN)", "text"], ["district", "District", "text"],
            ["phone", "Phone", "text"], ["whatsapp", "WhatsApp", "text"], ["lat", "Lat", "number"], ["lng", "Lng", "number"],
            ["delivery_mode", "Delivery", "select", ["none", "own", "platform", "both"]], ["status", "Status", "select", ["active", "hidden", "closed"]],
            ["is_24h", "24h", "bool"], ["verified", "Verified", "bool"],
          ]} />
          <Table rows={items} cols={["id", "public_code", "name_ar", "name_en", "district", "phone", "whatsapp", "status", "is_demo", "source", "requests", "completed"]} />
        </>
      )}

      {data && tab === "partners" && (
        <>
          <p className="muted">Add a logistics company, pharmacy group, advertiser or insurer. Adapter: {(data.adapters as string[]).join(", ")} — webhook adapter takes quoteUrl/dispatchUrl in config.</p>
          <JsonForm submitLabel="Add partner" onSubmit={async (v) => { await api("partners", { ...v, contact: { phone: v.phone ?? "" }, config: { adapter: v.adapter ?? "manual" } }); load("partners"); }} fields={[
            ["type", "Type", "select", ["logistics", "pharmacy_group", "advertiser", "insurer", "payment", "other"]], ["name", "Name", "text"], ["name_ar", "Name (AR)", "text"],
            ["phone", "Contact phone", "text"], ["adapter", "Adapter", "select", (data.adapters as string[])],
          ]} />
          <Table rows={items} cols={["id", "type", "name", "name_ar", "active", "config", "created_at"]} />
        </>
      )}

      {data && tab === "offers" && (
        <>
          <JsonForm submitLabel="Add / update offer" onSubmit={async (v) => { await api("offers", v); load("offers"); }} fields={[
            ["id", "id (empty = new)", "text"], ["pharmacy_id", "Pharmacy id", "text"], ["title_ar", "Title (AR)", "text"], ["title_en", "Title (EN)", "text"],
            ["body_ar", "Text (AR)", "text"], ["body_en", "Text (EN)", "text"], ["badge", "Badge e.g. -20%", "text"], ["fee_amount", "Fee (SAR)", "number"],
            ["priority", "Priority", "number"], ["status", "Status", "select", ["pending", "live", "paused", "ended"]], ["sponsored", "Sponsored", "bool"],
          ]} />
          <Table rows={items} cols={["id", "pharmacy", "title_ar", "badge", "status", "sponsored", "fee_amount", "impressions", "clicks"]} />
        </>
      )}

      {data && tab === "applications" && (
        <div className="scroll-x"><table className="table"><thead><tr><th>kind</th><th>business</th><th>contact</th><th>phone</th><th>message</th><th>status</th></tr></thead>
          <tbody>{items.map((a) => (
            <tr key={String(a.id)}><td>{String(a.kind)}</td><td>{String(a.business)}</td><td>{String(a.contact_name ?? "")}</td><td dir="ltr">{String(a.phone)}</td><td>{String(a.message ?? "")}</td>
              <td><select className="input" defaultValue={String(a.status)} onChange={(e) => api("applications", { id: a.id, status: e.target.value })}>{["new", "contacted", "accepted", "rejected"].map((s) => <option key={s}>{s}</option>)}</select></td></tr>
          ))}</tbody></table></div>
      )}

      {data && tab === "settings" && (
        <div className="card"><div className="card-b" style={{ paddingTop: 16 }}>
          <p className="muted">Business switches — change behaviour without redeploying. Values are JSON (true / false / 7 / {"{...}"}).</p>
          {items.map((s) => (
            <form key={String(s.key)} className="row-gap" style={{ marginBottom: 10 }} onSubmit={async (e) => {
              e.preventDefault(); const raw = String(new FormData(e.currentTarget).get("v"));
              try { await api("settings", { key: s.key, value: JSON.parse(raw) }); load("settings"); } catch (err) { alert((err as Error).message); }
            }}>
              <code style={{ minWidth: 260 }}>{String(s.key)}</code>
              <input name="v" className="input" style={{ maxWidth: 320 }} defaultValue={JSON.stringify(s.value)} />
              <button className="btn btn-ghost btn-sm">Save</button>
            </form>
          ))}
        </div></div>
      )}

      {data && tab === "export" && (
        <div className="card"><div className="card-b" style={{ paddingTop: 16 }}>
          <p className="muted">Download any table as CSV (backups, analysis, migration to the mobile app).</p>
          <div className="row-gap">{["pharmacies", "pharmacy_stats", "drugs", "drug_stats", "customers", "searches", "requests", "ratings", "availability_signals", "offers", "partners", "partner_applications", "daily_metrics", "events"].map((t) => (
            <a key={t} className="btn btn-ghost btn-sm" href={`/api/v1/admin/export?table=${t}`}>{t}.csv</a>
          ))}</div>
        </div></div>
      )}
    </div>
  );
}
