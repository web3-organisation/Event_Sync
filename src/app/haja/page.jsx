// app/test/page.jsx

"use client";

import { useRouter } from "next/navigation";

export default function TestPage() {
  const router = useRouter();

  function handleRedirect() {
    router.push("/admin");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontFamily: "Arial",
      }}
    >
      <h1>Test de redirection</h1>

      <button
        onClick={handleRedirect}
        style={{
          padding: "12px 24px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Aller vers /admin
      </button>
    </main>
  );
}