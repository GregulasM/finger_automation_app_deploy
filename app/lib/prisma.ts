import "dotenv/config";
import { createRequire } from "node:module";
import { PrismaClient } from "../../generated/prisma/client.js";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const useAccelerate =
  databaseUrl.startsWith("prisma://") ||
  databaseUrl.startsWith("prisma+postgres://");

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const prisma =
  globalForPrisma.prisma ??
  (useAccelerate
    ? new PrismaClient({ accelerateUrl: databaseUrl })
    : createAdapterClient(databaseUrl));

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma };

function createAdapterClient(url: string) {
  const require = createRequire(import.meta.url);
  const { PrismaPg } =
    require("@prisma/adapter-pg") as typeof import("@prisma/adapter-pg");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
}
