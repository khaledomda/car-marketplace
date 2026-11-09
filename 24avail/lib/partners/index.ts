// Partner integration registry.
// Adding a new logistics company / pharmacy group = one row in `partners` (admin panel) with
// config.adapter set to one of the adapters below. New integration styles = one new file here.
// Nothing else in the app changes.

export type DeliveryJob = {
  requestRef: string;
  pharmacy: { name: string; lat: number | null; lng: number | null; phone: string | null };
  customer: { lat: number | null; lng: number | null };
  items: Array<{ name: string; qty: number }>;
};

export type PartnerConfig = { adapter: string; [k: string]: unknown };

export interface LogisticsAdapter {
  id: string;
  quote(job: DeliveryJob, cfg: PartnerConfig): Promise<{ fee: number | null; etaMin: number | null }>;
  dispatch(job: DeliveryJob, cfg: PartnerConfig): Promise<{ externalId: string | null; status: string }>;
}

const manual: LogisticsAdapter = {
  id: "manual",
  async quote() { return { fee: null, etaMin: null }; },
  async dispatch() { return { externalId: null, status: "pending" }; }, // ops team assigns by phone
};

const webhook: LogisticsAdapter = {
  id: "webhook",
  async quote(job, cfg) {
    if (!cfg.quoteUrl) return { fee: null, etaMin: null };
    const r = await fetch(String(cfg.quoteUrl), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(job) });
    const j = (await r.json()) as { fee?: number; eta_min?: number };
    return { fee: j.fee ?? null, etaMin: j.eta_min ?? null };
  },
  async dispatch(job, cfg) {
    if (!cfg.dispatchUrl) return { externalId: null, status: "pending" };
    const r = await fetch(String(cfg.dispatchUrl), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(job) });
    const j = (await r.json()) as { id?: string; status?: string };
    return { externalId: j.id ?? null, status: j.status ?? "assigned" };
  },
};

const registry: Record<string, LogisticsAdapter> = { manual, webhook };

export function logisticsAdapter(cfg: PartnerConfig): LogisticsAdapter {
  return registry[cfg.adapter] ?? manual;
}
export const availableAdapters = Object.keys(registry);
