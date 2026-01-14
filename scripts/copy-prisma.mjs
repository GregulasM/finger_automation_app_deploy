import { cp, mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();

const prismaPackages = [
  "client",
  "client-runtime-utils",
  "adapter-pg",
  "driver-adapter-utils",
  "debug",
];

const pgPackages = [
  "pg",
  "pg-cloudflare",
  "pg-connection-string",
  "pg-int8",
  "pg-pool",
  "pg-protocol",
  "pg-types",
  "pgpass",
  "postgres-array",
  "postgres-bytea",
  "postgres-date",
  "postgres-interval",
];

const outputRoots = await collectOutputRoots(root);

await Promise.all(
  outputRoots.map(async (destRoot) => {
    await copyPrismaPackages(destRoot);
    await copyPgPackages(destRoot);
  }),
);

async function collectOutputRoots(rootDir) {
  const roots = [join(rootDir, ".output", "server", "node_modules")];
  const vercelFunctionsDir = join(rootDir, ".vercel", "output", "functions");

  try {
    const entries = await readdir(vercelFunctionsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.endsWith(".func")) {
        roots.push(join(vercelFunctionsDir, entry.name, "node_modules"));
      }
    }
  } catch {
    // Vercel output not available for non-vercel builds.
  }

  return roots;
}

async function copyPrismaPackages(destRoot) {
  const outputDir = join(destRoot, "@prisma");
  await mkdir(outputDir, { recursive: true });

  await Promise.all(
    prismaPackages.map((pkg) =>
      copyDir(
        join(root, "node_modules", "@prisma", pkg),
        join(outputDir, pkg),
        `@prisma/${pkg}`,
      ),
    ),
  );
}

async function copyPgPackages(destRoot) {
  await mkdir(destRoot, { recursive: true });

  await Promise.all(
    pgPackages.map((pkg) =>
      copyDir(join(root, "node_modules", pkg), join(destRoot, pkg), pkg),
    ),
  );
}

async function copyDir(src, dest, label) {
  try {
    await cp(src, dest, { recursive: true });
  } catch (error) {
    console.warn(`[copy-prisma] skip ${label}: ${error.message}`);
  }
}
