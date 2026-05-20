"use client";

import { useEffect } from "react";
import ThemeToggle from "../components/ThemeToggle";
import "../css/login.css";

export default function LoginPage() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-left">
          <div className="login-brand">
            <div className="brand-logo">E</div>
            <div>
              <h1>EventSync</h1>
              <p>Plateforme libre de diffusion d’événements</p>
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

        <div className="login-right">


          <div className="form-box">
            <h3>Se connecter</h3>
            <p>Utilisez votre compte administrateur.</p>

            <form className="login-form">
              <label>
                Email
                <input type="email" />
              </label>

              <label>
                Mot de passe
                <input type="password" placeholder="••••••••" />
              </label>

              <button type="submit" className="submit-btn">
                Connexion
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}