import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET(request, { params }) {
    const { id } = await params;

    const speaker = await prisma.speaker.findUnique({
        where: { id },
        include: { speakerLinks: true },
    });

    if (!speaker) {
        return NextResponse.json({ error: "Not found" }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json(speaker, { headers: corsHeaders });
}

export async function PUT(request, { params }) {
    const { id } = await params;
    const body = await request.json();

    const speaker = await prisma.speaker.update({
        where: { id },
        data: {
            fullName: body.fullName,
            photoUrl: body.photoUrl || null,
            bio: body.bio || null,
        },
    });

    return NextResponse.json(speaker, { headers: corsHeaders });
}

export async function DELETE(request, { params }) {
    const { id } = await params;

    await prisma.speaker.delete({
        where: { id },
    });

    return NextResponse.json({ id }, { headers: corsHeaders });
}

export async function OPTIONS() {
    return new Response(null, { status: 200, headers: corsHeaders });
}