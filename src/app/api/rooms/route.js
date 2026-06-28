import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { preflight, withCors } from "@/lib/cors";

export function OPTIONS() {
  return preflight();
}

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { sessions: true } },
      },
    });
    return withCors(NextResponse.json(rooms));
  } catch (error) {
    console.error("GET /api/rooms error:", error);
    return withCors(NextResponse.json({ error: "Erreur serveur" }, { status: 500 }));
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return withCors(
        NextResponse.json({ error: "Le nom est requis." }, { status: 400 })
      );
    }

    const room = await prisma.room.create({
      data: { name },
      include: { _count: { select: { sessions: true } } },
    });

    return withCors(NextResponse.json(room, { status: 201 }));
  } catch (error) {
    console.error("POST /api/rooms error:", error);
    return withCors(NextResponse.json({ error: "Erreur serveur" }, { status: 500 }));
  }
}