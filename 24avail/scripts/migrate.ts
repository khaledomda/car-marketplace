import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { sql } from "./_db";

// Forward-only migrations. Never edit an applied file — add a new numbered one.
async function main() {
  await sql`CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
  const done = new Set((await sql<{ name: string }[]>`SELECT name FROM schema_migrations`).map((r) => r.name));
  const dir = join(process.cwd(), "db/migrations");
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".sql")).sort()) {
    if (done.has(f)) continue;
    console.log("applying", f);
    await sql.begin(async (tx) => {
      await tx.unsafe(readFileSync(join(dir, f), "utf8"));
      await tx`INSERT INTO schema_migrations (name) VALUES (${f})`;
    });
  }
  console.log("migrations up to date");
  await sql.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
