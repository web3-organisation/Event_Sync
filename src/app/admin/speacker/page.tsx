// app/admin/speakers/page.tsx — Server Component
import { prisma } from "@/lib/prisma";
import SpeakersClient from "./SpeakersClient";

export const dynamic = "force-dynamic";

export default async function AdminSpeakersPage() {
  const speakers = await prisma.speaker.findMany({
    include: { speakerLinks: true, _count: { select: { sessionSpeakers: true } } },
    orderBy: { fullName: "asc" },
  });
  return <SpeakersClient speakers={speakers as any} />;
}
