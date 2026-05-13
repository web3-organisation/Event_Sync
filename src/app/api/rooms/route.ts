// app/api/rooms/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, requireAdmin } from "@/lib/api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  const rooms = await prisma.room.findMany({
    where: eventId ? { eventId } : undefined,
    include: { _count: { select: { sessions: true } } },
    orderBy: { name: "asc" },
  });
  return ok(rooms);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return err("Non autorisé", 403);

  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.eventId) return err("name et eventId requis");

  const room = await prisma.room.create({
    data: {
      name:    body.name,
      eventId: body.eventId,
      adminRooms: { create: { adminId: admin.adminId } },
    },
  });
  return ok(room, 201);
}
