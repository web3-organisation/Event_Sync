// middleware.js  — à la racine du projet (même niveau que package.json)
// Tourne sur Edge Runtime → utilise jose (pas lib/auth.js qui importe next/headers)

import { NextResponse } from "next/server";
import { jwtVerify }    from "jose";

const COOKIE_NAME    = "eventsync_admin_token";
const PROTECTED_PATH = "/admin"; // tout ce qui commence par /admin est protégé

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET manquant");
  return new TextEncoder().encode(secret);
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Seules les routes /admin/* sont protégées
  if (!pathname.startsWith(PROTECTED_PATH)) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;

  // Pas de token → redirection vers /login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname); // pour rediriger après login
    return NextResponse.redirect(loginUrl);
  }

  // Token invalide ou expiré → redirection vers /login
  try {
    await jwtVerify(token, getSecret());
    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("expired", "1");
    return NextResponse.redirect(loginUrl);
  }
}

// Matcher : uniquement les routes /admin/**
// On exclut les assets statiques automatiquement
export const config = {
  matcher: ["/admin/:path*"],
};