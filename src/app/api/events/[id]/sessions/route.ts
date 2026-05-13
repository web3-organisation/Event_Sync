// app/api/events/[id]/sessions/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, requireAdmin } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const sessions = await prisma.session.findMany({
    where: { eventId: id },
    include: {
      room: true,
      sessionSpeakers: { include: { speaker: true } },
      _count: { select: { questions: true } },
    },
    orderBy: { startTime: "asc" },
  });
  return ok(sessions);
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return err("Non autorisé", 403);

  const { id: eventId } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return err("Body invalide");

  const { title, description, startTime, endTime, capacity, roomId, speakerIds } = body;
  if (!title || !startTime || !endTime || !roomId) {
    return err("title, startTime, endTime, roomId requis");
  }

  const session = await prisma.session.create({
    data: {
      title,
      description: description ?? null,
      startTime: new Date(startTime),
      endTime:   new Date(endTime),
      capacity:  capacity ?? null,
      eventId,
      roomId,
      adminSessions: { create: { adminId: admin.adminId } },
      sessionSpeakers: speakerIds?.length
        ? { create: speakerIds.map((sid: string) => ({ speakerId: sid })) }
        : undefined,
    },
    include: {
      room: true,
      sessionSpeakers: { include: { speaker: true } },
      _count: { select: { questions: true } },
    },
  });
  return ok(session, 201);
}
