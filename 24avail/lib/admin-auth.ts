import "server-only";
import { cookies } from "next/headers";
import { sign, unsign, verifyPassword } from "./crypto";
import { env } from "./env";

const COOKIE = "a24adm";
const TTL_MS = 12 * 3600 * 1000;

export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  const v = unsign(c.get(COOKIE)?.value);
  if (!v) return false;
  const [tag, exp] = v.split(":");
  return tag === "admin" && Number(exp) > Date.now();
}

export async function adminLogin(password: string): Promise<boolean> {
  const stored = env.adminPasswordHash;
  if (!stored || !verifyPassword(password, stored)) return false;
  const c = await cookies();
  c.set(COOKIE, sign(`admin:${Date.now() + TTL_MS}`), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: TTL_MS / 1000,
  });
  return true;
}

export async function adminLogout() {
  (await cookies()).delete(COOKIE);
}
