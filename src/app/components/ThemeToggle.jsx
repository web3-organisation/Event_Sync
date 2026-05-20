"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Différer l'exécution pour éviter l'erreur "Calling setState synchronously"
    const timer = setTimeout(() => {
      setMounted(true);
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
      setTheme(initialTheme);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const buttonStyle = {
    background: "var(--navy-mid)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "8px 12px",
    cursor: "pointer",
    color: "var(--text-primary)",
    fontSize: "14px",
    transition: "all 0.2s",
    minWidth: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  if (!mounted) {
    return (
      <button style={{ ...buttonStyle, opacity: 0 }}>
        🌓
      </button>
    );
  }

  return (
    <button onClick={toggleTheme} style={buttonStyle} aria-label="Toggle theme">
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
