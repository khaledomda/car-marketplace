import "server-only";
import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { env } from "./env";

export function randomToken(bytes = 24): string {
  return randomBytes(bytes).toString("base64url");
}

export function sha256(s: string | Buffer): string {
  return createHash("sha256").update(s).digest("hex");
}

/** Tokens are stored only as keyed hashes: a database leak does not expose working links. */
export function tokenHash(token: string): string {
  return createHmac("sha256", env.appSecret).update("tok:" + token).digest("hex");
}

/** IPs are never stored raw. */
export function ipHash(ip: string | null | undefined): string | null {
  if (!ip) return null;
  return createHmac("sha256", env.appSecret).update("ip:" + ip).digest("hex").slice(0, 32);
}

export function sign(value: string): string {
  const mac = createHmac("sha256", env.appSecret).update(value).digest("base64url");
  return `${value}.${mac}`;
}

export function unsign(signed: string | undefined | null): string | null {
  if (!signed) return null;
  const i = signed.lastIndexOf(".");
  if (i < 1) return null;
  const value = signed.slice(0, i);
  const expected = sign(value);
  const a = Buffer.from(expected);
  const b = Buffer.from(signed);
  return a.length === b.length && timingSafeEqual(a, b) ? value : null;
}

export function verifyPassword(password: string, stored: string): boolean {
  // format: scrypt:<saltHex>:<hashHex>  (no dollar sign: Next.js would expand it as an env variable)
  const [algo, saltHex, hashHex] = stored.split(":");
  if (algo !== "scrypt" || !saltHex || !hashHex) return false;
  const hash = scryptSync(password, Buffer.from(saltHex, "hex"), 64);
  const expected = Buffer.from(hashHex, "hex");
  return expected.length === hash.length && timingSafeEqual(hash, expected);
}

export function refCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I confusion
  const b = randomBytes(6);
  let s = "";
  for (const x of b) s += alphabet[x % alphabet.length];
  return `24A-${s}`;
}
