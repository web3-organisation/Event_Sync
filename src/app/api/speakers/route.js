import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { preflight, withCors } from "@/lib/cors";

export function OPTIONS() {
  return preflight();
}

export async function GET() {
  try {
    const speakers = await prisma.speaker.findMany({
      include: { speakerLinks: true },
      orderBy: { createdAt: "desc" },
    });
    return withCors(NextResponse.json(speakers));
  } catch (error) {
    console.error("GET /api/speakers error:", error);
    return withCors(NextResponse.json({ error: "Erreur serveur" }, { status: 500 }));
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const speaker = await prisma.speaker.create({
      data: {
        fullName: body.fullName,
        photoUrl: body.photoUrl || null,
        bio: body.bio || null,
      },
    });
    return withCors(NextResponse.json(speaker, { status: 201 }));
  } catch (error) {
    console.error("POST /api/speakers error:", error);
    return withCors(NextResponse.json({ error: "Erreur serveur" }, { status: 500 }));
  }
}