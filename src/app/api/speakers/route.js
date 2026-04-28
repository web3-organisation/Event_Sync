import {NextResponse} from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient;

export async function GET() {
    try {
        const speakers = await prisma.speaker.findMany();

        return NextResponse.json({ speakers });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to fetch speakers' },
            { status: 500 }
        );
    }
}