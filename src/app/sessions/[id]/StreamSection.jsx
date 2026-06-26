"use client";
// src/app/session/[id]/StreamSection.jsx

import { useRef } from "react";

export default function StreamSection({ live, ended, timeStart, title }) {
  const playerRef = useRef(null);

  function handleFullscreen() {
    const el = playerRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  }

  if (live) {
    return (
      <section className="stream-section" aria-label="Diffusion en direct">
        <h2 className="session-description__heading">Diffusion en direct</h2>
        <div className="stream-player" ref={playerRef}>
          <div className="stream-player__screen">
            <div className="stream-player__noise" />
            <div className="stream-player__overlay">
              <span className="stream-live-badge">
                <span className="live-dot" />
                EN DIRECT
              </span>
              <p className="stream-player__label">{title}</p>
            </div>
            <div className="stream-player__play-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <circle cx="12" cy="12" r="12" fill="rgba(124,58,237,0.85)" />
                <polygon points="10,8 16,12 10,16" fill="white" />
              </svg>
            </div>
          </div>

          <div className="stream-player__controls">
            <div className="stream-controls__left">
              <button className="stream-ctrl-btn" aria-label="Lecture" disabled>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </button>
              <span className="stream-ctrl-time">En direct</span>
            </div>
            <div className="stream-controls__right">
              <button className="stream-ctrl-btn" aria-label="Son" disabled>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 010 7.07" />
                </svg>
              </button>
              <button
                className="stream-ctrl-btn stream-ctrl-btn--active"
                aria-label="Plein écran"
                onClick={handleFullscreen}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (ended) {
    return (
      <section className="stream-section" aria-label="Session terminée">
        <h2 className="session-description__heading">Diffusion</h2>
        <div className="stream-ended">
          <div className="stream-ended__icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
              <line x1="4" y1="4" x2="20" y2="20" strokeWidth="1.5" />
            </svg>
          </div>
          <p className="stream-ended__title">Session terminée</p>
          <p className="stream-ended__desc">
            Cette session s'est terminée. Le replay sera disponible prochainement.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="stream-section" aria-label="Session à venir">
      <h2 className="session-description__heading">Diffusion</h2>
      <div className="stream-upcoming">
        <div className="stream-upcoming__icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <p className="stream-upcoming__title">Diffusion à venir</p>
        <p className="stream-upcoming__desc">
          Le direct démarrera à <strong>{timeStart}</strong>. Revenez à l'heure de la session pour suivre la diffusion en direct.
        </p>
      </div>
    </section>
  );
}