// app/admin/layout.tsx — Server Component
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Navbar from "@/components/ui/Navbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8F9FF" }}>
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
