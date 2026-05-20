"use client";

import { useState, useEffect } from "react";

export default function FavButton({ sessionId }) {
  const [faved, setFaved] = useState(false);

  useEffect(() => {
    const handleInit = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("eventsync-favorites") || "[]");
        const isCurrentlyFaved = stored.includes(sessionId);
        if (faved !== isCurrentlyFaved) {
          setFaved(isCurrentlyFaved);
        }
      } catch (e) {
        console.error("Failed to load favorites", e);
      }
    };

    const timeoutId = setTimeout(handleInit, 0);
    return () => clearTimeout(timeoutId);
  }, [sessionId, faved]);

  function toggle() {
    try {
      const stored = JSON.parse(localStorage.getItem("eventsync-favorites") || "[]");
      const next = faved
        ? stored.filter((id) => id !== sessionId)
        : [...stored, sessionId];
      localStorage.setItem("eventsync-favorites", JSON.stringify(next));
      setFaved(!faved);
    } catch (e) {
      console.error("Failed to save favorite", e);
    }
  }

  return (
    <button
      className={`fav-btn ${faved ? "fav-btn--active" : ""}`}
      onClick={toggle}
      aria-label={faved ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-pressed={faved}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={faved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
      {faved ? "Dans mes favoris" : "Ajouter aux favoris"}
    </button>
  );
}
