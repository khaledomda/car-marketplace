import "server-only";
import { isAdmin } from "./admin-auth";
import { fail } from "./api";

export async function guard() {
  return (await isAdmin()) ? null : fail("unauthorized", 401);
}
