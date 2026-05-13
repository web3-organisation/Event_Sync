// app/api/events/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, requireAdmin } from "@/lib/api";

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: "asc" },
    include: {
      rooms: true,
      _count: { select: { sessions: true } },
    },
  });
  return ok(events);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return err("Non autorisé", 403);

  const body = await req.json().catch(() => null);
  if (!body) return err("Body invalide");

  const { title, description, startDate, endDate, location } = body;
  if (!title || !startDate || !endDate) return err("title, startDate, endDate requis");

  const event = await prisma.event.create({
    data: {
      title,
      description: description ?? null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location: location ?? null,
      adminEvents: { create: { adminId: admin.adminId } },
    },
    include: { rooms: true, _count: { select: { sessions: true } } },
  });
  return ok(event, 201);
}
