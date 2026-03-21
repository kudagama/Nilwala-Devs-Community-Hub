import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tell Next.js NOT to bundle these native Node.js packages.
  // They must be required at runtime from node_modules, not bundled.
  serverExternalPackages: ["pg", "@prisma/client", "@prisma/adapter-pg"],
};

export default nextConfig;
