"use client";
// components/ui/Modal.tsx
import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in"
      style={{ background:"rgba(26,26,46,0.7)", backdropFilter:"blur(6px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-8 animate-slide-up"
        style={{ background:"#fff", boxShadow:"0 24px 60px rgba(26,26,46,0.2)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.3rem", fontWeight:700, color:"#1A1A2E" }}>{title}</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{ background:"rgba(26,26,46,0.07)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,107,107,0.12)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(26,26,46,0.07)")}>
            <X size={16} style={{ color:"#1A1A2E" }} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
