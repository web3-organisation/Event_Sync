// // "use client";
// //
// // import { useState } from "react";
// // import styles from "./SpeakerCard.module.css";
// //
// // const SpeakerCard = ({ speaker, searchQuery }) => {
// //
// //     const [copied, setCopied]   = useState(false);
// //     const [showBio, setShowBio] = useState(false);
// //
// //     // Get links from speakerLinks array
// //     const linkedin = speaker.speakerLinks?.find(
// //         (l) => l.label.toLowerCase() === "linkedin"
// //     );
// //     const twitter = speaker.speakerLinks?.find(
// //         (l) => l.label.toLowerCase() === "twitter"
// //     );
// //     const email = speaker.speakerLinks?.find(
// //         (l) => l.label.toLowerCase() === "email"
// //     );
// //     const phone = speaker.speakerLinks?.find(
// //         (l) => l.label.toLowerCase() === "phone"
// //     );
// //
// //     const copyEmail = () => {
// //         if (!email) return;
// //         navigator.clipboard.writeText(email.url);
// //         setCopied(true);
// //         setTimeout(() => setCopied(false), 2000);
// //     };
// //
// //     // Highlight search query
// //     const highlight = (text) => {
// //         if (!searchQuery || searchQuery.trim() === "") return text;
// //         const regex = new RegExp(`(${searchQuery})`, "gi");
// //         const parts = String(text).split(regex);
// //         return parts.map((part, i) =>
// //             regex.test(part)
// //                 ? <span key={i} className={styles.highlight}>{part}</span>
// //                 : part
// //         );
// //     };
// //
// //     return (
// //         <div className={styles.card}>
// //
// //             {/* Photo */}
// //             <div className={styles.header}>
// //                 <div className={styles.avatarWrapper}>
// //                     <img
// //                         src={
// //                             speaker.photoUrl ||
// //                             `https://ui-avatars.com/api/?name=${speaker.fullName}&background=6366f1&color=fff`
// //                         }
// //                         alt={speaker.fullName}
// //                         className={styles.avatar}
// //                         onError={(e) => {
// //                             e.target.src = `https://ui-avatars.com/api/?name=${speaker.fullName}&background=6366f1&color=fff`;
// //                         }}
// //                     />
// //                     <span className={styles.badge} />
// //                 </div>
// //             </div>
// //
// //             {/* Body */}
// //             <div className={styles.body}>
// //
// //                 {/* Name */}
// //                 <div className={styles.info}>
// //                     <h3 className={styles.name}>
// //                         {highlight(speaker.fullName)}
// //                     </h3>
// //                 </div>
// //
// //                 {/* Bio */}
// //                 {speaker.bio && (
// //                     <div className={styles.bioWrapper}>
// //                         <p className={styles.bio}>
// //                             {showBio
// //                                 ? speaker.bio
// //                                 : speaker.bio.slice(0, 80) + "..."}
// //                         </p>
// //                         <button
// //                             className={styles.bioBtn}
// //                             onClick={() => setShowBio(!showBio)}
// //                         >
// //                             {showBio ? "Voir moins ▲" : "Voir plus ▼"}
// //                         </button>
// //                     </div>
// //                 )}
// //
// //                 <hr className={styles.divider} />
// //
// //                 {/* Contacts */}
// //                 <div className={styles.contacts}>
// //
// //                     {/* Email */}
// //                     {email && (
// //                         <div className={styles.contactRow}>
// //                             <span className={styles.icon}>📧</span>
// //                             <a
// //                                 href={`mailto:${email.url}`}
// //                                 className={`${styles.link} ${styles.emailLink}`}
// //                             >
// //                                 {email.url}
// //                             </a>
// //                             <button
// //                                 className={styles.copyBtn}
// //                                 onClick={copyEmail}
// //                             >
// //                                 {copied ? "✅" : "📋"}
// //                             </button>
// //                         </div>
// //                     )}
// //
// //                     {/* Phone */}
// //                     {phone && (
// //                         <div className={styles.contactRow}>
// //                             <span className={styles.icon}>📞</span>
// //                             <a
// //                                 href={`tel:${phone.url}`}
// //                                 className={styles.link}
// //                             >
// //                                 {phone.url}
// //                             </a>
// //                         </div>
// //                     )}
// //
// //                     {/* LinkedIn */}
// //                     {linkedin && (
// //                         <div className={styles.contactRow}>
// //                             <span className={styles.icon}>💼</span>
// //                             <a
// //                                 href={linkedin.url}
// //                                 target="_blank"
// //                                 rel="noreferrer"
// //                                 className={styles.link}
// //                             >
// //                                 {linkedin.url}
// //                             </a>
// //                         </div>
// //                     )}
// //
// //                     {/* Twitter */}
// //                     {twitter && (
// //                         <div className={styles.contactRow}>
// //                             <span className={styles.icon}>🐦</span>
// //                             <a
// //                                 href={twitter.url}
// //                                 target="_blank"
// //                                 rel="noreferrer"
// //                                 className={styles.link}
// //                             >
// //                                 {twitter.url}
// //                             </a>
// //                         </div>
// //                     )}
// //
// //                     {/* Other links */}
// //                     {speaker.speakerLinks
// //                         ?.filter(
// //                             (l) => !["linkedin", "twitter", "email", "phone"]
// //                                 .includes(l.label.toLowerCase())
// //                         )
// //                         .map((link) => (
// //                             <div key={link.id} className={styles.contactRow}>
// //                                 <span className={styles.icon}>🔗</span>
// //                                 <a
// //                                     href={link.url}
// //                                     target="_blank"
// //                                     rel="noreferrer"
// //                                     className={styles.link}
// //                                 >
// //                                     {link.label}
// //                                 </a>
// //                             </div>
// //                         ))}
// //
// //                 </div>
// //
// //                 {/* Actions */}
// //                 <div className={styles.actions}>
// //                     {email && (
// //                         <a
// //                             href={`mailto:${email.url}`}
// //                             className={styles.btnContact}
// //                         >
// //                             Contacter
// //                         </a>
// //                     )}
// //                     {linkedin && (
// //                         <a
// //                             href={linkedin.url}
// //                             target="_blank"
// //                             rel="noreferrer"
// //                             className={styles.btnLinkedin}
// //                         >
// //                             LinkedIn
// //                         </a>
// //                     )}
// //                 </div>
// //
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default SpeakerCard;
//
// "use client";
//
// import { useState } from "react";
// import styles from "./SpeakerCard.module.css";
//
// const TRACK_CONFIG = {
//     ai: { label: "IA",     cardClass: styles.cardAi, avClass: styles.avAi, badgeClass: styles.badgeAi },
//     cy: { label: "Cyber",  cardClass: styles.cardCy, avClass: styles.avCy, badgeClass: styles.badgeCy },
//     cl: { label: "Cloud",  cardClass: styles.cardCl, avClass: styles.avCl, badgeClass: styles.badgeCl },
//     ds: { label: "Design", cardClass: styles.cardDs, avClass: styles.avDs, badgeClass: styles.badgeDs },
// };
//
// function getInitials(fullName = "") {
//     return fullName
//         .split(" ")
//         .slice(0, 2)
//         .map((w) => w[0])
//         .join("")
//         .toUpperCase();
// }
//
// const SpeakerCard = ({ speaker, searchQuery = "" }) => {
//     const [copied, setCopied] = useState(false);
//     const [showBio, setShowBio] = useState(false);
//
//     const cfg = TRACK_CONFIG[speaker.track] ?? TRACK_CONFIG.ai;
//
//     const linkedin = speaker.speakerLinks?.find((l) => l.label.toLowerCase() === "linkedin");
//     const twitter  = speaker.speakerLinks?.find((l) => l.label.toLowerCase() === "twitter");
//     const email    = speaker.speakerLinks?.find((l) => l.label.toLowerCase() === "email");
//     const phone    = speaker.speakerLinks?.find((l) => l.label.toLowerCase() === "phone");
//     const others   = speaker.speakerLinks?.filter(
//         (l) => !["linkedin", "twitter", "email", "phone"].includes(l.label.toLowerCase())
//     ) ?? [];
//
//     const copyEmail = () => {
//         if (!email) return;
//         navigator.clipboard.writeText(email.url);
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//     };
//
//     const highlight = (text = "") => {
//         if (!searchQuery || searchQuery.trim() === "") return text;
//         const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
//         return String(text)
//             .split(regex)
//             .map((part, i) =>
//                 regex.test(part)
//                     ? <mark key={i} className={styles.highlight}>{part}</mark>
//                     : part
//             );
//     };
//
//     const hasBio = !!speaker.bio;
//
//     return (
//         <div className={`${styles.card} ${cfg.cardClass} ${hasBio ? styles.cardColumn : ""}`}>
//
//             {/* Top row — always visible */}
//             <div className={styles.topRow}>
//
//                 {/* Avatar initiales */}
//                 <div className={`${styles.av} ${cfg.avClass}`}>
//                     {getInitials(speaker.fullName)}
//                 </div>
//
//                 {/* Infos */}
//                 <div className={styles.info}>
//                     <div className={styles.spName}>{highlight(speaker.fullName)}</div>
//                     {speaker.role    && <div className={styles.spRole}>{speaker.role}</div>}
//                     {speaker.company && <div className={styles.spCo}>{speaker.company}</div>}
//
//                     {/* Icônes liens */}
//                     <div className={styles.links}>
//                         {email && (
//                             <a href={`mailto:${email.url}`} className={styles.lnk} title="Email">
//                                 <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
//                             </a>
//                         )}
//                         {email && (
//                             <button className={styles.lnk} onClick={copyEmail} title={copied ? "Copié !" : "Copier l'email"}>
//                                 {copied
//                                     ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
//                                     : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
//                                 }
//                             </button>
//                         )}
//                         {phone && (
//                             <a href={`tel:${phone.url}`} className={styles.lnk} title="Téléphone">
//                                 <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.82 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.61 5.61l.9-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
//                             </a>
//                         )}
//                         {linkedin && (
//                             <a href={linkedin.url} target="_blank" rel="noreferrer" className={styles.lnk} title="LinkedIn">
//                                 <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
//                             </a>
//                         )}
//                         {twitter && (
//                             <a href={twitter.url} target="_blank" rel="noreferrer" className={styles.lnk} title="Twitter / X">
//                                 <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4l16 16M4 20 20 4"/></svg>
//                             </a>
//                         )}
//                         {others.map((link) => (
//                             <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className={styles.lnk} title={link.label}>
//                                 <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
//                             </a>
//                         ))}
//                     </div>
//                 </div>
//
//                 {/* Badge track */}
//                 <span className={`${styles.badge} ${cfg.badgeClass}`}>{cfg.label}</span>
//             </div>
//
//             {/* Bio — optionnelle */}
//             {hasBio && (
//                 <div className={styles.bioSection}>
//                     <p className={styles.bioText}>
//                         {showBio ? speaker.bio : speaker.bio.slice(0, 90) + "…"}
//                     </p>
//                     <button className={styles.bioBtn} onClick={() => setShowBio(!showBio)}>
//                         {showBio ? "Voir moins ▲" : "Voir plus ▼"}
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default SpeakerCard;

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
                            ? "Voir moins ▲"
                            : "Voir plus ▼"}
                    </button>
                </div>
            )}
        </div>
    );
}