// app/api/events/[id]/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, requireAdmin } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      rooms: true,
      sessions: {
        include: {
          room: true,
          sessionSpeakers: { include: { speaker: true } },
          _count: { select: { questions: true } },
        },
        orderBy: { startTime: "asc" },
      },
    },
  });
  if (!event) return err("Événement introuvable", 404);
  return ok(event);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return err("Non autorisé", 403);

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return err("Body invalide");

  const { title, description, startDate, endDate, location } = body;

  const event = await prisma.event.update({
    where: { id },
    data: {
      ...(title       && { title }),
      ...(description !== undefined && { description }),
      ...(startDate   && { startDate: new Date(startDate) }),
      ...(endDate     && { endDate:   new Date(endDate)   }),
      ...(location    !== undefined && { location }),
    },
    include: { rooms: true, _count: { select: { sessions: true } } },
  });
  return ok(event);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return err("Non autorisé", 403);

  const { id } = await params;
  await prisma.event.delete({ where: { id } });
  return ok({ deleted: true });
}
