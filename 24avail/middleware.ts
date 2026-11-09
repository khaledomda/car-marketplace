import { NextResponse, type NextRequest } from "next/server";
import { rateLimit, type Limit } from "./lib/rate-limit-edge";

const DEVICE_COOKIE = "a24d";
const enc = new TextEncoder();

async function hmac(value: string): Promise<string> {
  const secret = process.env.APP_SECRET || "";
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(value)));
  let b = "";
  for (const x of sig) b += String.fromCharCode(x);
  return btoa(b).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function validDevice(v: string | undefined): Promise<boolean> {
  if (!v) return false;
  const i = v.lastIndexOf(".");
  if (i < 1) return false;
  return (await hmac(v.slice(0, i))) === v.slice(i + 1);
}

// Per-IP limits by route class. Generous for humans, tight for scrapers.
const LIMITS: Array<[RegExp, Limit, string]> = [
  [/^\/api\/v1\/rx/, { limit: 8, windowSec: 600 }, "rx"],
  [/^\/api\/v1\/requests$/, { limit: 20, windowSec: 600 }, "req"],
  [/^\/api\/v1\/(applications|ad-inquiries)/, { limit: 5, windowSec: 600 }, "form"],
  [/^\/api\/v1\/admin\/login/, { limit: 5, windowSec: 900 }, "login"],
  [/^\/api\/v1\/drugs/, { limit: 90, windowSec: 60 }, "search"],
  [/^\/api\/v1\/pharmacies/, { limit: 40, windowSec: 60 }, "ph"],
  [/^\/api\//, { limit: 120, windowSec: 60 }, "api"],
];

const BOT_UA = /(curl|wget|python-requests|scrapy|httpclient|go-http|java\/|libwww|headless|phantom|aiohttp|node-fetch|axios)/i;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApi = pathname.startsWith("/api/");

  if (isApi) {
    const ua = req.headers.get("user-agent") || "";
    const device = req.cookies.get(DEVICE_COOKIE)?.value;
    // Public data APIs only answer real browser sessions of our own site (anti-scraping).
    // Server-to-server webhooks can live under /api/hooks with their own auth.
    if (!pathname.startsWith("/api/hooks/")) {
      if (BOT_UA.test(ua) || !(await validDevice(device))) {
        return NextResponse.json({ error: "forbidden" }, { status: 403 });
      }
      const origin = req.headers.get("origin");
      if (req.method !== "GET" && origin && new URL(origin).host !== req.nextUrl.host) {
        return NextResponse.json({ error: "bad_origin" }, { status: 403 });
      }
    }
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "0";
    for (const [re, lim, name] of LIMITS) {
      if (re.test(pathname)) {
        const r = await rateLimit(`${name}:${ip}`, lim);
        if (!r.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(r.resetSec) } });
        break;
      }
    }
    return NextResponse.next();
  }

  const res = NextResponse.next();
  if (!(await validDevice(req.cookies.get(DEVICE_COOKIE)?.value))) {
    const id = crypto.randomUUID();
    res.cookies.set(DEVICE_COOKIE, `${id}.${await hmac(id)}`, {
      httpOnly: true, sameSite: "lax", secure: req.nextUrl.protocol === "https:", path: "/", maxAge: 60 * 60 * 24 * 365 * 2,
    });
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml).*)"],
};
