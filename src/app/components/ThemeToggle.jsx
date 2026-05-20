"use client";

export default function ThemeToggle() {
  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
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
      }}
    >
      🌓
    </button>
  );
}