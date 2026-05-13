import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "EventSync",
  description: "Plateforme de gestion d'événements",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Toaster position="bottom-right" toastOptions={{
          style: { background:"#1A1A2E", color:"#F8F9FF", borderRadius:"12px", border:"1px solid rgba(108,99,255,0.3)", fontFamily:"'Space Grotesk',sans-serif" },
          success:{ iconTheme:{ primary:"#00D4AA", secondary:"#1A1A2E" } },
          error:{   iconTheme:{ primary:"#FF6B6B", secondary:"#1A1A2E" } },
        }} />
        {children}
      </body>
    </html>
  );
}
