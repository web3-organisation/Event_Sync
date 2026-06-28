
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { preflight, withCors } from "@/lib/cors";

export function OPTIONS() {
  return preflight();
}

export async function GET(_req, { params }) {
  try {
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        sessions: {
          orderBy: { startTime: "asc" },
          include: {
            room: true,
            sessionSpeakers: {
              include: {
                speaker: {
                  include: { speakerLinks: true },
                },
              },
            },
            _count: { select: { questions: true } },
          },
        },
      },
    });

    if (!event) {
      return withCors(
        NextResponse.json({ error: "Événement introuvable" }, { status: 404 })
      );
    }

    return withCors(NextResponse.json(event));
  } catch (error) {
    console.error("GET /api/events/[id] error:", error);
    return withCors(NextResponse.json({ error: "Erreur serveur" }, { status: 500 }));
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, startDate, endDate, location } = body;

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return withCors(
        NextResponse.json({ error: "Événement introuvable" }, { status: 404 })
      );
    }

    if (!title || !startDate || !endDate) {
      return withCors(
        NextResponse.json(
          { error: "Le titre, la date de début et la date de fin sont requis." },
          { status: 400 }
        )
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return withCors(
        NextResponse.json(
          { error: "Les dates fournies ne sont pas valides." },
          { status: 400 }
        )
      );
    }

    if (start > end) {
      return withCors(
        NextResponse.json(
          { error: "La date de début doit être antérieure à la date de fin." },
          { status: 400 }
        )
      );
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title,
        description: description ?? null,
        startDate: start,
        endDate: end,
        location: location ?? null,
      },
    });

    return withCors(NextResponse.json(updated));
  } catch (error) {
    console.error("PUT /api/events/[id] error:", error);
    return withCors(
      NextResponse.json(
        { error: "Impossible de modifier l'événement." },
        { status: 500 }
      )
    );
  }
}

export async function DELETE(_req, { params }) {
  try {
    const { id } = await params;

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return withCors(
        NextResponse.json({ error: "Événement introuvable" }, { status: 404 })
      );
    }

    await prisma.event.delete({ where: { id } });

    return withCors(
      NextResponse.json({ message: "Événement supprimé avec succès." })
    );
  } catch (error) {
    console.error("DELETE /api/events/[id] error:", error);
    return withCors(
      NextResponse.json(
        { error: "Impossible de supprimer l'événement." },
        { status: 500 }
      )
    );
  }
}