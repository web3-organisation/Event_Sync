// app/api/sessions/[id]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withLiveStatus } from "@/lib/session-utils";

export async function GET(_req, { params }) {
  const { id } = params;

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