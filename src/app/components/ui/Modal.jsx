"use client";
// components/ui/Modal.tsx
import { X } from "lucide-react";
import { useEffect } from "react";
import styles from "./Modal.module.css";

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={16} className={styles.closeIcon} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
