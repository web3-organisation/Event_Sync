import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await prisma.event.delete({ where: { id } });
        return Response.json({ message: 'Événement supprimé' });
    } catch (error) {
        return Response.json({ error: 'Événement introuvable' }, { status: 404 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { title, description, startDate, endDate, location } = body;

        if (new Date(endDate) <= new Date(startDate)) {
            return Response.json({ error: 'La date de fin doit être après la date de début' }, { status: 400 });
        }

        const event = await prisma.event.update({
            where: { id },
            data: {
                title,
                description: description || null,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                location: location || null,
            },
        });

        return Response.json(event);
    } catch (error) {
        return Response.json({ error: 'Erreur lors de la modification' }, { status: 500 });
    }
}
