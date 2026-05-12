import {NextResponse} from "next/server";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient;

export async function GET(id) {
    try {
        const speakers = await prisma.speaker.findMany();
        return NextResponse.json({ speakers });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to fetch speaker with id' + id },
            { status: 500 }
        );
    }
}