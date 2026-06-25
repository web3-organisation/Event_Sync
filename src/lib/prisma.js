import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis;

if (!globalForPrisma.prisma) {
  // Configurer la connexion avec pg et l'adapter Prisma
  const connectionString = process.env.DATABASE_URL || "postgresql://events_manager:123456@localhost:5432/events_synck_bd";
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  globalForPrisma.prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

const prisma = globalForPrisma.prisma;
export default prisma;
