import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata = {
  title: "EventSync — Votre planning de conférences",
  description: "Gérez vos sessions favorites et posez vos questions en direct.",
};

function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Event<strong>Sync</strong></span>
        </Link>
        <nav className="nav">
          <Link href="/sessions" className="nav-link nav-link--active">Sessions</Link>
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="page-wrapper">
          <Header />
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}