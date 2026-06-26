// src/app/speakers/page.jsx
import prisma from "@/lib/prisma";
import SpeakerList from "@/components/speakers/SpeakerList";

export const metadata = {
    title: "Speakers | Event Sync",
    description: "Tous les intervenants",
};

export default async function SpeakersPage() {
    const speakers = await prisma.speaker.findMany({
        include: { speakerLinks: true },
        orderBy: { fullName: "asc" },
    });

    const formattedSpeakers = speakers.map((s) => ({
        id: s.id,
        fullName: s.fullName,
        photoUrl: s.photoUrl,
        bio: s.bio,
        links: s.speakerLinks || [],
    }));

    return <SpeakerList speakers={formattedSpeakers} />;
}