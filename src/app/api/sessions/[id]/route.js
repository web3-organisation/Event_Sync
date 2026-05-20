import prisma from "@/lib/prisma";

/**
 * GET /api/sessions/[id]
 * Returns a single session with its room, speakers, event, and questions.
 */
export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        room: true,
        event: {
          select: { id: true, title: true, location: true, startDate: true, endDate: true },
        },
        sessionSpeakers: {
          include: {
            speaker: {
              select: {
                id: true,
                fullName: true,
                bio: true,
                photoUrl: true,
                speakerLinks: { select: { label: true, url: true } },
              },
            },
          },
        },
        questions: {
          orderBy: { upvotes: "desc" },
          select: {
            id: true,
            content: true,
            authorName: true,
            upvotes: true,
            createdAt: true,
          },
        },
      },
    });

    if (!session) {
      return Response.json({ error: "Session introuvable." }, { status: 404 });
    }

    const formatted = {
      id: session.id,
      title: session.title,
      description: session.description ?? null,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      capacity: session.capacity ?? null,
      room: session.room.name,
      event: session.event,
      speakers: session.sessionSpeakers.map((ss) => ss.speaker),
      questions: session.questions.map((q) => ({
        ...q,
        createdAt: q.createdAt.toISOString(),
      })),
    };

    return Response.json(formatted);
  } catch (error) {
    console.error(`[GET /api/sessions/${id}] Error:`, error);
    return Response.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
