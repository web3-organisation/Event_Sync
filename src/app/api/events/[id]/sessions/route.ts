// src/app/api/events/[id]/sessions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const sessions = await prisma.session.findMany({
      where: { eventId: id },
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
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("GET /api/events/[id]/sessions error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
