import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma nécessite d'être côté serveur uniquement
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

export default nextConfig;
