//src/app/api/sessions/route.js
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: { startTime: "asc" },
      include: {
        room: true,
        sessionSpeakers: {
          include: {
            speaker: {
              select: { fullName: true },
            },
          },
        },
      },
    });

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

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, startTime, endTime, roomName, eventId, speakers } = body;

    if (!title || !startTime || !endTime || !roomName || !eventId) {
      return Response.json(
        { error: "Le titre, l'heure de début, l'heure de fin, la salle et l'événement sont requis." },
        { status: 400 }
      );
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return Response.json(
        { error: "Les heures fournies ne sont pas valides." },
        { status: 400 }
      );
    }

    if (start > end) {
      return Response.json(
        { error: "L'heure de début doit être antérieure à l'heure de fin." },
        { status: 400 }
      );
    }

    let room = await prisma.room.findFirst({
      where: {
        name: roomName,
        eventId: eventId,
      },
    });

    if (!room) {
      room = await prisma.room.create({
        data: {
          name: roomName,
          eventId: eventId,
        },
      });
    }

    const session = await prisma.session.create({
      data: {
        title,
        description: description || null,
        startTime: start,
        endTime: end,
        eventId,
        roomId: room.id,
      },
    });

    if (speakers && speakers.trim()) {
      const names = speakers.split(",").map((name) => name.trim()).filter(Boolean);
      for (const name of names) {
        let speaker = await prisma.speaker.findFirst({
          where: { fullName: name },
        });

        if (!speaker) {
          speaker = await prisma.speaker.create({
            data: { fullName: name },
          });
        }

        await prisma.sessionSpeaker.create({
          data: {
            sessionId: session.id,
            speakerId: speaker.id,
          },
        });
      }
    }

    return Response.json(session, { status: 201 });
  } catch (error) {
    console.error("[POST /api/sessions] Error:", error);
    return Response.json(
      { error: "Impossible de créer la session." },
      { status: 500 }
    );
  }
}
