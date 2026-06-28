// src/app/api/sessions/[id]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { preflight, withCors } from "@/lib/cors";
import { withLiveStatus } from "@/lib/session-utils";

export function OPTIONS() {
  return preflight();
}

export async function GET(_req, { params }) {
  try {
    const { id } = await params;

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        room: true,
        event: {
          select: { id: true, title: true, startDate: true, endDate: true, location: true },
        },
        sessionSpeakers: {
          include: {
            speaker: {
              select: {
                id: true,
                fullName: true,
                photoUrl: true,
                bio: true,
                speakerLinks: { select: { id: true, label: true, url: true } },
              },
            },
          },
        },
      },
    });

    if (!session) {
      return withCors(
        NextResponse.json({ error: "Session introuvable." }, { status: 404 })
      );
    }

    const { sessionSpeakers, ...rest } = session;
    const formatted = {
      ...withLiveStatus(rest),
      speakers: sessionSpeakers.map((ss) => ss.speaker),
    };

    return withCors(NextResponse.json(formatted));
  } catch (error) {
    console.error("GET /api/sessions/[id] error:", error);
    return withCors(NextResponse.json({ error: "Erreur serveur" }, { status: 500 }));
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, startTime, endTime, eventId, roomId, speakerId } = body;

    if (!title || !startTime || !endTime) {
      return withCors(
        NextResponse.json(
          { error: "Le titre, l'heure de début et l'heure de fin sont requis." },
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

    const existing = await prisma.session.findUnique({ where: { id } });
    if (!existing) {
      return withCors(NextResponse.json({ error: "Session introuvable." }, { status: 404 }));
    }

    const updated = await prisma.session.update({
      where: { id },
      data: {
        title,
        description: description ?? null,
        startTime: start,
        endTime: end,
        ...(eventId ? { eventId } : {}),
        ...(roomId ? { roomId } : {}),
      },
    });

    // Mettre à jour l'intervenant : supprimer les anciens, ajouter le nouveau
    if (speakerId !== undefined) {
      await prisma.sessionSpeaker.deleteMany({ where: { sessionId: id } });
      if (speakerId) {
        await prisma.sessionSpeaker.create({
          data: { sessionId: id, speakerId },
        });
      }
    }

    const full = await prisma.session.findUnique({
      where: { id },
      include: {
        room: true,
        sessionSpeakers: {
          include: { speaker: { select: { id: true, fullName: true } } },
        },
      },
    });

    return withCors(
      NextResponse.json({
        id: full.id,
        title: full.title,
        description: full.description,
        startTime: full.startTime.toISOString(),
        endTime: full.endTime.toISOString(),
        eventId: full.eventId,
        roomId: full.roomId,
        room: full.room?.name ?? null,
        speakers: full.sessionSpeakers.map((ss) => ss.speaker.fullName),
        speakerId: full.sessionSpeakers[0]?.speaker?.id ?? null,
      })
    );
  } catch (error) {
    console.error("PUT /api/sessions/[id] error:", error);
    return withCors(NextResponse.json({ error: "Erreur serveur" }, { status: 500 }));
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const questions = await prisma.question.findMany({
      where: { sessionId: id },
      select: { id: true },
    });
    const questionIds = questions.map((q) => q.id);

    if (questionIds.length) {
      await prisma.adminQuestion.deleteMany({ where: { questionId: { in: questionIds } } });
      await prisma.question.deleteMany({ where: { id: { in: questionIds } } });
    }

    await prisma.adminSession.deleteMany({ where: { sessionId: id } });
    await prisma.sessionSpeaker.deleteMany({ where: { sessionId: id } });
    await prisma.session.delete({ where: { id } });

    return withCors(NextResponse.json({ message: "Session supprimée avec succès." }));
  } catch (error) {
    console.error("DELETE /api/sessions/[id] error:", error);
    return withCors(
      NextResponse.json({ error: "Impossible de supprimer la session." }, { status: 500 })
    );
  }
}