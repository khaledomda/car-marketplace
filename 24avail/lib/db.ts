import "server-only";
import postgres from "postgres";
import { env } from "./env";

// One pool per server instance. On serverless, point DATABASE_URL at a pooler
// (PgBouncer / Neon / Supabase pooler) so thousands of concurrent visits share few connections.
const g = globalThis as unknown as { __sql?: postgres.Sql };

export const sql: postgres.Sql =
  g.__sql ??
  postgres(env.databaseUrl, {
    max: Number(process.env.DB_POOL_MAX || 10),
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: process.env.DB_PREPARE !== "false", // set false behind PgBouncer transaction mode
    transform: { undefined: null },
  });

if (process.env.NODE_ENV !== "production") g.__sql = sql;
