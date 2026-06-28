import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { preflight, withCors } from "@/lib/cors";

export function OPTIONS() {
  return preflight();
}

export async function GET(_req, { params }) {
  try {
    const { id } = await params;
    const room = await prisma.room.findUnique({
      where: { id },
      include: { _count: { select: { sessions: true } } },
    });
    if (!room) {
      return withCors(NextResponse.json({ error: "Salle introuvable." }, { status: 404 }));
    }
    return withCors(NextResponse.json(room));
  } catch (error) {
    console.error("GET /api/rooms/[id] error:", error);
    return withCors(NextResponse.json({ error: "Erreur serveur" }, { status: 500 }));
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { name } = await request.json();

    if (!name) {
      return withCors(NextResponse.json({ error: "Le nom est requis." }, { status: 400 }));
    }

    const existing = await prisma.room.findUnique({ where: { id } });
    if (!existing) {
      return withCors(NextResponse.json({ error: "Salle introuvable." }, { status: 404 }));
    }

    const updated = await prisma.room.update({
      where: { id },
      data: { name },
      include: { _count: { select: { sessions: true } } },
    });

    return withCors(NextResponse.json(updated));
  } catch (error) {
    console.error("PUT /api/rooms/[id] error:", error);
    return withCors(NextResponse.json({ error: "Erreur serveur" }, { status: 500 }));
  }
}

export async function DELETE(_req, { params }) {
  try {
    const { id } = await params;
    const existing = await prisma.room.findUnique({
      where: { id },
      include: { _count: { select: { sessions: true } } },
    });
    if (!existing) {
      return withCors(NextResponse.json({ error: "Salle introuvable." }, { status: 404 }));
    }
    if (existing._count.sessions > 0) {
      return withCors(
        NextResponse.json(
          { error: "Impossible de supprimer une salle contenant des sessions." },
          { status: 409 }
        )
      );
    }
    await prisma.room.delete({ where: { id } });
    return withCors(NextResponse.json({ message: "Salle supprimée avec succès." }));
  } catch (error) {
    console.error("DELETE /api/rooms/[id] error:", error);
    return withCors(NextResponse.json({ error: "Erreur serveur" }, { status: 500 }));
  }
}