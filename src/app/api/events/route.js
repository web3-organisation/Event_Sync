import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startDate: 'asc' },
      include: {
        _count: {
          select: { sessions: true, rooms: true },
        },
      },
    });
    return Response.json(events);
  } catch (error) {
    return Response.json({ error: 'Erreur lors de la récupération des événements' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, startDate, endDate, location } = body;

    if (!title || !startDate || !endDate) {
      return Response.json({ error: 'Titre, date de début et date de fin sont requis' }, { status: 400 });
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return Response.json({ error: 'La date de fin doit être après la date de début' }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description: description || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location: location || null,
      },
    });

    return Response.json(event, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Erreur lors de la création de l\'événement' }, { status: 500 });
  }
}
