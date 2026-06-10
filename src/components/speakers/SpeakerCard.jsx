"use client";

import { useState } from "react";
import styles from "./SpeakerCard.module.css";

const TRACK_CONFIG = {
    ai: {
        label: "IA",
        cardClass: styles.cardAi,
        avClass: styles.avAi,
        badgeClass: styles.badgeAi,
    },
    cy: {
        label: "Cyber",
        cardClass: styles.cardCy,
        avClass: styles.avCy,
        badgeClass: styles.badgeCy,
    },
    cl: {
        label: "Cloud",
        cardClass: styles.cardCl,
        avClass: styles.avCl,
        badgeClass: styles.badgeCl,
    },
    ds: {
        label: "Design",
        cardClass: styles.cardDs,
        avClass: styles.avDs,
        badgeClass: styles.badgeDs,
    },
};

function getInitials(name = "") {
    return name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
}

export default function SpeakerCard({
                                        speaker,
                                        searchQuery = "",
                                    }) {
    const [showBio, setShowBio] = useState(false);
    const [copied, setCopied] = useState(false);

    const cfg =
        TRACK_CONFIG[speaker.track] ??
        TRACK_CONFIG.ai;

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

    const highlight = (text = "") => {
        if (!searchQuery.trim()) return text;

        const regex = new RegExp(
            `(${searchQuery.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            )})`,
            "gi"
        );

        return text
            .split(regex)
            .map((part, i) =>
                regex.test(part) ? (
                    <mark
                        key={i}
                        className={styles.highlight}
                    >
                        {part}
                    </mark>
                ) : (
                    part
                )
            );
    };

    const copyEmail = () => {
        if (!email) return;

        navigator.clipboard.writeText(email.url);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <div
            className={`${styles.card} ${cfg.cardClass}`}
        >
            <div className={styles.topRow}>
                <div
                    className={`${styles.av} ${cfg.avClass}`}
                >
                    {speaker.photo ? (
                        <img
                            src={speaker.photo}
                            alt={speaker.fullName}
                            className={styles.avatarImg}
                        />
                    ) : (
                        getInitials(speaker.fullName)
                    )}
                </div>

                <div className={styles.info}>
                    <div className={styles.spName}>
                        {highlight(speaker.fullName)}
                    </div>

                    {speaker.role && (
                        <div className={styles.spRole}>
                            {speaker.role}
                        </div>
                    )}

                    {speaker.company && (
                        <div className={styles.spCo}>
                            {speaker.company}
                        </div>
                    )}

                    <div className={styles.links}>
                        {email && (
                            <>
                                <a
                                    href={`mailto:${email.url}`}
                                    className={styles.lnk}
                                >
                                    ✉
                                </a>

                                <button
                                    className={styles.lnk}
                                    onClick={copyEmail}
                                >
                                    {copied ? "✓" : "⧉"}
                                </button>
                            </>
                        )}

                        {phone && (
                            <a
                                href={`tel:${phone.url}`}
                                className={styles.lnk}
                            >
                                ☎
                            </a>
                        )}

                        {linkedin && (
                            <a
                                href={linkedin.url}
                                target="_blank"
                                rel="noreferrer"
                                className={styles.lnk}
                            >
                                in
                            </a>
                        )}

                        {twitter && (
                            <a
                                href={twitter.url}
                                target="_blank"
                                rel="noreferrer"
                                className={styles.lnk}
                            >
                                X
                            </a>
                        )}
                    </div>
                </div>

                <span
                    className={`${styles.badge} ${cfg.badgeClass}`}
                >
          {cfg.label}
        </span>
            </div>

            {speaker.bio && (
                <div className={styles.bioSection}>
                    <p className={styles.bioText}>
                        {showBio
                            ? speaker.bio
                            : `${speaker.bio.slice(0, 120)}...`}
                    </p>

                    <button
                        className={styles.bioBtn}
                        onClick={() =>
                            setShowBio(!showBio)
                        }
                    >
                        {showBio
                            ? "See less ▲"
                            : "See more ▼"}
                    </button>
                </div>
            )}
        </div>
    );
}