<script setup lang="ts">
const { t } = useI18n();

// Features with tooltips
const features = computed(() => [
  { 
    key: 'webhookTriggers',
    label: t("index.webhookTriggers"),
    tooltip: t("index.webhookTooltip")
  },
  { 
    key: 'cronSchedules',
    label: t("index.cronSchedules"),
    tooltip: t("index.cronTooltip")
  },
  { 
    key: 'jsonFirstWorkflows',
    label: t("index.jsonFirstWorkflows"),
    tooltip: t("index.jsonTooltip")
  }
]);

const screenshots = computed(() => [
  {
    id: 'editor',
    title: t("index.screenshotEditorTitle"),
    src: "/screenshots/workflow.png"
  },
  {
    id: 'details',
    title: t("index.screenshotDetailsTitle"),
    src: "/screenshots/details.png"
  },
  {
    id: 'logs',
    title: t("index.screenshotLogsTitle"),
    src: "/screenshots/logs.png"
  }
]);

const activeScreenshot = ref<{ title: string; src: string } | null>(null);

function openScreenshot(shot: { title: string; src: string }) {
  activeScreenshot.value = shot;
}

function closeScreenshot() {
  activeScreenshot.value = null;
}
</script>

<template>
  <div class="fixed inset-0 bg-zinc-950 overflow-hidden flex flex-col pt-10 4xs:pt-10 3xs:pt-11 2xs:pt-12 xs:pt-14 sm:pt-12 lg:pt-16 xl:pt-18 2xl:pt-20 3xl:pt-24 4xl:pt-28 5xl:pt-32">
    <div class="flex-1 overflow-y-auto flex flex-col px-2 4xs:px-3 3xs:px-4 xs:px-6 py-4 4xs:py-6 3xs:py-8">
      <div class="grid items-start gap-6 4xs:gap-8 3xs:gap-10 xs:gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div class="space-y-3 4xs:space-y-4 3xs:space-y-5 xs:space-y-6">
          <p
            class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold uppercase tracking-[0.35em] text-orange-500"
          >
            Finger Automation
          </p>
          <h1
            class="text-[7px] 4xs:text-[8px] 3xs:text-[9px] 2xs:text-[10px] xs:text-[11px] sm:text-sm md:text-md lg:text-md 2xl:text-lg 3xl:text-lg/6 4xl:text-2xl/8 5xl:text-3xl/10 font-bold text-zinc-100"
          >
            {{ t("index.title") }}
          </h1>
          <p
            class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/80"
          >
            {{ t("index.description") }}
          </p>
          <div class="rounded-xl border border-orange-500/30 bg-zinc-900/60 p-3 4xs:p-4 space-y-3">
            <div class="flex flex-col 2xs:flex-row gap-2 2xs:justify-between">
              <NuxtLink
                to="/workflows/editor"
                class="flex-1 inline-flex items-center justify-center rounded-md border border-orange-500 bg-orange-500 px-3 4xs:px-4 3xs:px-5 xs:px-6 py-2 4xs:py-3 3xs:py-4 sm:py-6 text-zinc-950 transition hover:brightness-110"
              >
                <span
                  class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold leading-none"
                >
                  {{ t("nav.newWorkflow") }}
                </span>
              </NuxtLink>
              <NuxtLink
                to="/workflows"
                class="flex-1 inline-flex items-center justify-center rounded-md border border-orange-500/30 bg-zinc-800/90 px-3 4xs:px-4 3xs:px-5 xs:px-6 py-2 4xs:py-3 3xs:py-4 sm:py-6 text-zinc-100 transition hover:border-orange-500/70 hover:bg-zinc-800"
              >
                <span
                  class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold leading-none"
                >
                  {{ t("nav.viewDashboard") }}
                </span>
              </NuxtLink>
            </div>
            <div class="grid grid-cols-1 2xs:grid-cols-3 gap-2">
              <UTooltip
                v-for="feature in features"
                :key="feature.key"
                :text="feature.tooltip"
              :ui="{ content: 'bg-zinc-800 border border-orange-500/30 rounded-lg shadow-lg px-3 py-2', text: 'text-zinc-100 text-xs' }"
              >
                <span
                  class="group flex w-full items-center justify-center gap-1 rounded-md border border-orange-500/30 bg-zinc-800/90 px-2 4xs:px-3 3xs:px-4 py-2 cursor-help transition hover:border-orange-500/50 hover:bg-zinc-700/50"
                >
                  <span
                    class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold text-zinc-100/80 leading-none"
                  >
                    {{ feature.label }}
                  </span>
                  <svg class="w-2 h-2 4xs:w-2.5 4xs:h-2.5 3xs:w-3 3xs:h-3 text-zinc-400 group-hover:text-orange-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </UTooltip>
            </div>
          </div>
        </div>

        <div class="space-y-3 4xs:space-y-4">
          <div
            class="rounded-xl 4xs:rounded-2xl border border-orange-500/30 bg-zinc-800/90 p-4 4xs:p-5"
          >
            <div
              class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold text-zinc-100"
            >
              {{ t("index.fromTriggerToAction") }}
            </div>
            <p
              class="mt-2 text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
            >
              {{ t("index.fromTriggerToActionDesc") }}
            </p>
          </div>
          <div
            class="rounded-xl 4xs:rounded-2xl border border-orange-500/30 bg-zinc-800/90 p-4 4xs:p-5"
          >
            <div
              class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold text-zinc-100"
            >
              {{ t("index.reliableExecution") }}
            </div>
            <p
              class="mt-2 text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
            >
              {{ t("index.reliableExecutionDesc") }}
            </p>
          </div>
          <div
            class="rounded-xl 4xs:rounded-2xl border border-orange-500/30 bg-zinc-800/90 p-4 4xs:p-5"
          >
            <div
              class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold text-zinc-100"
            >
              {{ t("index.auditReadyLogs") }}
            </div>
            <p
              class="mt-2 text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
            >
              {{ t("index.auditReadyLogsDesc") }}
            </p>
          </div>
          <div
            class="rounded-xl 4xs:rounded-2xl border border-orange-500/30 bg-zinc-800/90 p-4 4xs:p-5"
          >
            <div
              class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold text-zinc-100"
            >
              {{ t("index.screenshotsTitle") }}
            </div>
            <div class="mt-3 grid gap-3 sm:grid-cols-3">
              <button
                v-for="shot in screenshots"
                :key="shot.id"
                type="button"
                class="group flex flex-col gap-2 rounded-lg border border-orange-500/20 bg-zinc-900/70 p-2 text-left transition hover:border-orange-500/60 hover:bg-zinc-800/80"
                @click="openScreenshot(shot)"
              >
                <div
                  class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold text-zinc-100"
                >
                  {{ shot.title }}
                </div>
                <div class="aspect-video overflow-hidden rounded-md border border-orange-500/20 bg-zinc-900">
                  <img
                    :src="shot.src"
                    :alt="shot.title"
                    class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <teleport to="body">
      <div
        v-if="activeScreenshot"
        class="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        @click.self="closeScreenshot"
      >
        <div class="w-full max-w-5xl">
          <div class="mb-3 flex items-center justify-between">
            <div
              class="text-[7px] 4xs:text-[8px] 3xs:text-[9px] 2xs:text-[10px] xs:text-[11px] sm:text-sm md:text-md lg:text-md 2xl:text-lg 3xl:text-lg/6 4xl:text-2xl/8 5xl:text-3xl/10 font-bold text-zinc-100"
            >
              {{ activeScreenshot.title }}
            </div>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-md border border-orange-500/30 bg-zinc-900/80 px-2 2xs:px-3 py-1 3xs:py-2 text-zinc-100 hover:border-orange-500/70 hover:bg-zinc-900 transition"
              @click="closeScreenshot"
            >
              <UIcon name="i-lucide-x" class="h-4 w-4" />
            </button>
          </div>
          <div class="rounded-xl border border-orange-500/30 bg-zinc-900/90 p-2">
            <img
              :src="activeScreenshot.src"
              :alt="activeScreenshot.title"
              class="w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>
