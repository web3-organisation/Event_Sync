// app/login/actions.js
"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { signToken, setAdminCookie, clearAdminCookie } from "../lib/auth";

//
export async function loginAction(formData) {
  const email    = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  // Validation basique
  if (!email || !password) {
    return { error: "Veuillez remplir tous les champs." };
  }

  // ── Vérification des identifiants ──────────
  // On compare email + password_hash stockés dans .env
  // Message d'erreur générique (ne révèle pas si c'est l'email ou le MDP)
  const adminEmail    = process.env.ADMIN_EMAIL?.toLowerCase();
  const adminPwdHash  = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPwdHash) {
    console.error("[Auth] ADMIN_EMAIL ou ADMIN_PASSWORD_HASH manquant dans .env");
    return { error: "Erreur de configuration serveur." };
  }

  const emailMatch = email === adminEmail;
  // On appelle toujours bcrypt.compare même si l'email est faux
  // → évite les timing attacks (mesure du temps de réponse)
  const passwordMatch = await bcrypt.compare(
    password,
    emailMatch ? adminPwdHash : "$2b$12$4mimFWZ0ZF1D4c5LyEgE6uRJ29VXoWKW64SRzDfDXdZjlsPaw9Sb."
  );

  if (!emailMatch || !passwordMatch) {
    return { error: "Identifiants invalides." };
  }

  const token = await signToken({
    role:  "admin",
    email: adminEmail,
  });

  await setAdminCookie(token);

  redirect("/sessions/1");
}

export async function logoutAction() {
  await clearAdminCookie();
  redirect("/login");
}
console.log(process.env.ADMIN_PASSWORD_HASH);