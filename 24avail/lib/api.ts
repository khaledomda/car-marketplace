import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";

export function ok(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}
export function fail(error: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ error, ...extra }, { status });
}
export async function body<T extends z.ZodTypeAny>(req: Request, schema: T): Promise<z.infer<T> | null> {
  try {
    const j = await req.json();
    const r = schema.safeParse(j);
    return r.success ? r.data : null;
  } catch {
    return null;
  }
}
export function num(v: string | null): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
export const uuid = z.string().uuid();
export const saPhone = z.string().trim().regex(/^[+\d\s()-]{8,20}$/);
