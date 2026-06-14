// app/components/LogoutButton.jsx
// Bouton de déconnexion réutilisable dans les pages admin
"use client";

import { useTransition } from "react";
import { logoutAction } from "../login/actions";

export default function LogoutButton({ className = "" }) {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(() => logoutAction());
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className={`logout-btn ${className}`}
      aria-label="Se déconnecter"
    >
      {isPending ? (
        "Déconnexion…"
      ) : (
        <>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Déconnexion
        </>
      )}
    </button>
  );
}