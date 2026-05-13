// app/api/speakers/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, requireAdmin } from "@/lib/api";

export async function GET() {
  const speakers = await prisma.speaker.findMany({
    include: { speakerLinks: true, _count: { select: { sessionSpeakers: true } } },
    orderBy: { fullName: "asc" },
  });
  return ok(speakers);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return err("Non autorisé", 403);

  const body = await req.json().catch(() => null);
  if (!body?.fullName) return err("fullName requis");

  const speaker = await prisma.speaker.create({
    data: {
      fullName: body.fullName,
      bio:      body.bio ?? null,
      photoUrl: body.photoUrl ?? null,
      adminSpeakers: { create: { adminId: admin.adminId } },
      speakerLinks: body.links?.length
        ? { create: body.links.map((l: { label: string; url: string }) => ({ label: l.label, url: l.url })) }
        : undefined,
    },
    include: { speakerLinks: true },
  });
  return ok(speaker, 201);
}
