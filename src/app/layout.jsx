import { Geist, Geist_Mono, Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";
import "./css/session.css";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  title: "EventSync — Votre planning de conférences",
  description: "Gérez vos sessions favorites et posez vos questions en direct.",
};



function Header() {
  return (
    <header style={{ 
      padding: '20px 0', 
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'background 0.3s ease'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', position: 'relative', width: '225px', height: '30px' }}>
          <Image src="/logo.png" alt="EventSync Logo" width={450} height={300} priority style={{ height: '150px', width: 'auto', position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 0 }} />
        </Link>
        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Événements</Link>
          <Link href="/sessions" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>Sessions</Link>
          <Link href="/speakers" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Intervenants</Link>
          <Link href="http://localhost:5173/login" target="react_admin_tab" style={{ fontWeight: '600', color: 'var(--ev-background)', background: 'var(--ev-primary)', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            Intranet
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem("theme");
                  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  var initialTheme = savedTheme || (prefersDark ? "dark" : "light");
                  document.documentElement.setAttribute("data-theme", initialTheme);
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: 'var(--bg)', color: 'var(--text-primary)', transition: 'background 0.3s ease, color 0.3s ease' }}>
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}