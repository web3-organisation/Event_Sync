'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Connexion simulée (Thème de test)');
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}>
            {/* Thunderbolt logo */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#F59E0B', marginRight: '8px' }}>
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--ev-primary)', fontFamily: 'var(--font-title)' }}>Event</span>
            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--font-title)' }}>Sync</span>
          </div>
          <h1 className={styles.title}>Espace Organisateur</h1>
          <p className={styles.subtitle}>Connectez-vous pour gérer vos événements.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">Adresse e-mail</label>
            <input
              className={styles.input}
              type="email"
              id="email"
              placeholder="organisateur@eventsync.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">Mot de passe</label>
            <input
              className={styles.input}
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className={styles.submitBtn} type="submit">
            Se connecter
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Vous n'avez pas de compte ?{' '}
            <Link href="/" className={styles.link}>
              Contactez l'administrateur
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
