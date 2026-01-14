<template>
  <div class="relative overflow-hidden min-h-screen bg-zinc-950">
    <UContainer class="relative py-4 4xs:py-6 3xs:py-8 xs:py-12 sm:py-16">
      <div class="grid items-center gap-6 4xs:gap-8 3xs:gap-10 xs:gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div class="space-y-3 4xs:space-y-4 3xs:space-y-5 xs:space-y-6">
          <p
            class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold uppercase tracking-[0.35em] text-orange-500"
          >
            Finger Automation
          </p>
          <h1
            class="text-[7px] 4xs:text-[8px] 3xs:text-[9px] 2xs:text-[10px] xs:text-[11px] sm:text-sm md:text-md lg:text-md 2xl:text-lg 3xl:text-lg/6 4xl:text-2xl/8 5xl:text-3xl/10 font-bold text-zinc-100"
          >
            Automate your stack with visual workflows.
          </h1>
          <p
            class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/80"
          >
            Build triggers, chain actions, and ship workflows in minutes.
            Connect Webhooks, Schedules, and HTTP requests with resilient
            serverless execution.
          </p>
          <div
            class="flex flex-wrap items-center gap-2 4xs:gap-3 3xs:gap-3 xs:gap-4"
          >
            <NuxtLink
              to="/workflows/editor"
              class="rounded-md border border-orange-500 bg-orange-500 px-3 4xs:px-4 3xs:px-5 xs:px-6 py-2 4xs:py-2.5 3xs:py-3 text-zinc-950 transition hover:brightness-110"
            >
              <span
                class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold"
              >
                Open workflow editor
              </span>
            </NuxtLink>
            <NuxtLink
              to="/workflows"
              class="rounded-md border border-orange-500/30 bg-zinc-800/70 backdrop-blur-lg opacity-90 px-3 4xs:px-4 3xs:px-5 xs:px-6 py-2 4xs:py-2.5 3xs:py-3 text-zinc-100 transition hover:border-orange-500/70 hover:bg-zinc-800/90"
            >
              <span
                class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold"
              >
                View dashboard
              </span>
            </NuxtLink>
            <NuxtLink
              to="/auth/login"
              class="rounded-md border border-orange-500/30 bg-zinc-800/70 backdrop-blur-lg opacity-90 px-3 4xs:px-4 3xs:px-5 xs:px-6 py-2 4xs:py-2.5 3xs:py-3 text-zinc-100 transition hover:border-orange-500/70 hover:bg-zinc-800/90"
            >
              <span
                class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold"
              >
                Sign in
              </span>
            </NuxtLink>
          </div>
          <div
            class="flex flex-wrap items-center gap-2 4xs:gap-3 3xs:gap-4"
          >
            <span
              class="rounded-full border border-orange-500/30 bg-zinc-800/70 backdrop-blur-lg opacity-90 px-2 4xs:px-3 3xs:px-4 py-1 4xs:py-1.5"
            >
              <span
                class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/80"
              >
                Webhook triggers
              </span>
            </span>
            <span
              class="rounded-full border border-orange-500/30 bg-zinc-800/70 backdrop-blur-lg opacity-90 px-2 4xs:px-3 3xs:px-4 py-1 4xs:py-1.5"
            >
              <span
                class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/80"
              >
                Cron schedules
              </span>
            </span>
            <span
              class="rounded-full border border-orange-500/30 bg-zinc-800/70 backdrop-blur-lg opacity-90 px-2 4xs:px-3 3xs:px-4 py-1 4xs:py-1.5"
            >
              <span
                class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/80"
              >
                JSON-first workflows
              </span>
            </span>
          </div>
        </div>

        <div class="space-y-3 4xs:space-y-4">
          <div
            class="rounded-xl 4xs:rounded-2xl border border-orange-500/30 bg-zinc-800/70 backdrop-blur-lg opacity-90 p-4 4xs:p-5"
          >
            <div
              class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold text-zinc-100"
            >
              From trigger to action
            </div>
            <p
              class="mt-2 text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
            >
              Design flows visually, then store the graph as JSONB with full
              execution history.
            </p>
          </div>
          <div
            class="rounded-xl 4xs:rounded-2xl border border-orange-500/30 bg-zinc-800/70 backdrop-blur-lg opacity-90 p-4 4xs:p-5"
          >
            <div
              class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold text-zinc-100"
            >
              Reliable execution
            </div>
            <p
              class="mt-2 text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
            >
              QStash handles queueing and retries while the runner isolates each
              workflow run.
            </p>
          </div>
          <div
            class="rounded-xl 4xs:rounded-2xl border border-orange-500/30 bg-zinc-800/70 backdrop-blur-lg opacity-90 p-4 4xs:p-5"
          >
            <div
              class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold text-zinc-100"
            >
              Audit-ready logs
            </div>
            <p
              class="mt-2 text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
            >
              Step-by-step logging, timings, and outputs stay available for
              every run.
            </p>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
