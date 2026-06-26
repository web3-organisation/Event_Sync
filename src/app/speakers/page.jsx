import prisma from "@/lib/prisma";
import SpeakerList from "@/components/speakers/SpeakerList";

export const metadata = {
    title: "Speakers | Event Sync",
    description: "Tous les intervenants groupés par session",
};

export default async function SpeakersPage() {
    const sessions = await prisma.session.findMany({
        include: {
            sessionSpeakers: {
                include: {
                    speaker: {
                        include: {
                            speakerLinks: true,
                        },
                    },
                },
            },
            room: true,
            event: true,
        },
        orderBy: {
            startTime: "asc",
        },
    });

    const formattedSessions = sessions.map((session) => ({
        id: session.id,
        title: session.title,
        description: session.description,
        startTime: session.startTime.toISOString(),
        endTime: session.endTime.toISOString(),
        room: session.room?.name || "Non défini",
        event: session.event?.title || "",
        speakers: session.sessionSpeakers.map((ss) => ({
            id: ss.speaker.id,
            fullName: ss.speaker.fullName,
            photoUrl: ss.speaker.photoUrl,
            bio: ss.speaker.bio,
            links: ss.speaker.speakerLinks || [],
        })),
    }));

    return <SpeakerList sessions={formattedSessions} />;
}