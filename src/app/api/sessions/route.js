import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { preflight, withCors } from "@/lib/cors";

export function OPTIONS() {
  return preflight();
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const roomId = searchParams.get("roomId");

    const sessions = await prisma.session.findMany({
      where: {
        ...(eventId ? { eventId } : {}),
        ...(roomId ? { roomId } : {}),
      },
      orderBy: { startTime: "asc" },
      include: {
        room: true,
        event: { select: { id: true, title: true } },
        sessionSpeakers: {
          include: {
            speaker: { select: { id: true, fullName: true } },
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
      eventId: s.eventId,
      roomId: s.roomId,
      room: s.room?.name ?? null,
      speakers: s.sessionSpeakers.map((ss) => ss.speaker.fullName),
      speakerId: s.sessionSpeakers[0]?.speaker?.id ?? null,
    }));

    return withCors(NextResponse.json(formatted));
  } catch (error) {
    console.error("[GET /api/sessions] Error:", error);
    return withCors(
      NextResponse.json({ error: "Impossible de récupérer les sessions." }, { status: 500 })
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, startTime, endTime, eventId, roomId, speakerId, capacity } = body;

    if (!title || !startTime || !endTime || !eventId || !roomId) {
      return withCors(
        NextResponse.json(
          { error: "Le titre, l'heure de début, l'heure de fin, l'événement et la salle sont requis." },
          { status: 400 }
        )
      );
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return withCors(
        NextResponse.json({ error: "Les heures fournies ne sont pas valides." }, { status: 400 })
      );
    }

    if (start >= end) {
      return withCors(
        NextResponse.json(
          { error: "L'heure de début doit être antérieure à l'heure de fin." },
          { status: 400 }
        )
      );
    }

    const session = await prisma.session.create({
      data: {
        title,
        description: description ?? null,
        startTime: start,
        endTime: end,
        eventId,
        roomId,
        capacity: capacity ? Number(capacity) : null,
      },
    });

    if (speakerId) {
      await prisma.sessionSpeaker.create({
        data: { sessionId: session.id, speakerId },
      });
    }

    const full = await prisma.session.findUnique({
      where: { id: session.id },
      include: {
        room: true,
        sessionSpeakers: {
          include: { speaker: { select: { id: true, fullName: true } } },
        },
      },
    });

    return withCors(
      NextResponse.json(
        {
          id: full.id,
          title: full.title,
          description: full.description,
          startTime: full.startTime.toISOString(),
          endTime: full.endTime.toISOString(),
          eventId: full.eventId,
          roomId: full.roomId,
          capacity: full.capacity ?? null,
          room: full.room?.name ?? null,
          speakers: full.sessionSpeakers.map((ss) => ss.speaker.fullName),
          speakerId: full.sessionSpeakers[0]?.speaker?.id ?? null,
        },
        { status: 201 }
      )
    );
  } catch (error) {
    console.error("[POST /api/sessions] Error:", error);
    return withCors(
      NextResponse.json({ error: "Impossible de créer la session." }, { status: 500 })
    );
  }
}