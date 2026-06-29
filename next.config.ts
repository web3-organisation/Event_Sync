import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  reactCompiler: true,
};
module.exports = {
  allowedDevOrigins: ['192.168.88.14'],
}

export default nextConfig;