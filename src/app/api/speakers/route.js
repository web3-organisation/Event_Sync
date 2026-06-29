import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const _start = parseInt(searchParams.get("_start") || "0", 10);
    const _end = parseInt(searchParams.get("_end") || "10", 10);
    const _sort = searchParams.get("_sort") || "createdAt";
    const _order = searchParams.get("_order") || "desc";

    const total = await prisma.speaker.count();

    const speakers = await prisma.speaker.findMany({
      skip: _start,
      take: _end - _start,
      orderBy: { [_sort]: _order.toLowerCase() },
    });

    return Response.json(speakers, {
      status: 200,
      headers: {
        "X-Total-Count": total.toString(),
      },
    });
  } catch (error) {
    console.error("[GET /api/speakers] Error:", error);
    return Response.json(
      { error: "Impossible de récupérer les intervenants." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, bio, photoUrl } = body;

    if (!fullName) {
      return Response.json(
        { error: "Le nom complet est requis." },
        { status: 400 }
      );
    }

    const newSpeaker = await prisma.speaker.create({
      data: {
        fullName,
        bio: bio || null,
        photoUrl: photoUrl || null,
      },
    });

    return Response.json(newSpeaker, { status: 201 });
  } catch (error) {
    console.error("[POST /api/speakers] Error:", error);
    return Response.json(
      { error: "Impossible de créer l'intervenant." },
      { status: 500 }
    );
  }
}
