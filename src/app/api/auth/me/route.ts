// app/api/auth/me/route.ts
import { getSession } from "@/lib/auth";
import { ok, err } from "@/lib/api";

export async function GET() {
  const session = await getSession();
  if (!session) return err("Non authentifié", 401);
  return ok(session);
}
