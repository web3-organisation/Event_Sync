import { Geist, Geist_Mono, Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";
import "./css/session.css";
import Link from "next/link";

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
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      background: 'rgba(10,10,15,0.8)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>⚡</span>
          <span style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '20px', 
            fontWeight: 800, 
            color: '#fff',
            letterSpacing: '-0.02em'
          }}>
            Event<span style={{ color: '#7C3AED' }}>Sync</span>
          </span>
        </Link>
        <nav style={{ display: 'flex', gap: '24px' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Événements</Link>
          <Link href="/sessions" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>Sessions</Link>
          <Link href="/speakers" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Intervenants</Link>
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} ${dmSans.variable}`}>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0A0A0F', color: '#fff' }}>
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}