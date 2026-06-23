import bcrypt from "bcryptjs";
import { signToken } from "../../../lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Veuillez remplir tous les champs." },
      { status: 400 }
    );
  }

  const adminEmail    = process.env.ADMIN_EMAIL?.toLowerCase();
  const adminPwdHash  = process.env.ADMIN_PASSWORD_HASH;
  const dummyHash     = process.env.ADMIN_DUMMY_HASH;

  if (!adminEmail || !adminPwdHash || !dummyHash) {
    return NextResponse.json(
      { error: "Erreur de configuration serveur." },
      { status: 500 }
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
      { status: 401 }
    );
  }

  const token = await signToken({ role: "admin", email: adminEmail });
  return NextResponse.json({ token });
}