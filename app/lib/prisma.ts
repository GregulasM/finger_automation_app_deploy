import "dotenv/config";
import { createRequire } from "node:module";
import { PrismaClient } from "../../generated/prisma/client.js";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const useAccelerate =
    databaseUrl.startsWith("prisma://") ||
    databaseUrl.startsWith("prisma+postgres://");

  if (useAccelerate) {
    return new PrismaClient({ accelerateUrl: databaseUrl });
  }

  const require = createRequire(import.meta.url);
  const { PrismaPg } =
    require("@prisma/adapter-pg") as typeof import("@prisma/adapter-pg");

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });
}

// Lazy-loaded Prisma client via Proxy to avoid build-time initialization.
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    if (prop === "then") return undefined;

    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient();
    }

    const client = globalForPrisma.prisma;
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
