// lib/auth.js
// JWT utilitaires — jose (Edge Runtime compatible, pas Node-only)
// Utilisé par : middleware.js, app/login/actions.js, app/admin/...

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "eventsync_admin_token";
const EXPIRY      = "8h"; // durée de session (journée de travail)

// ── Clé secrète ──────────────────────────────
// jose attend un Uint8Array
function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET manquant dans .env.local");
  return new TextEncoder().encode(secret);
}

// ── Signer un token ───────────────────────────
export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(getSecret());
}

// ── Vérifier un token ─────────────────────────
// Retourne le payload décodé, ou null si invalide / expiré
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}

// ── Lire la session admin depuis les cookies ──
// À utiliser dans les Server Components / Server Actions
export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ── Poser le cookie JWT (login) ───────────────
// httpOnly + Secure + SameSite=lax → protège contre XSS et CSRF
export async function setAdminCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   8 * 60 * 60, // 8h en secondes
    path:     "/",
  });
}

// ── Supprimer le cookie (logout) ──────────────
export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ── Exporter le nom du cookie pour le middleware
// (le middleware ne peut pas importer next/headers)
export { COOKIE_NAME };