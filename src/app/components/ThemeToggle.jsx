"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const buttonStyle = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  padding: "10px",
  borderRadius: "50%",
  width: "44px",
  height: "44px",
  background: "var(--navy-light)",
  border: "1px solid var(--border)",
  cursor: "pointer",
  zIndex: 999,
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const currentTheme = document.documentElement.getAttribute("data-theme");
      if (currentTheme === "dark") {
        setIsDark(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setIsDark(newTheme === "dark");
  };

  if (!mounted) {
    return <button style={buttonStyle}></button>;
  }

  return (
    <button onClick={toggleTheme} style={buttonStyle}>
      <FontAwesomeIcon 
        icon={isDark ? faSun : faMoon} 
        style={{ color: "var(--text-primary)", fontSize: "1.2rem" }} 
      />
    </button>
  );
}