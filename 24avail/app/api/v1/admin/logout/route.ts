import { ok } from "@/lib/api";
import { adminLogout } from "@/lib/admin-auth";
export async function POST() { await adminLogout(); return ok({ ok: true }); }
