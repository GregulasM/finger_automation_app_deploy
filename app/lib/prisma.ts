import "dotenv/config";
import { createRequire } from "node:module";
import { PrismaClient } from "../../generated/prisma/client.js";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

function createAdapterClient(url: string) {
  const require = createRequire(import.meta.url);
  const { PrismaPg } =
    require("@prisma/adapter-pg") as typeof import("@prisma/adapter-pg");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
}

// Lazy getter to avoid initialization during prerender/build
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    // Initialize on first access
    if (!globalForPrisma.prisma) {
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        throw new Error("DATABASE_URL is not set");
      }

      const useAccelerate =
        databaseUrl.startsWith("prisma://") ||
        databaseUrl.startsWith("prisma+postgres://");

      globalForPrisma.prisma = useAccelerate
        ? new PrismaClient({ accelerateUrl: databaseUrl })
        : createAdapterClient(databaseUrl);
    }

    const client = globalForPrisma.prisma;
    const value = (client as any)[prop];
    
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
