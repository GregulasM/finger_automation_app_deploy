<template>
  <div class="min-h-screen bg-zinc-950 px-2 4xs:px-3 3xs:px-4 xs:px-6 py-4 4xs:py-6 3xs:py-8">
    <div class="flex flex-wrap items-center justify-between gap-3 4xs:gap-4">
      <div>
        <h1
          class="text-[7px] 4xs:text-[8px] 3xs:text-[9px] 2xs:text-[10px] xs:text-[11px] sm:text-sm md:text-md lg:text-md 2xl:text-lg 3xl:text-lg/6 4xl:text-2xl/8 5xl:text-3xl/10 font-bold text-zinc-100"
        >
          Workflows
        </h1>
        <p
          class="mt-1 text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
        >
          Track activity, performance, and recent executions.
        </p>
      </div>
      <NuxtLink
        to="/workflows/editor"
        class="rounded-md border border-orange-500 bg-orange-500 px-3 4xs:px-4 3xs:px-5 xs:px-6 py-2 4xs:py-2.5 3xs:py-3 text-zinc-950 transition hover:brightness-110"
      >
        <span
          class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold"
        >
          New workflow
        </span>
      </NuxtLink>
    </div>

    <div class="mt-4 4xs:mt-6 grid gap-4 4xs:gap-6 lg:grid-cols-[280px_1fr]">
      <div
        class="rounded-xl 4xs:rounded-2xl border border-orange-500/30 bg-zinc-800/70 backdrop-blur-lg opacity-90 p-3 4xs:p-4"
      >
        <div
          class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold uppercase tracking-wider text-zinc-100/60"
        >
          Workflow list
        </div>
        <div class="mt-3 4xs:mt-4 h-[70vh] space-y-2 overflow-y-auto pr-1">
          <div
            v-if="workflowsPending"
            class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
          >
            Loading workflows...
          </div>
          <div
            v-else-if="workflowError"
            class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-red-400"
          >
            {{ workflowError }}
          </div>
          <button
            v-for="workflow in workflows"
            :key="workflow.id"
            type="button"
            class="flex w-full flex-col gap-1 rounded-lg border px-2 4xs:px-3 py-2 text-left transition"
            :class="
              workflow.id === selectedWorkflowId
                ? 'border-orange-500/80 bg-zinc-800 text-zinc-100'
                : 'border-orange-500/25 bg-zinc-800/50 text-zinc-100/90 hover:border-orange-500/70 hover:bg-zinc-800/80'
            "
            @click="selectedWorkflowId = workflow.id"
          >
            <span
              class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold"
            >
              {{ workflow.name }}
            </span>
            <span
              class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
            >
              {{ workflow.triggerType }} • {{ workflow.status }}
            </span>
            <span
              class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/50"
            >
              Updated {{ formatDate(workflow.updatedAt) }}
            </span>
          </button>
        </div>
      </div>

      <div class="space-y-4 4xs:space-y-6">
        <div
          class="rounded-xl 4xs:rounded-2xl border border-orange-500/30 bg-zinc-800/70 backdrop-blur-lg opacity-90 p-3 4xs:p-4 3xs:p-5"
        >
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div
                class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 uppercase tracking-wider text-zinc-100/60"
              >
                Overview
              </div>
              <div
                class="mt-1 text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold text-zinc-100"
              >
                {{ selectedWorkflow?.name || "Select a workflow" }}
              </div>
            </div>
            <div class="flex items-center gap-2">
              <UBadge
                v-if="selectedWorkflow"
                :color="badgeColor(selectedWorkflow.status)"
                variant="soft"
                :ui="{ root: 'ring-0' }"
              >
                {{ selectedWorkflow.status }}
              </UBadge>
              <NuxtLink
                v-if="selectedWorkflow"
                :to="`/workflows/editor?workflowId=${selectedWorkflow.id}`"
                class="rounded-md border border-orange-500/30 bg-zinc-800/70 backdrop-blur-lg opacity-90 px-3 4xs:px-4 py-2 4xs:py-2.5 text-zinc-100 transition hover:border-orange-500/70 hover:bg-zinc-800/90"
              >
                <span
                  class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold"
                >
                  Edit
                </span>
              </NuxtLink>
            </div>
          </div>

          <div
            v-if="statsPending"
            class="mt-4 text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
          >
            Loading stats...
          </div>
          <div v-else class="mt-4 space-y-4">
            <div v-if="selectedWorkflow" class="grid gap-4 sm:grid-cols-2">
              <div
                class="rounded-xl border border-orange-500/30 bg-zinc-800/50 p-3 4xs:p-4"
              >
                <div
                  class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
                >
                  Trigger type
                </div>
                <div
                  class="mt-1 text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold text-zinc-100"
                >
                  {{ selectedWorkflow.triggerType }}
                </div>
                <div
                  v-if="triggerEndpoint"
                  class="mt-2 text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
                >
                  Endpoint: {{ triggerEndpoint }}
                </div>
              </div>
              <div
                class="rounded-xl border border-orange-500/30 bg-zinc-800/50 p-3 4xs:p-4"
              >
                <div
                  class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
                >
                  Last updated
                </div>
                <div
                  class="mt-1 text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold text-zinc-100"
                >
                  {{ formatDate(selectedWorkflow.updatedAt) }}
                </div>
                <div
                  class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
                >
                  Created {{ formatDate(selectedWorkflow.createdAt) }}
                </div>
              </div>
            </div>
            <div v-if="stats" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div
                class="rounded-xl border border-orange-500/30 bg-zinc-800/50 p-3 4xs:p-4"
              >
                <div
                  class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
                >
                  Total runs
                </div>
                <div
                  class="mt-1 text-[7px] 4xs:text-[8px] 3xs:text-[9px] 2xs:text-[10px] xs:text-[11px] sm:text-sm md:text-md lg:text-md 2xl:text-lg 3xl:text-lg/6 4xl:text-2xl/8 5xl:text-3xl/10 font-bold text-zinc-100"
                >
                  {{ stats.total }}
                </div>
              </div>
              <div
                class="rounded-xl border border-orange-500/30 bg-zinc-800/50 p-3 4xs:p-4"
              >
                <div
                  class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
                >
                  Success rate
                </div>
                <div
                  class="mt-1 text-[7px] 4xs:text-[8px] 3xs:text-[9px] 2xs:text-[10px] xs:text-[11px] sm:text-sm md:text-md lg:text-md 2xl:text-lg 3xl:text-lg/6 4xl:text-2xl/8 5xl:text-3xl/10 font-bold text-zinc-100"
                >
                  {{ formatPercent(stats.successRate) }}
                </div>
              </div>
              <div
                class="rounded-xl border border-orange-500/30 bg-zinc-800/50 p-3 4xs:p-4"
              >
                <div
                  class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
                >
                  Avg duration
                </div>
                <div
                  class="mt-1 text-[7px] 4xs:text-[8px] 3xs:text-[9px] 2xs:text-[10px] xs:text-[11px] sm:text-sm md:text-md lg:text-md 2xl:text-lg 3xl:text-lg/6 4xl:text-2xl/8 5xl:text-3xl/10 font-bold text-zinc-100"
                >
                  {{ formatDuration(stats.avgDurationMs) }}
                </div>
              </div>
              <div
                class="rounded-xl border border-orange-500/30 bg-zinc-800/50 p-3 4xs:p-4"
              >
                <div
                  class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
                >
                  Last run
                </div>
                <div
                  class="mt-1 text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold text-zinc-100"
                >
                  {{ stats.lastRunAt ? formatDate(stats.lastRunAt) : "-" }}
                </div>
                <div
                  class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
                >
                  {{ stats.lastStatus || "No runs yet" }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="rounded-xl 4xs:rounded-2xl border border-orange-500/30 bg-zinc-800/70 backdrop-blur-lg opacity-90 p-3 4xs:p-4 3xs:p-5"
        >
          <div
            class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 uppercase tracking-wider text-zinc-100/60"
          >
            Execution history
          </div>
          <div class="mt-3 4xs:mt-4">
            <div
              v-if="executionsPending"
              class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
            >
              Loading executions...
            </div>
            <div
              v-else-if="executions && executions.length === 0"
              class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
            >
              No executions yet.
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="execution in executions"
                :key="execution.id"
                class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-orange-500/30 bg-zinc-800/50 px-3 py-2"
              >
                <div>
                  <div
                    class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold text-zinc-100"
                  >
                    {{ formatDate(execution.startedAt) }}
                  </div>
                  <div
                    class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
                  >
                    Steps: {{ execution.steps.length }}
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <UBadge
                    :color="badgeColor(execution.status)"
                    variant="soft"
                    :ui="{ root: 'ring-0' }"
                  >
                    {{ execution.status }}
                  </UBadge>
                  <span
                    class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
                  >
                    {{ formatDuration(durationMs(execution)) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";

type WorkflowListItem = {
  id: string;
  name: string;
  status: string;
  triggerType: string;
  createdAt: string;
  updatedAt: string;
  lastRun: string | null;
  lastStatus: string | null;
};

type WorkflowStats = {
  total: number;
  successRate: number;
  avgDurationMs: number;
  lastRunAt: string | null;
  lastStatus: string | null;
};

type WorkflowDetail = {
  id: string;
  name: string;
  status: string;
  triggerType: string;
  createdAt: string;
  updatedAt: string;
};

type ExecutionRecord = {
  id: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  steps: Array<{ id: string }>;
};

const runtimeConfig = useRuntimeConfig();
const appUrl = runtimeConfig.public?.appUrl ?? "";
const selectedWorkflowId = ref<string | null>(null);
const auth = useAuthStore();
const { loggedIn } = storeToRefs(auth);

const {
  data: workflowsData,
  pending: workflowsPending,
  error: workflowsError,
} = await useFetch<WorkflowListItem[]>("/api/workflows", {
  credentials: "include",
  immediate: loggedIn.value,
  watch: [loggedIn],
});

const workflows = computed(() => workflowsData.value ?? []);
const workflowError = computed(() => workflowsError.value?.message ?? "");

watch(
  workflows,
  (items) => {
    if (!selectedWorkflowId.value && items.length > 0) {
      selectedWorkflowId.value = items[0].id;
    }
  },
  { immediate: true },
);

const { data: selectedWorkflow } = await useAsyncData<WorkflowDetail | null>(
  "workflow-detail",
  async () => {
    if (!selectedWorkflowId.value || !loggedIn.value) {
      return null;
    }
    return await $fetch(`/api/workflows/${selectedWorkflowId.value}`, {
      credentials: "include",
    });
  },
  { watch: [selectedWorkflowId, loggedIn] },
);

const triggerEndpoint = computed(() => {
  if (!selectedWorkflow.value) {
    return "";
  }
  if (selectedWorkflow.value.triggerType === "WEBHOOK") {
    return `${appUrl}/api/hooks/${selectedWorkflow.value.id}`;
  }
  if (selectedWorkflow.value.triggerType === "EMAIL") {
    return `${appUrl}/api/email/inbound/${selectedWorkflow.value.id}`;
  }
  return "";
});

const { data: stats, pending: statsPending } =
  await useAsyncData<WorkflowStats | null>(
    "workflow-stats",
    async () => {
      if (!selectedWorkflowId.value || !loggedIn.value) {
        return null;
      }
      return await $fetch(`/api/workflows/${selectedWorkflowId.value}/stats`, {
        credentials: "include",
      });
    },
    { watch: [selectedWorkflowId, loggedIn] },
  );

const { data: executions, pending: executionsPending } = await useAsyncData<
  ExecutionRecord[]
>(
  "workflow-executions",
  async () => {
    if (!selectedWorkflowId.value || !loggedIn.value) {
      return [];
    }
    return await $fetch(
      `/api/workflows/${selectedWorkflowId.value}/executions`,
      {
        credentials: "include",
        query: { limit: 10 },
      },
    );
  },
  { watch: [selectedWorkflowId, loggedIn] },
);

function badgeColor(status: string) {
  switch (status) {
    case "SUCCESS":
      return "green";
    case "FAIL":
      return "red";
    case "PAUSED":
      return "amber";
    case "RUNNING":
      return "blue";
    default:
      return "neutral";
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatDuration(value: number) {
  if (!value || value <= 0) {
    return "-";
  }
  if (value < 1000) {
    return `${value} ms`;
  }
  const seconds = Math.round(value / 100) / 10;
  return `${seconds} s`;
}

function durationMs(execution: ExecutionRecord) {
  if (!execution.finishedAt) {
    return 0;
  }
  return (
    new Date(execution.finishedAt).getTime() -
    new Date(execution.startedAt).getTime()
  );
}
</script>
