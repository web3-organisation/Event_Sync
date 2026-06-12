// "use client";
//
// export default function ThemeToggle() {
//   const toggleTheme = () => {
//     const currentTheme = document.documentElement.getAttribute("data-theme");
//     const newTheme = currentTheme === "dark" ? "light" : "dark";
//     document.documentElement.setAttribute("data-theme", newTheme);
//     localStorage.setItem("theme", newTheme);
//   };
//
//   return (
//     <button
//       onClick={toggleTheme}
//       style={{
//         position: "fixed",
//         bottom: "20px",
//         right: "20px",
//         padding: "10px",
//         borderRadius: "50%",
//         width: "44px",
//         height: "44px",
//         background: "var(--navy-light)",
//         border: "1px solid var(--border)",
//         cursor: "pointer",
//         zIndex: 999,
//       }}
//     >
//       🌓
//     </button>
//   );
// }

"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState("light");

    // Initialise depuis localStorage au chargement
    useEffect(() => {
        const saved = localStorage.getItem("theme") || "light";
        document.documentElement.setAttribute("data-theme", saved);
        setTheme(saved);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        setTheme(newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                padding: "10px",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                background: "var(--ev-primary-lt)",
                border: "1px solid var(--ev-border)",
                cursor: "pointer",
                zIndex: 999,
                fontSize: "18px",
            }}
        >
            {theme === "dark" ? "☀️" : "🌙"}
        </button>
    );
}