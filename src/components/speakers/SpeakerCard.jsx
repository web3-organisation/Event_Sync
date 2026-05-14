"use client";

import { useState } from "react";
import styles from "./SpeakerCard.module.css";

const SpeakerCard = ({ speaker, searchQuery }) => {

    const [copied, setCopied]   = useState(false);
    const [showBio, setShowBio] = useState(false);

    // Get links from speakerLinks array
    const linkedin = speaker.speakerLinks?.find(
        (l) => l.label.toLowerCase() === "linkedin"
    );
    const twitter = speaker.speakerLinks?.find(
        (l) => l.label.toLowerCase() === "twitter"
    );
    const email = speaker.speakerLinks?.find(
        (l) => l.label.toLowerCase() === "email"
    );
    const phone = speaker.speakerLinks?.find(
        (l) => l.label.toLowerCase() === "phone"
    );

    const copyEmail = () => {
        if (!email) return;
        navigator.clipboard.writeText(email.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Highlight search query
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

            {/* Photo */}
            <div className={styles.header}>
                <div className={styles.avatarWrapper}>
                    <img
                        src={
                            speaker.photoUrl ||
                            `https://ui-avatars.com/api/?name=${speaker.fullName}&background=6366f1&color=fff`
                        }
                        alt={speaker.fullName}
                        className={styles.avatar}
                        onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${speaker.fullName}&background=6366f1&color=fff`;
                        }}
                    />
                    <span className={styles.badge} />
                </div>
            </div>

            {/* Body */}
            <div className={styles.body}>

                {/* Name */}
                <div className={styles.info}>
                    <h3 className={styles.name}>
                        {highlight(speaker.fullName)}
                    </h3>
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
                    {email && (
                        <div className={styles.contactRow}>
                            <span className={styles.icon}>📧</span>
                            <a
                                href={`mailto:${email.url}`}
                                className={`${styles.link} ${styles.emailLink}`}
                            >
                                {email.url}
                            </a>
                            <button
                                className={styles.copyBtn}
                                onClick={copyEmail}
                            >
                                {copied ? "✅" : "📋"}
                            </button>
                        </div>
                    )}

                    {/* Phone */}
                    {phone && (
                        <div className={styles.contactRow}>
                            <span className={styles.icon}>📞</span>
                            <a
                                href={`tel:${phone.url}`}
                                className={styles.link}
                            >
                                {phone.url}
                            </a>
                        </div>
                    )}

                    {/* LinkedIn */}
                    {linkedin && (
                        <div className={styles.contactRow}>
                            <span className={styles.icon}>💼</span>
                            <a
                                href={linkedin.url}
                                target="_blank"
                                rel="noreferrer"
                                className={styles.link}
                            >
                                {linkedin.url}
                            </a>
                        </div>
                    )}

                    {/* Twitter */}
                    {twitter && (
                        <div className={styles.contactRow}>
                            <span className={styles.icon}>🐦</span>
                            <a
                                href={twitter.url}
                                target="_blank"
                                rel="noreferrer"
                                className={styles.link}
                            >
                                {twitter.url}
                            </a>
                        </div>
                    )}

                    {/* Other links */}
                    {speaker.speakerLinks
                        ?.filter(
                            (l) => !["linkedin", "twitter", "email", "phone"]
                                .includes(l.label.toLowerCase())
                        )
                        .map((link) => (
                            <div key={link.id} className={styles.contactRow}>
                                <span className={styles.icon}>🔗</span>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={styles.link}
                                >
                                    {link.label}
                                </a>
                            </div>
                        ))}

                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    {email && (
                        <a
                            href={`mailto:${email.url}`}
                            className={styles.btnContact}
                        >
                            Contacter
                        </a>
                    )}
                    {linkedin && (
                        <a
                            href={linkedin.url}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.btnLinkedin}
                        >
                            LinkedIn
                        </a>
                    )}
                </div>

            </div>
        </div>
    );
};

export default SpeakerCard;