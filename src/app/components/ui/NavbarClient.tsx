"use client";
// components/ui/NavbarClient.tsx
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, LayoutDashboard, Users, LogOut, Menu, X } from "lucide-react";
import toast from "react-hot-toast";

interface Props { isAdmin: boolean; email: string | null; }

export default function NavbarClient({ isAdmin, email }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Déconnexion réussie");
    router.push("/login");
    router.refresh();
  };

  const links = [
    { href: "/events",          label: "Événements", icon: CalendarDays },
    ...(isAdmin ? [
      { href: "/admin",         label: "Dashboard",  icon: LayoutDashboard },
      { href: "/admin/speakers",label: "Speakers",   icon: Users           },
    ] : []),
  ];

  const S: React.CSSProperties = { fontFamily: "'Space Grotesk', sans-serif" };

  return (
    <header className="sticky top-0 z-50 w-full" style={{ background: "#1A1A2E", borderBottom: "1px solid rgba(108,99,255,0.18)" }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/events" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
               style={{ background: "linear-gradient(135deg,#6C63FF,#00D4AA)" }}>🗓️</div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.2rem",
            background:"linear-gradient(135deg,#6C63FF,#00D4AA)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            EventSync
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ color: active ? "#6C63FF" : "rgba(248,249,255,0.55)", background: active ? "rgba(108,99,255,0.14)" : "transparent" }}>
                <Icon size={14} />{label}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="hidden md:flex items-center gap-3">
          {isAdmin ? (
            <>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background:"rgba(108,99,255,0.15)", color:"#8B85FF" }}>
                ADMIN · {email}
              </span>
              <button onClick={logout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all"
                style={{ color:"#FF6B6B", borderColor:"rgba(255,107,107,0.25)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,107,107,0.08)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <LogOut size={13} />Déconnexion
              </button>
            </>
          ) : (
            <Link href="/login"
              className="px-4 py-2 rounded-xl text-sm font-bold text-white"
              style={{ background:"linear-gradient(135deg,#6C63FF,#5850E8)" }}>
              Admin →
            </Link>
          )}
        </div>

        {/* Mobile */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>
      {open && (
        <div className="md:hidden px-6 pb-5 flex flex-col gap-2" style={{ background:"#1A1A2E" }}>
          {links.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className="py-2 text-sm font-medium" style={{ color:"rgba(248,249,255,0.7)" }}>{label}</Link>
          ))}
          {isAdmin && <button onClick={logout} className="py-2 text-left text-sm font-medium" style={{ color:"#FF6B6B" }}>Déconnexion</button>}
        </div>
      )}
    </header>
  );
}
