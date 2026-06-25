import "./globals.css";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";

export const metadata = {
  title: "Event Sync | Plateforme de gestion d'événements",
  description: "Synchronisez vos événements, plannings et intervenants en temps réel.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" data-theme="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const theme = savedTheme || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {
                  console.error('Failed to set theme script:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <nav style={{
          padding: '20px 80px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          fontFamily: 'var(--font-body)',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        }}>
          {/* Logo with Thunderbolt */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px', color: '#F59E0B' }}>
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
            <span style={{ color: 'var(--ev-primary)', fontFamily: 'var(--font-title)' }}>Event</span>
            <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-title)' }}>Sync</span>
          </Link>
          
          {/* Navigation Links and Theme Toggle */}
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <Link href="/" style={{ fontWeight: '500', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Événements</Link>
            <Link href="/planning" style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Sessions</Link>
            <Link href="/planning" style={{ fontWeight: '500', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Intervenants</Link>
            <Link href="http://localhost:5173/login" target="react_admin_tab" style={{ fontWeight: '600', color: 'var(--ev-background)', background: 'var(--ev-primary)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
              Intranet
            </Link>
            <ThemeToggle />
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
