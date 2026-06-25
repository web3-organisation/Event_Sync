"use client";
// components/ui/NavbarClient.tsx
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, LayoutDashboard, Users, LogOut, Menu, X } from "lucide-react";
import toast from "react-hot-toast";
import styles from "./Navbar.module.css";

export default function NavbarClient({ isAdmin, email }) {
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

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/events" className={styles.logoLink}>
          <div className={styles.logoIcon}>🗓️</div>
          <span className={styles.logoText}>
            EventSync
          </span>
        </Link>

        {/* Desktop links */}
        <nav className={styles.desktopNav}>
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href}
                className={`${styles.navLink} ${active ? styles.navLinkActive : styles.navLinkInactive}`}>
                <Icon size={14} />{label}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className={styles.desktopRight}>
          {isAdmin ? (
            <>
              <span className={styles.adminBadge}>
                ADMIN · {email}
              </span>
              <button onClick={logout} className={styles.logoutBtn}>
                <LogOut size={13} />Déconnexion
              </button>
            </>
          ) : (
            <Link href="/login" className={styles.loginLink}>
              Admin →
            </Link>
          )}
        </div>

        {/* Mobile */}
        <button className={styles.mobileMenuBtn} onClick={() => setOpen(!open)}>
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>
      {open && (
        <div className={styles.mobileMenu}>
          {links.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className={styles.mobileNavLink}>{label}</Link>
          ))}
          {isAdmin && <button onClick={logout} className={styles.mobileLogoutBtn}>Déconnexion</button>}
        </div>
      )}
    </header>
  );
}
