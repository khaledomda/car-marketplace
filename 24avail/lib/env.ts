import "server-only";

function req(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing environment variable ${name}`);
  return v;
}

export const env = {
  get databaseUrl() { return req("DATABASE_URL"); },
  get appSecret() {
    const s = req("APP_SECRET");
    if (s.length < 32) throw new Error("APP_SECRET must be at least 32 characters");
    return s;
  },
  get publicBaseUrl() { return (process.env.PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, ""); },
  get adminPasswordHash() { return process.env.ADMIN_PASSWORD_HASH || ""; },
  get anthropicKey() { return process.env.ANTHROPIC_API_KEY || ""; },
  get upstashUrl() { return process.env.UPSTASH_REDIS_REST_URL || ""; },
  get upstashToken() { return process.env.UPSTASH_REDIS_REST_TOKEN || ""; },
};
