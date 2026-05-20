import prisma from "@/lib/prisma";

/**
 * GET /api/sessions
 * Returns all sessions with their room name and speakers from the database.
 */
export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: { startTime: "asc" },
      include: {
        room: true, // includes room.name
        sessionSpeakers: {
          include: {
            speaker: {
              select: { fullName: true },
            },
          },
        },
      },
    });

    // Transform to a flat shape that the frontend expects
    const formatted = sessions.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description ?? null,
      startTime: s.startTime.toISOString(),
      endTime: s.endTime.toISOString(),
      room: s.room.name,
      speakers: s.sessionSpeakers.map((ss) => ss.speaker.fullName),
    }));

    return Response.json(formatted);
  } catch (error) {
    console.error("[GET /api/sessions] Error:", error);
    return Response.json(
      { error: "Impossible de récupérer les sessions." },
      { status: 500 }
    );
  }
}
