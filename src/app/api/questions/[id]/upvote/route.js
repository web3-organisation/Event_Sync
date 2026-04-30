// app/api/questions/[id]/upvote/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isSessionLive } from "@/lib/session-utils";

export async function POST(_req, { params }) {
  const { id: questionId } = params;

  // Récupérer la question (@@map("questions")) avec sa session pour vérifier le LIVE
  // On inclut session.startTime / session.endTime via la relation Question → Session
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

  // Upvote autorisé uniquement pendant la session LIVE
  if (!isSessionLive(question.session.startTime, question.session.endTime)) {
    return NextResponse.json(
      {
        error:
          "Les upvotes ne sont possibles que pendant une session en cours (LIVE).",
      },
      { status: 403 }
    );
  }

  // Incrément atomique du compteur (spec §4.5 — non limité dans cette version)
  const updated = await prisma.question.update({
    where: { id: questionId },
    data: { upvotes: { increment: 1 } },
    select: { id: true, upvotes: true },
  });

  return NextResponse.json(updated);
}