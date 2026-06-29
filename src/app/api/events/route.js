import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const _start = parseInt(searchParams.get("_start") || "0", 10);
    const _end = parseInt(searchParams.get("_end") || "10", 10);
    const _sort = searchParams.get("_sort") || "startDate";
    const _order = searchParams.get("_order") || "asc";

    const total = await prisma.event.count();

    const events = await prisma.event.findMany({
      skip: _start,
      take: _end - _start,
      orderBy: { [_sort]: _order.toLowerCase() },
    });

    return Response.json(events, {
      status: 200,
      headers: {
        "X-Total-Count": total.toString(),
      },
    });
  } catch (error) {
    console.error("[GET /api/events] Error:", error);
    return Response.json(
      { error: "Impossible de récupérer les événements." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, startDate, endDate, location } = body;

    if (!title || !startDate || !endDate) {
      return Response.json(
        { error: "Le titre, la date de début et la date de fin sont requis." },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return Response.json(
        { error: "Les dates fournies ne sont pas valides." },
        { status: 400 }
      );
    }

    if (start > end) {
      return Response.json(
        { error: "La date de début doit être antérieure à la date de fin." },
        { status: 400 }
      );
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        description: description || null,
        startDate: start,
        endDate: end,
        location: location || null,
      },
    });

    return Response.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("[POST /api/events] Error:", error);
    return Response.json(
      { error: "Impossible de créer l'événement." },
      { status: 500 }
    );
  }
}
