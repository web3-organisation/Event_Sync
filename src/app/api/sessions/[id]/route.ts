// app/api/sessions/[id]/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, requireAdmin } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const session = await prisma.session.findUnique({
    where: { id },
    include: {
      room: true,
      event: true,
      sessionSpeakers: { include: { speaker: { include: { speakerLinks: true } } } },
      questions: { orderBy: { upvotes: "desc" } },
    },
  });
  if (!session) return err("Session introuvable", 404);
  return ok(session);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return err("Non autorisé", 403);

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return err("Body invalide");

  const { title, description, startTime, endTime, capacity, roomId, speakerIds } = body;

  // Mise à jour speakers : on supprime et recrée
  if (speakerIds !== undefined) {
    await prisma.sessionSpeaker.deleteMany({ where: { sessionId: id } });
  }

  const session = await prisma.session.update({
    where: { id },
    data: {
      ...(title       && { title }),
      ...(description !== undefined && { description }),
      ...(startTime   && { startTime: new Date(startTime) }),
      ...(endTime     && { endTime:   new Date(endTime)   }),
      ...(capacity    !== undefined && { capacity }),
      ...(roomId      && { roomId }),
      ...(speakerIds  && {
        sessionSpeakers: {
          create: speakerIds.map((sid: string) => ({ speakerId: sid })),
        },
      }),
    },
    include: {
      room: true,
      sessionSpeakers: { include: { speaker: true } },
      _count: { select: { questions: true } },
    },
  });
  return ok(session);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return err("Non autorisé", 403);

  const { id } = await params;
  await prisma.session.delete({ where: { id } });
  return ok({ deleted: true });
}
