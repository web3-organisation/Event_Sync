import { NextResponse } from "next/server";

const COOKIE_NAME = "eventsync_admin_token";
const PROTECTED_PATH = "/admin";
const AUTH_ONLY_PATH = "/login";

function base64UrlToBytes(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

function bytesToBase64Url(bytes) {
  const binary = String.fromCharCode(...bytes);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [encodedHeader, encodedPayload, signature] = parts;

  try {
    const header = JSON.parse(new TextDecoder().decode(base64UrlToBytes(encodedHeader)));
    if (header.alg !== "HS256") return false;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signed = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(signed)
    );

    if (bytesToBase64Url(new Uint8Array(expectedSignature)) !== signature) {
      return false;
    }

    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(encodedPayload)));
    return !payload.exp || payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export async function proxy(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const isAuthenticated = token ? await verifyToken(token) : false;

  if (pathname.startsWith(PROTECTED_PATH) && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith(AUTH_ONLY_PATH) && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
