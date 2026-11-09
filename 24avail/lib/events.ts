import "server-only";
import { sql } from "./db";

export type EventInput = {
  type: string;
  actorType: "customer" | "pharmacist" | "admin" | "system" | "partner";
  actorId?: string | null;
  subjectType?: string | null;
  subjectId?: string | null;
  payload?: Record<string, unknown>;
  ipHash?: string | null;
};

/** Append to the permanent ledger. Never throws into the user's request path. */
export async function recordEvent(e: EventInput, tx: typeof sql = sql): Promise<void> {
  try {
    await tx`
      INSERT INTO events (type, actor_type, actor_id, subject_type, subject_id, payload, ip_hash)
      VALUES (${e.type}, ${e.actorType}, ${e.actorId ?? null}, ${e.subjectType ?? null},
              ${e.subjectId ?? null}, ${tx.json((e.payload ?? {}) as never)}, ${e.ipHash ?? null})`;
  } catch (err) {
    console.error("[events] failed to record", e.type, err);
  }
}

export async function bumpDaily(metric: string, by = 1): Promise<void> {
  try {
    await sql`
      INSERT INTO daily_metrics (day, metric, value) VALUES (current_date, ${metric}, ${by})
      ON CONFLICT (day, metric) DO UPDATE SET value = daily_metrics.value + ${by}`;
  } catch (err) {
    console.error("[metrics]", metric, err);
  }
}
