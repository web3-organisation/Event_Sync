// lib/api.ts
import { NextResponse } from "next/server";
import { getSession } from "./auth";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

/** Middleware helper: vérifie le JWT et retourne le payload admin */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;
  return session;
}
