import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { isSessionLive } from "../../../../lib/session-utils";

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
      { error: "Question not found." },
      { status: 404 }
    );
  }

  if (!isSessionLive(question.session.startTime, question.session.endTime)) {
    return NextResponse.json(
      { error: "Upvotes are only possible during a live session." },
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
