//
// "use client";
//
// import {useEffect, useState} from "react";
// import { createPortal } from "react-dom";
// import styles from "./SpeakerCard.module.css";
// import Reveal from "../ui/Reveal";
//
// const TRACK_CONFIG = {
//     ai: { label: "IA",     cardClass: styles.cardAi, avClass: styles.avAi, badgeClass: styles.badgeAi },
//     cy: { label: "Cyber",  cardClass: styles.cardCy, avClass: styles.avCy, badgeClass: styles.badgeCy },
//     cl: { label: "Cloud",  cardClass: styles.cardCl, avClass: styles.avCl, badgeClass: styles.badgeCl },
//     ds: { label: "Design", cardClass: styles.cardDs, avClass: styles.avDs, badgeClass: styles.badgeDs },
// };
//
// function getInitials(name = "") {
//     return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
// }
//
// function highlight(text = "", searchQuery = "") {
//     if (!searchQuery.trim()) return text;
//     const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
//     return text.split(regex).map((part, i) =>
//         regex.test(part) ? <mark key={i} className={styles.highlight}>{part}</mark> : part
//     );
// }
//
// /* ── Modale ── */
// export function SpeakerModal({ speaker, cfg, onClose }) {
//     const [mounted, setMounted] = useState(false);
//
//     useEffect(() => {
//         setMounted(true);
//     }, []);
//
//     const linkedin = speaker.links?.find((l) => l.label.toLowerCase() === "linkedin");
//     const twitter = speaker.links?.find((l) => l.label.toLowerCase() === "twitter");
//     const email = speaker.links?.find((l) => l.label.toLowerCase() === "email");
//     const phone = speaker.links?.find((l) => l.label.toLowerCase() === "phone");
//
//     return createPortal(
//         <div className={styles.overlay} onClick={onClose}>
//             <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
//
//                 {/* Bouton fermer */}
//                 <button className={styles.closeBtn} onClick={onClose} aria-label="Fermer">✕</button>
//
//                 {/* ── Header : avatar + nom + contacts ── */}
//                 <div className={styles.modalHeader}>
//                     <div className={`${styles.modalAv} ${cfg.avClass}`}>
//                         {speaker.photoUrl ? (
//                             <img src={speaker.photoUrl} alt={speaker.fullName} className={styles.avatarImg} />
//                         ) : (
//                             getInitials(speaker.fullName)
//                         )}
//                     </div>
//
//                     <div className={styles.modalMeta}>
//                         <div className={styles.modalMetaLeft}>
//                             <h2 className={styles.modalName}>{speaker.fullName}</h2>
//                             {speaker.role && <p className={styles.modalRole}>{speaker.role}</p>}
//                             {speaker.company && <p className={styles.modalCompany}>{speaker.company}</p>}
//                             <div className={styles.modalBadges}>
//                                 <span className={`${styles.badge} ${cfg.badgeClass}`}>{cfg.label}</span>
//                                 {speaker.skills?.map((s) => (
//                                     <span key={s} className={styles.skillBadge}>{s}</span>
//                                 ))}
//                             </div>
//                         </div>
//
//                         <div className={styles.modalContacts}>
//                             {email && (
//                                 <a href={`mailto:${email.url}`} className={styles.contactBtn}>
//                                     <span className={styles.contactIcon}>✉</span>Email
//                                 </a>
//                             )}
//                             {phone && (
//                                 <a href={`tel:${phone.url}`} className={styles.contactBtn}>
//                                     <span className={styles.contactIcon}>☎</span>Téléphone
//                                 </a>
//                             )}
//                             {linkedin && (
//                                 <a href={linkedin.url} target="_blank" rel="noreferrer" className={styles.contactBtn}>
//                                     <span className={styles.contactIcon}>in</span>LinkedIn
//                                 </a>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* ── Bio ── */}
//                 {speaker.bio && (
//                     <>
//                         <div className={styles.modalDivider} />
//                         <div className={styles.modalSection}>
//                             <p className={styles.sectionLabel}>À propos</p>
//                             <p className={styles.bioText}>{speaker.bio}</p>
//                         </div>
//                     </>
//                 )}
//
//                 {/* ── Expériences ── */}
//                 {speaker.experiences?.length > 0 && (
//                     <>
//                         <div className={styles.modalDivider} />
//                         <div className={styles.modalSection}>
//                             <p className={styles.sectionLabel}>Expériences</p>
//                             <div className={styles.timeline}>
//                                 {speaker.experiences.map((exp, i) => (
//                                     <div key={i} className={styles.timelineItem}>
//                                         <div className={styles.timelineLeft}>
//                                             <div className={`${styles.timelineDot} ${i === 0 ? styles.timelineDotActive : ""}`} />
//                                             {i < speaker.experiences.length - 1 && <div className={styles.timelineLine} />}
//                                         </div>
//                                         <div>
//                                             <p className={styles.expTitle}>{exp.title}</p>
//                                             <p className={styles.expSub}>{exp.company} · {exp.period}</p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </>
//                 )}
//
//                 {/* ── Formation ── */}
//                 {speaker.education?.length > 0 && (
//                     <>
//                         <div className={styles.modalDivider} />
//                         <div className={styles.modalSection}>
//                             <p className={styles.sectionLabel}>Formation</p>
//                             <div className={styles.eduList}>
//                                 {speaker.education.map((edu, i) => (
//                                     <div key={i} className={styles.eduItem}>
//                                         <div className={styles.eduIcon}>🎓</div>
//                                         <div>
//                                             <p className={styles.expTitle}>{edu.degree}</p>
//                                             <p className={styles.expSub}>{edu.school} · {edu.period}</p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </>
//                 )}
//
//             </div>
//         </div>,
//         document.body
//     );
// }
//
// /* ── Card ── */
// export default function SpeakerCard({ speaker, searchQuery = "" }) {
//     const [showModal, setShowModal] = useState(false);
//     const cfg = TRACK_CONFIG[speaker.track] ?? TRACK_CONFIG.ai;
//
//     const linkedin = speaker.links?.find((l) => l.label.toLowerCase() === "linkedin");
//     const email    = speaker.links?.find((l) => l.label.toLowerCase() === "email");
//     const phone    = speaker.links?.find((l) => l.label.toLowerCase() === "phone");
//
//     return (
//         <>
//             <div className={`${styles.card} ${cfg.cardClass}`} onClick={() => setShowModal(true)} style={{ cursor: "pointer" }}>
//                 <div className={styles.topRow}>
//                     <div className={`${styles.av} ${cfg.avClass}`}>
//                         {getInitials(speaker.fullName)}
//                     </div>
//
//                     <div className={styles.info}>
//                         <div className={styles.spName}>{highlight(speaker.fullName, searchQuery)}</div>
//                         {speaker.role    && <div className={styles.spRole}>{speaker.role}</div>}
//                         {speaker.company && <div className={styles.spCo}>{speaker.company}</div>}
//                         <div className={styles.links}>
//                             {email    && <a href={`mailto:${email.url}`}   className={styles.lnk} onClick={(e) => e.stopPropagation()}>✉</a>}
//                             {phone    && <a href={`tel:${phone.url}`}      className={styles.lnk} onClick={(e) => e.stopPropagation()}>☎</a>}
//                             {linkedin && <a href={linkedin.url} target="_blank" rel="noreferrer" className={styles.lnk} onClick={(e) => e.stopPropagation()}>in</a>}
//                         </div>
//                     </div>
//
//                     <span className={`${styles.badge} ${cfg.badgeClass}`}>{cfg.label}</span>
//                 </div>
//
//                 {speaker.bio && (
//                     <div className={styles.bioSection}>
//                         <p className={styles.bioText}>{`${speaker.bio.slice(0, 120)}...`}</p>
//                     </div>
//                 )}
//             </div>
//
//             {showModal && (
//                 <SpeakerModal speaker={speaker} cfg={cfg} onClose={() => setShowModal(false)} />
//             )}
//
//         </>
//
//     );
// }
//


