// app/api/questions/[id]/upvote/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  try {
    const q = await prisma.question.update({
      where: { id },
      data: { upvotes: { increment: 1 } },
    });
    return ok(q);
  } catch {
    return err("Question introuvable", 404);
  }
}
