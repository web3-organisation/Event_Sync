// src/app/api/events/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        rooms: {
          include: {
            sessions: {
              orderBy: { startTime: "asc" },
              include: {
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
        },
        sessions: {
          orderBy: { startTime: "asc" },
          include: {
            room: true,
            sessionSpeakers: {
              include: { speaker: true },
            },
            _count: { select: { questions: true } },
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Événement introuvable" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("GET /api/events/[id] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
