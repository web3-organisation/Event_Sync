// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken, COOKIE } from "@/lib/auth";
import { err } from "@/lib/api";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) return err("Email et mot de passe requis");

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return err("Identifiants invalides", 401);

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return err("Identifiants invalides", 401);

  const token = signToken({ adminId: admin.id, email: admin.email });

  const res = NextResponse.json({
    success: true,
    data: { id: admin.id, email: admin.email },
    message: "Connexion réussie",
  });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
