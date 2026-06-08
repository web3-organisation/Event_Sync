const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:new185231@localhost:5432/events_synck_bd";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Nettoyage de la base de données...");

  // Delete existing records in dependency order
  await prisma.adminEvent.deleteMany({});
  await prisma.adminRoom.deleteMany({});
  await prisma.adminSession.deleteMany({});
  await prisma.adminSpeaker.deleteMany({});
  await prisma.adminQuestion.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.sessionSpeaker.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.speaker.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.admin.deleteMany({});

  console.log("Base de données nettoyée.");

  console.log("Création de l'événement principal...");
  const event = await prisma.event.create({
    data: {
      title: "Conférence Tech Innovations 2026",
      description: "Deux jours d'inspiration, de conférences et d'ateliers pour découvrir les dernières tendances.",
      startDate: new Date(),
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      location: "Paris, France",
    },
  });

  console.log("Création des salles...");
  const roomA = await prisma.room.create({ data: { name: "Auditorium A", eventId: event.id } });
  const roomB = await prisma.room.create({ data: { name: "Salle B", eventId: event.id } });
  const roomC = await prisma.room.create({ data: { name: "Salle C", eventId: event.id } });
  const roomD = await prisma.room.create({ data: { name: "Salle D", eventId: event.id } });

  console.log("Création des intervenants...");
  const speakerSophie = await prisma.speaker.create({
    data: {
      fullName: "Sophie Martin",
      bio: "Experte en Intelligence Artificielle et Expérience Client.",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&fit=crop",
    },
  });

  const speakerLucas = await prisma.speaker.create({
    data: {
      fullName: "Lucas Bernard",
      bio: "Spécialiste en cybersécurité et hacking éthique.",
      photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=200&fit=crop",
    },
  });

  const speakerEmma = await prisma.speaker.create({
    data: {
      fullName: "Emma Dubois",
      bio: "Architecte DevOps & Cloud, passionnée de Kubernetes.",
      photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&fit=crop",
    },
  });

  const speakerThomas = await prisma.speaker.create({
    data: {
      fullName: "Thomas Petit",
      bio: "Product Designer travaillant sur des Design Systems à l'échelle.",
      photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&fit=crop",
    },
  });

  console.log("Création des sessions dynamiques...");
  const now = Date.now();

  // Session 1: Live (Started 30m ago, ends in 1h)
  const session1 = await prisma.session.create({
    data: {
      title: "L'IA au service de l'expérience client",
      description: "Comment intégrer l'agentic AI et les modèles génératifs dans vos parcours utilisateur pour les transformer.",
      startTime: new Date(now - 30 * 60 * 1000),
      endTime: new Date(now + 60 * 60 * 1000),
      capacity: 150,
      eventId: event.id,
      roomId: roomA.id,
    },
  });

  // Session 2: Live (Started 15m ago, ends in 45m)
  const session2 = await prisma.session.create({
    data: {
      title: "Cybersécurité : défis et perspectives 2026",
      description: "Analyse des menaces émergentes et des nouvelles pratiques de défense adaptées aux systèmes décentralisés.",
      startTime: new Date(now - 15 * 60 * 1000),
      endTime: new Date(now + 45 * 60 * 1000),
      capacity: 80,
      eventId: event.id,
      roomId: roomB.id,
    },
  });

  // Session 3: Upcoming (Starts in 2h, ends in 3h30)
  const session3 = await prisma.session.create({
    data: {
      title: "Cloud & DevOps Best Practices",
      description: "Plongée dans les architectures cloud natives, le GitOps et l'automatisation des pipelines CI/CD.",
      startTime: new Date(now + 2 * 60 * 60 * 1000),
      endTime: new Date(now + 3.5 * 60 * 60 * 1000),
      capacity: 100,
      eventId: event.id,
      roomId: roomC.id,
    },
  });

  // Session 4: Past (Started 4h ago, ended 2.5h ago)
  const session4 = await prisma.session.create({
    data: {
      title: "Design Systems à grande échelle",
      description: "Retour d'expérience sur la création, la maintenance et l'adoption d'un design system multi-plateforme.",
      startTime: new Date(now - 4 * 60 * 60 * 1000),
      endTime: new Date(now - 2.5 * 60 * 60 * 1000),
      capacity: 200,
      eventId: event.id,
      roomId: roomD.id,
    },
  });

  console.log("Association des intervenants aux sessions...");
  await prisma.sessionSpeaker.createMany({
    data: [
      { sessionId: session1.id, speakerId: speakerSophie.id },
      { sessionId: session2.id, speakerId: speakerLucas.id },
      { sessionId: session3.id, speakerId: speakerEmma.id },
      { sessionId: session4.id, speakerId: speakerThomas.id },
    ],
  });

  console.log("Seeding terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("Erreur durant le seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
