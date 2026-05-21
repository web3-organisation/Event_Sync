// components/ui/Navbar.tsx  — Server Component
import Link from "next/link";
import { getSession } from "@/lib/auth";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const session = await getSession();
  return <NavbarClient isAdmin={!!session} email={session?.email ?? null} />;
}
