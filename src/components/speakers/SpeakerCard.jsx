"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./SpeakerCard.module.css";

function getInitials(name = "") {
    return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function highlight(text = "", searchQuery = "") {
    if (!searchQuery.trim()) return text;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    return text.split(regex).map((part, i) =>
        regex.test(part) ? <mark key={i} className={styles.highlight}>{part}</mark> : part
    );
}

/* ── Modal ── */
export function SpeakerModal({ speaker, onClose }) {
    const [mounted, setMounted] = useState(false);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        const handleKey = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handleKey);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKey);
        };
    }, [onClose]);

    if (!speaker || !mounted) return null;
    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Fermer">✕</button>

                <div className={styles.modalPhoto}>
                    {speaker.photoUrl
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={speaker.photoUrl} alt={speaker.fullName} />
                        : <div className={styles.modalInitials}>{getInitials(speaker.fullName)}</div>
                    }
                </div>

                <div className={styles.modalBody}>
                    <h2 className={styles.modalName}>
                        {speaker.fullName}
                        <span className={styles.modalVerified}>✔</span>
                    </h2>

                    {speaker.bio && <p className={styles.modalBio}>{speaker.bio}</p>}
                </div>
            </div>
        </div>,
        document.body
    );
}

export default function SpeakerCard({ speaker, searchQuery = "", onModalClose }) {
    const [showModal, setShowModal] = useState(false);

    const handleOpen = () => {
        setShowModal(true);
        window.history.pushState(null, "", `/speakers/${speaker.id}`);
    };

    const handleClose = () => {
        setShowModal(false);
        window.history.pushState(null, "", "/speakers");
        if (onModalClose) onModalClose();
    };

    return (
        <>
            <div className={styles.card} onClick={handleOpen}>
                {/* Photo */}
                <div className={styles.photoWrap}>
                    {speaker.photoUrl
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={speaker.photoUrl} alt={speaker.fullName} className={styles.photo} />
                        : <div className={styles.initials}>{getInitials(speaker.fullName)}</div>
                    }
                </div>

                {/* Corps */}
                <div className={styles.cardBody}>
                    <div className={styles.nameRow}>
                        <span className={styles.name}>{highlight(speaker.fullName, searchQuery)}</span>
                    </div>
                    {speaker.bio && (
                        <p className={styles.bio}>
                            {speaker.bio.slice(0, 90)}{speaker.bio.length > 90 ? "…" : ""}
                        </p>
                    )}
                </div>
            </div>

            {showModal && (
                <SpeakerModal speaker={speaker} onClose={handleClose} />
            )}
        </>
    );
}