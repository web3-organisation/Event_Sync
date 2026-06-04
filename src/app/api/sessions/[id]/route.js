import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withLiveStatus } from "@/lib/session-utils";


export async function GET(req, { params }) {
    try {
        const { id: sessionId } = await params;  // Changement ici
        
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                room: true,
                event: true,
                sessionSpeakers: {
                    include: {
                        speaker: true
                    }
                },
                questions: {
                    orderBy: {
                        createdAt: "desc"
                    }
                },
                _count: {
                    select: {
                        questions: true
                    }
                }
            }
        });
        
        if (!session) {
            return Response.json({ error: 'Session not found' }, { status: 404 });
        }
        
        return Response.json(session);
    } catch (error) {
        console.error('Error fetching session:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}