import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = "postgresql://events_manager:123456@localhost:5432/events_synck_bd";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");


  const hash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.admin.upsert({
    where: { email: "admin@eventsync.io" },
    update: {},
    create: { email: "admin@eventsync.io", passwordHash: hash },
  });
  console.log("✅ Admin créé:", admin.email);


  const speaker1 = await prisma.speaker.create({
    data: {
      fullName: "Thomas Laurent",
      bio: "CTO @ Dataiku, expert en IA et ML depuis 15 ans.",
      photoUrl: null,
      speakerLinks: {
        create: [
          { label: "LinkedIn", url: "https://linkedin.com/in/thomas-laurent" },
          { label: "Twitter",  url: "https://twitter.com/thomaslaurent"  },
        ],
      },
    },
  });
  const speaker2 = await prisma.speaker.create({
    data: {
      fullName: "Sophie Martin",
      bio: "AI Research Lead @ Meta, chercheuse en NLP et LLM.",
      speakerLinks: { create: [{ label: "GitHub", url: "https://github.com/sophiemartin" }] },
    },
  });
  const speaker3 = await prisma.speaker.create({
    data: {
      fullName: "Alexandre Roux",
      bio: "Head of Design @ Figma Europe, design systems evangelist.",
    },
  });
  console.log("✅ Speakers créés");

  const event1 = await prisma.event.create({
    data: {
      title: "TechConf Paris 2025",
      description: "La plus grande conférence tech de France. 80+ speakers, 500+ participants, ateliers pratiques et keynotes d'exception sur 2 jours.",
      startDate: new Date("2025-06-15T09:00:00"),
      endDate:   new Date("2025-06-16T18:00:00"),
      location:  "Palais des Congrès, Paris",
      adminEvents: { create: { adminId: admin.id } },
      rooms: {
        create: [
          { name: "Grande Scène" },
          { name: "Salle IA & Data" },
          { name: "Salle Design" },
        ],
      },
    },
    include: { rooms: true },
  });

  const event2 = await prisma.event.create({
    data: {
      title: "Design Summit Lyon",
      description: "Deux jours dédiés au UI/UX design, design systems et design ops. Workshops immersifs et conférences de haut niveau.",
      startDate: new Date("2025-07-10T09:00:00"),
      endDate:   new Date("2025-07-11T17:00:00"),
      location:  "Centre de Congrès, Lyon",
      adminEvents: { create: { adminId: admin.id } },
      rooms: {
        create: [
          { name: "Amphithéâtre Principal" },
          { name: "Atelier Workshop" },
        ],
      },
    },
    include: { rooms: true },
  });
  console.log("✅ Events créés");

  const session1 = await prisma.session.create({
    data: {
      title: "Keynote : L'IA en 2025 — État des lieux",
      description: "Tour d'horizon complet de l'écosystème IA : LLMs, agents autonomes, et impact sur les métiers.",
      startTime: new Date("2025-06-15T09:30:00"),
      endTime:   new Date("2025-06-15T10:30:00"),
      capacity:  500,
      eventId:   event1.id,
      roomId:    event1.rooms[0].id,
      sessionSpeakers: { create: [{ speakerId: speaker1.id }, { speakerId: speaker2.id }] },
      adminSessions:   { create: { adminId: admin.id } },
    },
  });

  const session2 = await prisma.session.create({
    data: {
      title: "Workshop : Fine-tuning LLM en production",
      description: "Session pratique pour déployer et fine-tuner des modèles de langage dans un contexte enterprise.",
      startTime: new Date("2025-06-15T11:00:00"),
      endTime:   new Date("2025-06-15T12:30:00"),
      capacity:  80,
      eventId:   event1.id,
      roomId:    event1.rooms[1].id,
      sessionSpeakers: { create: [{ speakerId: speaker2.id }] },
      adminSessions:   { create: { adminId: admin.id } },
    },
  });

  const session3 = await prisma.session.create({
    data: {
      title: "Design System à l'échelle d'une grande entreprise",
      description: "Comment Figma construit et maintient son design system pour des équipes distribuées globalement.",
      startTime: new Date("2025-06-15T14:00:00"),
      endTime:   new Date("2025-06-15T15:30:00"),
      capacity:  150,
      eventId:   event1.id,
      roomId:    event1.rooms[2].id,
      sessionSpeakers: { create: [{ speakerId: speaker3.id }] },
      adminSessions:   { create: { adminId: admin.id } },
    },
  });

  await prisma.question.createMany({
    data: [
      { content: "Quels sont les risques des agents autonomes en production ?", authorName: "Alice D.", upvotes: 12, sessionId: session1.id },
      { content: "Comment gérer les hallucinations dans un contexte critique ?", authorName: "Marc B.", upvotes: 8, sessionId: session1.id },
      { content: "Quelle est la différence entre RAG et fine-tuning ?", upvotes: 5, sessionId: session1.id },
    ],
  });

  await prisma.session.create({
    data: {
      title: "Construire un design system de zéro",
      description: "Méthodologie complète pour créer, documenter et adopter un design system dans votre organisation.",
      startTime: new Date("2025-07-10T10:00:00"),
      endTime:   new Date("2025-07-10T12:00:00"),
      capacity:  200,
      eventId:   event2.id,
      roomId:    event2.rooms[0].id,
      sessionSpeakers: { create: [{ speakerId: speaker3.id }] },
      adminSessions:   { create: { adminId: admin.id } },
    },
  });

  console.log("✅ Sessions & Questions créées");
  console.log("\n🎉 Seed terminé !");
  console.log("   Admin: admin@eventsync.io / admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
