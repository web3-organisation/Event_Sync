import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import SpeakerModalPage from "@/components/speakers/SpeakerModalPage";

export default async function SpeakerPage({ params }) {
    const { id } = await params;

    const speaker = await prisma.speaker.findUnique({
        where: { id },
        include: { speakerLinks: true },
    });

    if (!speaker) {
        notFound();
    }

    return <SpeakerModalPage speaker={speaker} />;
}