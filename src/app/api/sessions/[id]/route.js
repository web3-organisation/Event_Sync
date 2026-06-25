import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withLiveStatus } from "../../../lib/session-utils";

export async function GET(_req, { params }) {
  const { id } = await params;

  const session = await prisma.session.findUnique({
    where: { id },
    include: {
      room: true,
      event: {
        select: {
          id: true,
          title: true,
          startDate: true,
          endDate: true,
          location: true,
        },
      },
      sessionSpeakers: {
        include: {
          speaker: {
            select: {
              id: true,
              fullName: true,   
              photoUrl: true,   
              bio: true,
              speakerLinks: {   
                select: {
                  id: true,
                  label: true,
                  url: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!session) {
    return NextResponse.json(
      { error: "Session introuvable." },
      { status: 404 }
    );
  }

  const { sessionSpeakers, ...rest } = session;
  const formatted = {
    ...withLiveStatus(rest),
    speakers: sessionSpeakers.map((ss) => ss.speaker),
  };

  return NextResponse.json(formatted);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const questions = await prisma.question.findMany({
      where: { sessionId: id },
      select: { id: true },
    });
    const questionIds = questions.map((q) => q.id);
    if (questionIds.length) {
      await prisma.adminQuestion.deleteMany({ where: { questionId: { in: questionIds } } });
      await prisma.question.deleteMany({ where: { id: { in: questionIds } } });
    }

    await prisma.adminSession.deleteMany({ where: { sessionId: id } });
    await prisma.sessionSpeaker.deleteMany({ where: { sessionId: id } });
    await prisma.session.delete({
      where: { id }
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Impossible de supprimer la session." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
