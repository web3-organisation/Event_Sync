import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { preflight, withCors } from "@/lib/cors";

export function OPTIONS() {
  return preflight();
}

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startDate: "asc" },
      include: { _count: { select: { sessions: true } } },
    });
    return withCors(NextResponse.json(events));
  } catch (error) {
    console.error("GET /api/events error:", error);
    return withCors(NextResponse.json({ error: "Erreur serveur" }, { status: 500 }));
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, startDate, endDate, location } = body;

    if (!title || !startDate || !endDate) {
      return withCors(NextResponse.json(
        { error: "Le titre, la date de début et la date de fin sont requis." },
        { status: 400 }
      ));
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return withCors(NextResponse.json(
        { error: "Les dates fournies ne sont pas valides." },
        { status: 400 }
      ));
    }

    if (start > end) {
      return withCors(NextResponse.json(
        { error: "La date de début doit être antérieure à la date de fin." },
        { status: 400 }
      ));
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description: description || null,
        startDate: start,
        endDate: end,
        location: location || null,
      },
    });

    return withCors(NextResponse.json(newEvent, { status: 201 }));
  } catch (error) {
    console.error("[POST /api/events] Error:", error);
    return withCors(NextResponse.json(
      { error: "Impossible de créer l'événement." },
      { status: 500 }
    ));
  }
}