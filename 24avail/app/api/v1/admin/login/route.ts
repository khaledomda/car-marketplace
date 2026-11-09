import { ok, fail } from "@/lib/api";
import { adminLogin } from "@/lib/admin-auth";
import { recordEvent } from "@/lib/events";
import { context } from "@/lib/request-context";

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  const ctx = await context();
  const good = typeof password === "string" && password.length <= 200 && (await adminLogin(password));
  await recordEvent({ type: good ? "admin.login" : "admin.login_failed", actorType: "admin", ipHash: ctx.ipHash });
  return good ? ok({ ok: true }) : fail("bad_credentials", 401);
}
