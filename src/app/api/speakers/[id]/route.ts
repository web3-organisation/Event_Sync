// app/api/speakers/[id]/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, requireAdmin } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const speaker = await prisma.speaker.findUnique({
    where: { id },
    include: {
      speakerLinks: true,
      sessionSpeakers: { include: { session: { include: { event: true, room: true } } } },
    },
  });
  if (!speaker) return err("Speaker introuvable", 404);
  return ok(speaker);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return err("Non autorisé", 403);

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return err("Body invalide");

  if (body.links !== undefined) {
    await prisma.speakerLink.deleteMany({ where: { speakerId: id } });
  }

  const speaker = await prisma.speaker.update({
    where: { id },
    data: {
      ...(body.fullName !== undefined && { fullName: body.fullName }),
      ...(body.bio      !== undefined && { bio:      body.bio      }),
      ...(body.photoUrl !== undefined && { photoUrl: body.photoUrl }),
      ...(body.links?.length && {
        speakerLinks: { create: body.links.map((l: { label: string; url: string }) => ({ label: l.label, url: l.url })) },
      }),
    },
    include: { speakerLinks: true },
  });
  return ok(speaker);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return err("Non autorisé", 403);

  const { id } = await params;
  await prisma.speaker.delete({ where: { id } });
  return ok({ deleted: true });
}
