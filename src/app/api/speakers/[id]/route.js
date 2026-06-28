import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { preflight, withCors } from "@/lib/cors";

export function OPTIONS() {
  return preflight();
}

export async function GET(_req, { params }) {
  try {
    const { id } = await params;
    const speaker = await prisma.speaker.findUnique({
      where: { id },
      include: { speakerLinks: true },
    });
    if (!speaker) {
      return withCors(NextResponse.json({ error: "Not found" }, { status: 404 }));
    }
    return withCors(NextResponse.json(speaker));
  } catch (error) {
    console.error("GET /api/speakers/[id] error:", error);
    return withCors(NextResponse.json({ error: "Erreur serveur" }, { status: 500 }));
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const speaker = await prisma.speaker.update({
      where: { id },
      data: {
        fullName: body.fullName,
        photoUrl: body.photoUrl || null,
        bio: body.bio || null,
      },
    });
    return withCors(NextResponse.json(speaker));
  } catch (error) {
    console.error("PUT /api/speakers/[id] error:", error);
    return withCors(NextResponse.json({ error: "Erreur serveur" }, { status: 500 }));
  }
}

export async function DELETE(_req, { params }) {
  try {
    const { id } = await params;
    await prisma.speaker.delete({ where: { id } });
    return withCors(NextResponse.json({ id }));
  } catch (error) {
    console.error("DELETE /api/speakers/[id] error:", error);
    return withCors(NextResponse.json({ error: "Erreur serveur" }, { status: 500 }));
  }
}