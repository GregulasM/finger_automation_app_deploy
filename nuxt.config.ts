import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const prismaTraceInclude = [
  require.resolve("@prisma/client"),
  require.resolve("@prisma/client/runtime/client"),
  require.resolve("@prisma/client/runtime/query_compiler_bg.postgresql.mjs"),
  require.resolve("@prisma/client/runtime/query_compiler_bg.postgresql.wasm-base64.mjs"),
  require.resolve("@prisma/adapter-pg"),
  require.resolve("@prisma/driver-adapter-utils"),
  require.resolve("@prisma/client-runtime-utils"),
];

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxt/a11y",
    "@nuxt/content",
    "@nuxt/hints",
    "@nuxt/image",
    "@nuxt/test-utils",
    "@vueuse/motion/nuxt",
  ],
  runtimeConfig: {
    authSecret:
      process.env.NUXT_AUTH_SECRET ||
      process.env.NUXT_JWT_SECRET ||
      process.env.JWT_SECRET ||
      "",
  },
  nitro: {
    externals: {
      traceInclude: prismaTraceInclude,
    },
    rollupConfig: {
      external: [/^@prisma\//, /\.wasm$/],
    },
  },
  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  routeRules: {},

  hooks: {
    "pages:extend"(pages) {
      const applyLayout = (pageList) => {
        for (const page of pageList) {
          if (page.path?.startsWith("/auth")) {
            page.meta = { ...(page.meta || {}), layout: "auth" };
          } else if (
            page.path?.startsWith("/main") ||
            page.path?.startsWith("/about")
          ) {
            page.meta = { ...(page.meta || {}), layout: "landing" };
          } else {
            page.meta = { ...(page.meta || {}), layout: "default" };
          }

          if (page.children?.length) {
            applyLayout(page.children);
          }
        }
      };

      applyLayout(pages);
    },
  },
  colorMode: {
    preference: "light",
    fallback: "light",
    classSuffix: "",
  },

  compatibilityDate: "2025-01-15",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
});
