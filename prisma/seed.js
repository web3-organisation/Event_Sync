const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // 1. Create an Event
  const event = await prisma.event.create({
    data: {
      title: 'Web3 & Innovation Summit 2026',
      description: 'Le rendez-vous incontournable des technologies décentralisées.',
      startDate: new Date('2026-06-15T09:00:00Z'),
      endDate: new Date('2026-06-17T18:00:00Z'),
      location: 'Palais des Congrès, Paris',
    },
  });

  // 2. Create a Room
  const room = await prisma.room.create({
    data: {
      name: 'Grand Amphithéâtre',
      eventId: event.id,
    },
  });

  // 3. Create a Speaker
  const speaker = await prisma.speaker.create({
    data: {
      fullName: 'Alice Nakamoto',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
      bio: 'Experte en cryptographie et fondatrice de plusieurs protocoles DeFi.',
    },
  });

  // 4. Create a Session with ID "1" (to match the user's redirect)
  const session = await prisma.session.create({
    data: {
      id: '1', // On force l'ID à "1" pour correspondre au code du user
      title: 'Introduction à l\'Agentic AI et Web3',
      description: 'Découvrez comment les agents IA autonomes révolutionnent la gestion des smart contracts et l\'expérience utilisateur sur la blockchain. Cette session couvrira les bases théoriques et les cas d\'usage pratiques.',
      startTime: new Date('2026-06-15T10:00:00Z'),
      endTime: new Date('2026-06-15T11:30:00Z'),
      capacity: 500,
      eventId: event.id,
      roomId: room.id,
    },
  });

  // 5. Link Speaker to Session
  await prisma.sessionSpeaker.create({
    data: {
      sessionId: session.id,
      speakerId: speaker.id,
    },
  });

  // 6. Add some initial questions
  await prisma.question.createMany({
    data: [
      {
        content: 'Comment gérez-vous la latence des agents sur les L2 ?',
        authorName: 'Jean Dupont',
        upvotes: 5,
        sessionId: session.id,
      },
      {
        content: 'Est-ce que l\'IA peut elle-même déployer des contrats sans intervention humaine ?',
        authorName: null,
        upvotes: 12,
        sessionId: session.id,
      },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
