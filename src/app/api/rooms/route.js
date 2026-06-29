import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const _start = parseInt(searchParams.get("_start") || "0", 10);
    const _end = parseInt(searchParams.get("_end") || "10", 10);
    const _sort = searchParams.get("_sort") || "name";
    const _order = searchParams.get("_order") || "asc";

    const total = await prisma.room.count();

    const rooms = await prisma.room.findMany({
      skip: _start,
      take: _end - _start,
      orderBy: { [_sort]: _order.toLowerCase() },
    });

    return Response.json(rooms, {
      status: 200,
      headers: {
        "X-Total-Count": total.toString(),
      },
    });
  } catch (error) {
    console.error("[GET /api/rooms] Error:", error);
    return Response.json(
      { error: "Impossible de récupérer les salles." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, eventId } = body;

    if (!name || !eventId) {
      return Response.json(
        { error: "Le nom de la salle et l'ID de l'événement sont requis." },
        { status: 400 }
      );
    }

    const newRoom = await prisma.room.create({
      data: {
        name,
        eventId,
      },
    });

    return Response.json(newRoom, { status: 201 });
  } catch (error) {
    console.error("[POST /api/rooms] Error:", error);
    return Response.json(
      { error: "Impossible de créer la salle." },
      { status: 500 }
    );
  }
}
