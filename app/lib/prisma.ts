import "dotenv/config";
import { createRequire } from "node:module";
import { PrismaClient } from "../../generated/prisma/client.js";

const databaseUrl = process.env.DATABASE_URL;
const isPrerender = process.env.NITRO_PRERENDER_ROUTES !== undefined;

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const prisma = isPrerender
  ? createPrerenderProxy()
  : globalForPrisma.prisma ?? createRuntimeClient();

if (!isPrerender && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma };

function createRuntimeClient() {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const useAccelerate =
    databaseUrl.startsWith("prisma://") ||
    databaseUrl.startsWith("prisma+postgres://");

  return useAccelerate
    ? new PrismaClient({ accelerateUrl: databaseUrl })
    : createAdapterClient(databaseUrl);
}

function createAdapterClient(url: string) {
  const require = createRequire(import.meta.url);
  const { PrismaPg } =
    require("@prisma/adapter-pg") as typeof import("@prisma/adapter-pg");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
}

function createPrerenderProxy(): PrismaClient {
  return new Proxy({} as PrismaClient, {
    get(_, prop) {
      if (prop === "then") return undefined;
      throw new Error(
        `Prisma is not available during prerender. Tried to access: ${String(prop)}`,
      );
    },
  });
}
