import "dotenv/config";
import { createRequire } from "node:module";
import { PrismaClient } from "../../generated/prisma/client.js";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
  prismaInitialized?: boolean;
};

function createAdapterClient(url: string) {
  // Lazy load to avoid issues during build/prerender
  const require = createRequire(import.meta.url);
  const { PrismaPg } =
    require("@prisma/adapter-pg") as typeof import("@prisma/adapter-pg");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
}

function initializePrisma(): PrismaClient {
  if (globalForPrisma.prisma && globalForPrisma.prismaInitialized) {
    return globalForPrisma.prisma;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const useAccelerate =
    databaseUrl.startsWith("prisma://") ||
    databaseUrl.startsWith("prisma+postgres://");

  const client = useAccelerate
    ? new PrismaClient({ accelerateUrl: databaseUrl })
    : createAdapterClient(databaseUrl);

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
    globalForPrisma.prismaInitialized = true;
  }

  return client;
}

// Use a Proxy to lazily initialize Prisma
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    const client = initializePrisma();
    return (client as any)[prop];
  },
});
