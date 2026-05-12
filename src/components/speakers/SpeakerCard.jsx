"use client";

import { useState } from "react";
import styles from "./SpeakerCard.module.css";

const SpeakerCard = ({ speaker, searchQuery }) => {

    const [copied, setCopied]   = useState(false);
    const [showBio, setShowBio] = useState(false);

    // ── Copier email ───────────────────────────
    const copyEmail = () => {
        navigator.clipboard.writeText(speaker.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // ── Surligner le texte recherché ───────────
    const highlight = (text) => {
        if (!searchQuery || searchQuery.trim() === "") return text;

        const regex = new RegExp(`(${searchQuery})`, "gi");
        const parts = String(text).split(regex);

        return parts.map((part, i) =>
            regex.test(part)
                ? <span key={i} className={styles.highlight}>{part}</span>
                : part
        );
    };

    return (
        <div className={styles.card}>

            {/* ── HEADER : Photo ───────────────── */}
            <div className={styles.header}>
                <div className={styles.avatarWrapper}>
                    <img
                        src={speaker.picture}
                        alt={speaker.name}
                        className={styles.avatar}
                        onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${speaker.name}&background=6366f1&color=fff`;
                        }}
                    />
                    <span className={styles.badge} />
                </div>
            </div>

            {/* ── BODY ─────────────────────────── */}
            <div className={styles.body}>

                {/* Nom / Titre / Entreprise */}
                <div className={styles.info}>
                    <h3 className={styles.name}>
                        {highlight(speaker.name)}
                    </h3>
                    <p className={styles.title}>
                        {highlight(speaker.title)}
                    </p>
                    <p className={styles.company}>
                        🏢 {highlight(speaker.company)}
                    </p>
                </div>

                {/* Bio */}
                {speaker.bio && (
                    <div className={styles.bioWrapper}>
                        <p className={styles.bio}>
                            {showBio
                                ? speaker.bio
                                : speaker.bio.slice(0, 80) + "..."}
                        </p>
                        <button
                            className={styles.bioBtn}
                            onClick={() => setShowBio(!showBio)}
                        >
                            {showBio ? "Voir moins ▲" : "Voir plus ▼"}
                        </button>
                    </div>
                )}

                <hr className={styles.divider} />

                {/* Contacts */}
                <div className={styles.contacts}>

                    {/* Email */}
                    <div className={styles.contactRow}>
                        <span className={styles.icon}>📧</span>
                        <a
                            href={`mailto:${speaker.email}`}
                            className={`${styles.link} ${styles.emailLink}`}
                        >
                            {highlight(speaker.email)}
                        </a>
                        <button
                            className={styles.copyBtn}
                            onClick={copyEmail}
                            title="Copier l'email"
                        >
                            {copied ? "✅" : "📋"}
                        </button>
                    </div>

                    {/* Téléphone */}
                    <div className={styles.contactRow}>
                        <span className={styles.icon}>📞</span>
                        <a
                            href={`tel:${speaker.phone}`}
                            className={styles.link}
                        >
                            {highlight(speaker.phone)}
                        </a>
                    </div>

                    {/* LinkedIn */}
                    <div className={styles.contactRow}>
                        <span className={styles.icon}>💼</span>
                        <a
                            href={`https://${speaker.linkedin}`}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.link}
                        >
                            {speaker.linkedin}
                        </a>
                    </div>

                    {/* Twitter */}
                    {speaker.twitter && (
                        <div className={styles.contactRow}>
                            <span className={styles.icon}>🐦</span>
                            <span className={styles.link}>
                {speaker.twitter}
              </span>
                        </div>
                    )}

                </div>

                {/* Boutons */}
                <div className={styles.actions}>
                    <a
                        href={`mailto:${speaker.email}`}
                        className={styles.btnContact}
                    >
                        Contacter
                    </a>
                    <a
                        href={`https://${speaker.linkedin}`}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.btnLinkedin}
                    >
                        LinkedIn
                    </a>
                </div>

            </div>
        </div>
    );
};

export default SpeakerCard;