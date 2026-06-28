// src/app/api/auth/login/route.js
import bcrypt from "bcryptjs";
import { signToken } from "../../../lib/auth";
import { NextResponse } from "next/server";

const origin = process.env.ADMIN_CORS_ORIGIN;

if (!origin) {
  throw new Error("ADMIN_CORS_ORIGINis not set");
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Veuillez remplir tous les champs." },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const adminEmail   = process.env.ADMIN_EMAIL?.toLowerCase();
  const adminPwdHash = process.env.ADMIN_PASSWORD_HASH;
  const dummyHash    = process.env.ADMIN_DUMMY_HASH;

  if (!adminEmail || !adminPwdHash || !dummyHash) {
    return NextResponse.json(
      { error: "Erreur de configuration serveur." },
      { status: 500, headers: CORS_HEADERS }
    );
  }

  const emailMatch    = email.toLowerCase() === adminEmail;
  const passwordMatch = await bcrypt.compare(
    password,
    emailMatch ? adminPwdHash : dummyHash
  );

  if (!emailMatch || !passwordMatch) {
    return NextResponse.json(
      { error: "Identifiants invalides." },
      { status: 401, headers: CORS_HEADERS }
    );
  }

  const token = await signToken({ role: "admin", email: adminEmail });
  return NextResponse.json({ token }, { headers: CORS_HEADERS });
}