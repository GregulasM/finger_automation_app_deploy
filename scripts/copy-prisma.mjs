import { cp, mkdir } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const outputDir = join(root, ".output", "server", "node_modules", "@prisma");

const packages = [
  "client",
  "client-runtime-utils",
  "adapter-pg",
  "driver-adapter-utils",
];

await mkdir(outputDir, { recursive: true });

await Promise.all(
  packages.map(async (pkg) => {
    const src = join(root, "node_modules", "@prisma", pkg);
    const dest = join(outputDir, pkg);
    try {
      await cp(src, dest, { recursive: true });
    } catch (error) {
      console.warn(`[copy-prisma] skip ${pkg}: ${error.message}`);
    }
  }),
);
