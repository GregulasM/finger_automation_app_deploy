<template>
  <div class="relative overflow-hidden">
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.15),_transparent_50%),radial-gradient(circle_at_bottom_right,_rgba(14,116,144,0.15),_transparent_45%)]"
    />
    <UContainer class="relative py-16">
      <div class="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500"
          >
            Finger Automation
          </p>
          <h1 class="mt-4 text-4xl font-semibold text-slate-900 md:text-5xl">
            Automate your stack with visual workflows.
          </h1>
          <p class="mt-4 text-base text-slate-600">
            Build triggers, chain actions, and ship workflows in minutes.
            Connect Webhooks, Schedules, and HTTP requests with resilient
            serverless execution.
          </p>
          <div class="mt-6 flex flex-wrap items-center gap-3">
            <UButton to="/workflows/editor" color="primary" size="lg">
              Open workflow editor
            </UButton>
            <UButton
              to="/workflows"
              variant="outline"
              color="neutral"
              size="lg"
            >
              View dashboard
            </UButton>
            <UButton
              to="/auth/login"
              variant="outline"
              color="neutral"
              size="lg"
            >
              Sign in
            </UButton>
          </div>
          <div
            class="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-500"
          >
            <span
              class="rounded-full border border-slate-200 bg-white px-3 py-1"
            >
              Webhook triggers
            </span>
            <span
              class="rounded-full border border-slate-200 bg-white px-3 py-1"
            >
              Cron schedules
            </span>
            <span
              class="rounded-full border border-slate-200 bg-white px-3 py-1"
            >
              JSON-first workflows
            </span>
          </div>
        </div>

        <div class="space-y-4">
          <div
            class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div class="text-sm font-semibold text-slate-900">
              From trigger to action
            </div>
            <p class="mt-2 text-sm text-slate-500">
              Design flows visually, then store the graph as JSONB with full
              execution history.
            </p>
          </div>
          <div
            class="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-5 shadow-sm"
          >
            <div class="text-sm font-semibold text-slate-900">
              Reliable execution
            </div>
            <p class="mt-2 text-sm text-slate-500">
              QStash handles queueing and retries while the runner isolates each
              workflow run.
            </p>
          </div>
          <div
            class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div class="text-sm font-semibold text-slate-900">
              Audit-ready logs
            </div>
            <p class="mt-2 text-sm text-slate-500">
              Step-by-step logging, timings, and outputs stay available for
              every run.
            </p>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
