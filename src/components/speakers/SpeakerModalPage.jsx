"use client";

import { useRouter } from "next/navigation";
import { SpeakerModal } from "./SpeakerCard";

const TRACK_CONFIG = {
    ai: { label: "IA",     cardClass: "cardAi", avClass: "avAi", badgeClass: "badgeAi" },
    cy: { label: "Cyber",  cardClass: "cardCy", avClass: "avCy", badgeClass: "badgeCy" },
    cl: { label: "Cloud",  cardClass: "cardCl", avClass: "avCl", badgeClass: "badgeCl" },
    ds: { label: "Design", cardClass: "cardDs", avClass: "avDs", badgeClass: "badgeDs" },
};

export default function SpeakerModalPage({ speaker }) {
    const router = useRouter();
    const cfg = TRACK_CONFIG[speaker.track] ?? TRACK_CONFIG.ai;

    // ── Harmonisation : speakerLinks (Prisma) → links (attendu par SpeakerModal) ──
    const normalizedSpeaker = {
        ...speaker,
        links: speaker.speakerLinks ?? [],
    };

    const handleClose = () => {
        router.back();
    };

    return (
        <SpeakerModal
            speaker={normalizedSpeaker}
            cfg={cfg}
            onClose={handleClose}
        />
    );
}