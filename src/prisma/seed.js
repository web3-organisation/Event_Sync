const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    await prisma.speaker.deleteMany();
    await prisma.session.deleteMany();

    // ── Session 1 ────────────────────────────────
    await prisma.session.create({
        data: {
            name: "Keynote d'ouverture",
            date: "15 Mars 2024",
            time: "09:00 - 10:00",
            location: "Salle A",
            description: "Discours d'ouverture",
            speakers: {
                create: [
                    {
                        name: "Dr. Sarah Johnson",
                        title: "AI Research Lead",
                        company: "TechCorp",
                        picture: "https://randomuser.me/api/portraits/women/44.jpg",
                        email: "sarah.johnson@techcorp.com",
                        phone: "+1 (555) 123-4567",
                        linkedin: "linkedin.com/in/sarahjohnson",
                        twitter: "@sarahAI",
                        bio: "Experte en IA avec 15 ans d'expérience.",
                    },
                ],
            },
        },
    });

    // ── Session 2 ────────────────────────────────
    await prisma.session.create({
        data: {
            name: "AI & Machine Learning",
            date: "15 Mars 2024",
            time: "10:00 - 11:30",
            location: "Salle B",
            description: "Les dernières avancées en IA",
            speakers: {
                create: [
                    {
                        name: "Mark Williams",
                        title: "ML Engineer",
                        company: "DataLab",
                        picture: "https://randomuser.me/api/portraits/men/32.jpg",
                        email: "mark.williams@datalab.com",
                        phone: "+1 (555) 987-6543",
                        linkedin: "linkedin.com/in/markwilliams",
                        twitter: "@markML",
                        bio: "Spécialiste en ML et Deep Learning.",
                    },
                    {
                        name: "Emily Chen",
                        title: "Data Scientist",
                        company: "AI Solutions",
                        picture: "https://randomuser.me/api/portraits/women/68.jpg",
                        email: "emily.chen@aisolutions.com",
                        phone: "+1 (555) 456-7890",
                        linkedin: "linkedin.com/in/emilychen",
                        twitter: "@emilyAI",
                        bio: "Passionnée par la data science.",
                    },
                ],
            },
        },
    });

    console.log("✅ Seed finished!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });