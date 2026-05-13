// app/api/sessions/[id]/questions/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const questions = await prisma.question.findMany({
    where: { sessionId: id },
    orderBy: { upvotes: "desc" },
  });
  return ok(questions);
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const { id: sessionId } = await params;
  const body = await req.json().catch(() => null);
  if (!body?.content) return err("content requis");

  const question = await prisma.question.create({
    data: {
      content:    body.content,
      authorName: body.authorName ?? null,
      sessionId,
    },
  });
  return ok(question, 201);
}
