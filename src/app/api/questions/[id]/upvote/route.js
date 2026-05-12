import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isSessionLive } from "@/app/lib/session-utils";

export async function POST(_req, { params }) {
  const { id: questionId } = params;

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      session: {
        select: { startTime: true, endTime: true },
      },
    },
  });

  if (!question) {
    return NextResponse.json(
      { error: "Question introuvable." },
      { status: 404 }
    );
  }

  if (!isSessionLive(question.session.startTime, question.session.endTime)) {
    return NextResponse.json(
      {
        error:
          "Les upvotes ne sont possibles que pendant une session en cours (LIVE).",
      },
      { status: 403 }
    );
  }

  const updated = await prisma.question.update({
    where: { id: questionId },
    data: { upvotes: { increment: 1 } },
    select: { id: true, upvotes: true },
  });

  return NextResponse.json(updated);
}