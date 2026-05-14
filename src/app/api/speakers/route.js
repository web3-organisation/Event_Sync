import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const speakers = await prisma.speaker.findMany({
            include: {
                speakerLinks: true,
            },
        });

        return NextResponse.json(speakers);

    } catch (error) {
        console.error("Erreur:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}