"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./SpeakerCard.module.css";

const TRACK_CONFIG = {
    ai: { label: "IA",     cardClass: styles.cardAi, avClass: styles.avAi, badgeClass: styles.badgeAi },
    cy: { label: "Cyber",  cardClass: styles.cardCy, avClass: styles.avCy, badgeClass: styles.badgeCy },
    cl: { label: "Cloud",  cardClass: styles.cardCl, avClass: styles.avCl, badgeClass: styles.badgeCl },
    ds: { label: "Design", cardClass: styles.cardDs, avClass: styles.avDs, badgeClass: styles.badgeDs },
};

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

/* ── Modale ── */
export function SpeakerModal({ speaker, cfg, onClose }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Suppression de la règle pour le SSR : c'est un cas valide d'initialisation d'état au montage
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!speaker) return null;
    if (!mounted) return null; // ← empêche document.body de planter en SSR

    const linkedin = speaker.links?.find((l) => l.label.toLowerCase() === "linkedin");
    const email    = speaker.links?.find((l) => l.label.toLowerCase() === "email");
    const phone    = speaker.links?.find((l) => l.label.toLowerCase() === "phone");

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

                <button className={styles.closeBtn} onClick={onClose} aria-label="Fermer">✕</button>

                <div className={styles.modalHeader}>
                    <div className={`${styles.modalAv} ${cfg.avClass}`}>
                        {speaker.photoUrl ? (
                            <Image src={speaker.photoUrl} alt={speaker.fullName} className={styles.avatarImg} width={80} height={80} />
                        ) : (
                            getInitials(speaker.fullName)
                        )}
                    </div>

                    <div className={styles.modalMeta}>
                        <div className={styles.modalMetaLeft}>
                            <h2 className={styles.modalName}>{speaker.fullName}</h2>
                            {speaker.role && <p className={styles.modalRole}>{speaker.role}</p>}
                            {speaker.company && <p className={styles.modalCompany}>{speaker.company}</p>}
                            <div className={styles.modalBadges}>
                                <span className={`${styles.badge} ${cfg.badgeClass}`}>{cfg.label}</span>
                                {speaker.skills?.map((s) => (
                                    <span key={s} className={styles.skillBadge}>{s}</span>
                                ))}
                            </div>
                        </div>

                        <div className={styles.modalContacts}>
                            {email && (
                                <a href={`mailto:${email.url}`} className={styles.contactBtn}>
                                    <span className={styles.contactIcon}>✉</span>Email
                                </a>
                            )}
                            {phone && (
                                <a href={`tel:${phone.url}`} className={styles.contactBtn}>
                                    <span className={styles.contactIcon}>☎</span>Téléphone
                                </a>
                            )}
                            {linkedin && (
                                <a href={linkedin.url} target="_blank" rel="noreferrer" className={styles.contactBtn}>
                                    <span className={styles.contactIcon}>in</span>LinkedIn
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {speaker.bio && (
                    <>
                        <div className={styles.modalDivider} />
                        <div className={styles.modalSection}>
                            <p className={styles.sectionLabel}>À propos</p>
                            <p className={styles.bioText}>{speaker.bio}</p>
                        </div>
                    </>
                )}

                {speaker.experiences?.length > 0 && (
                    <>
                        <div className={styles.modalDivider} />
                        <div className={styles.modalSection}>
                            <p className={styles.sectionLabel}>Expériences</p>
                            <div className={styles.timeline}>
                                {speaker.experiences.map((exp, i) => (
                                    <div key={i} className={styles.timelineItem}>
                                        <div className={styles.timelineLeft}>
                                            <div className={`${styles.timelineDot} ${i === 0 ? styles.timelineDotActive : ""}`} />
                                            {i < speaker.experiences.length - 1 && <div className={styles.timelineLine} />}
                                        </div>
                                        <div>
                                            <p className={styles.expTitle}>{exp.title}</p>
                                            <p className={styles.expSub}>{exp.company} · {exp.period}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {speaker.education?.length > 0 && (
                    <>
                        <div className={styles.modalDivider} />
                        <div className={styles.modalSection}>
                            <p className={styles.sectionLabel}>Formation</p>
                            <div className={styles.eduList}>
                                {speaker.education.map((edu, i) => (
                                    <div key={i} className={styles.eduItem}>
                                        <div className={styles.eduIcon}>🎓</div>
                                        <div>
                                            <p className={styles.expTitle}>{edu.degree}</p>
                                            <p className={styles.expSub}>{edu.school} · {edu.period}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>,
        document.body
    );
}

/* ── Card ── */
export default function SpeakerCard({ speaker, searchQuery = "", onModalClose }) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const cfg = TRACK_CONFIG[speaker.track] ?? TRACK_CONFIG.ai;

    const linkedin = speaker.links?.find((l) => l.label.toLowerCase() === "linkedin");
    const email    = speaker.links?.find((l) => l.label.toLowerCase() === "email");
    const phone    = speaker.links?.find((l) => l.label.toLowerCase() === "phone");

    const handleOpen = () => {
        setShowModal(true);
        // Met à jour l'URL sans recharger la page (navigation superficielle)
        window.history.pushState(null, "", `/speakers/${speaker.id}`);
    };

    const handleClose = () => {
        setShowModal(false);
        // Revient à l'URL précédente
        window.history.pushState(null, "", "/speakers");
        if (onModalClose) onModalClose();
    };

    return (
        <>
            <div
                className={`${styles.card} ${cfg.cardClass}`}
                onClick={handleOpen}
                style={{ cursor: "pointer" }}
            >
                <div className={styles.topRow}>
                    <div className={`${styles.av} ${cfg.avClass}`}>
                        {getInitials(speaker.fullName)}
                    </div>

                    <div className={styles.info}>
                        <div className={styles.spName}>{highlight(speaker.fullName, searchQuery)}</div>
                        {speaker.role    && <div className={styles.spRole}>{speaker.role}</div>}
                        {speaker.company && <div className={styles.spCo}>{speaker.company}</div>}
                        <div className={styles.links}>
                            {email    && <a href={`mailto:${email.url}`}   className={styles.lnk} onClick={(e) => e.stopPropagation()}>✉</a>}
                            {phone    && <a href={`tel:${phone.url}`}      className={styles.lnk} onClick={(e) => e.stopPropagation()}>☎</a>}
                            {linkedin && <a href={linkedin.url} target="_blank" rel="noreferrer" className={styles.lnk} onClick={(e) => e.stopPropagation()}>in</a>}
                        </div>
                    </div>

                    <span className={`${styles.badge} ${cfg.badgeClass}`}>{cfg.label}</span>
                </div>

                {speaker.bio && (
                    <div className={styles.bioSection}>
                        <p className={styles.bioText}>{`${speaker.bio.slice(0, 120)}...`}</p>
                    </div>
                )}
            </div>

            {showModal && (
                <SpeakerModal speaker={speaker} cfg={cfg} onClose={handleClose} />
            )}
        </>
    );
}