// app/login/page.jsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "./action";
import "../css/login.css";

// ── Spinner icon ──────────────────────────────
function IconSpinner() {
  return (
    <svg
      width="18" height="18"
      viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5"
      style={{ animation: "spin 0.7s linear infinite", flexShrink: 0 }}
      aria-hidden="true"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState(() => 
    searchParams.get("expired") === "1" ? "Votre session a expiré. Reconnectez-vous." : null
  );
  const [isPending,  startTransition] = useTransition();

  useEffect(() => {
    const saved      = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute(
      "data-theme",
      saved ?? (prefersDark ? "dark" : "light")
    );
  }, []);

  // ── Soumission du formulaire ──────────────
  function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await loginAction(fd);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <>
      {/* Animation spinner injectée via style tag */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <main className="login-page">
        <section className="login-card">

          <div className="login-left">
            <div className="login-brand">
              <div className="brand-logo">⚡</div>
              <div>
                <h1>EventSync</h1>
                <p>Plateforme libre de diffusion d&apos;événements</p>
              </div>
            </div>

            <div className="login-copy">
              <span className="live-badge">ADMIN ONLY</span>
              <h2>Connexion sécurisée</h2>
              <p>
                Cet accès est réservé aux administrateurs pour gérer la diffusion,
                la modération et les publications.
              </p>
            </div>
          </div>

          {/* ── DROITE : formulaire ───────────────── */}
          <div className="login-right">
            <div className="form-box">
              <h3>Se connecter</h3>
              <p>Utilisez votre compte administrateur.</p>

              <form className="login-form" onSubmit={handleSubmit} noValidate>

                {/* Message d'erreur */}
                {error && (
                  <div className="login-error" role="alert">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}

                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    disabled={isPending}
                    placeholder="admin@eventsync.com"
                  />
                </label>

                <label>
                  Mot de passe
                  <input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    disabled={isPending}
                    placeholder="••••••••"
                  />
                </label>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <IconSpinner />
                      Connexion…
                    </>
                  ) : (
                    "Connexion"
                  )}
                </button>
              </form>
            </div>
          </div>

        </section>
      </main>
    </>
  );
}