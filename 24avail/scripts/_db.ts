import postgres from "postgres";
import { readFileSync, existsSync } from "node:fs";

// load .env.local / .env for scripts
for (const f of [".env.local", ".env"]) {
  if (!existsSync(f)) continue;
  for (const line of readFileSync(f, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL missing");
export const sql = postgres(process.env.DATABASE_URL, { max: 4, onnotice: () => {} });
