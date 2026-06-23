// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
//
// export async function GET() {
//     try {
//         const speakers = await prisma.speaker.findMany({
//             include: {
//                 speakerLinks: true,
//             },
//         });
//
//         return NextResponse.json(speakers);
//
//     } catch (error) {
//         console.error("Erreur:", error);
//         return NextResponse.json(
//             { error: error.message },
//             { status: 500 }
//         );
//     }
// }
//
// export async function POST(request) {
//     const body = await request.json();
//
//     const speaker = await prisma.speaker.create({
//         data: {
//             fullName: body.fullName,
//             photoUrl: body.photoUrl || null,
//             bio: body.bio || null,
//         },
//     });
//
//     return NextResponse.json(speaker, { status: 201 });
// }

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET() {
    const speakers = await prisma.speaker.findMany({
        include: { speakerLinks: true },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(speakers, { headers: corsHeaders });
}

export async function POST(request) {
    const body = await request.json();

    const speaker = await prisma.speaker.create({
        data: {
            fullName: body.fullName,
            photoUrl: body.photoUrl || null,
            bio: body.bio || null,
        },
    });

    return NextResponse.json(speaker, { status: 201, headers: corsHeaders });
}

export async function OPTIONS() {
    return new Response(null, { status: 200, headers: corsHeaders });
}