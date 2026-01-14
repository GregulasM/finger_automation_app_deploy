<template>
  <div class="px-6 py-8">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Workflows</h1>
        <p class="text-sm text-slate-500">
          Track activity, performance, and recent executions.
        </p>
      </div>
      <UButton to="/workflows/editor" color="primary">New workflow</UButton>
    </div>

    <div class="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
      <UCard class="border-slate-200/70">
        <div
          class="text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          Workflow list
        </div>
        <div class="mt-4 h-[70vh] space-y-2 overflow-y-auto pr-1">
          <div v-if="workflowsPending" class="text-sm text-slate-500">
            Loading workflows...
          </div>
          <div v-else-if="workflowError" class="text-sm text-red-500">
            {{ workflowError }}
          </div>
          <button
            v-for="workflow in workflows"
            :key="workflow.id"
            type="button"
            class="flex w-full flex-col gap-1 rounded-lg border px-3 py-2 text-left text-sm transition"
            :class="
              workflow.id === selectedWorkflowId
                ? 'border-emerald-400/60 bg-emerald-50'
                : 'border-slate-200 hover:border-slate-300'
            "
            @click="selectedWorkflowId = workflow.id"
          >
            <span class="font-semibold text-slate-900">
              {{ workflow.name }}
            </span>
            <span class="text-xs text-slate-500">
              {{ workflow.triggerType }} • {{ workflow.status }}
            </span>
            <span class="text-[11px] text-slate-400">
              Updated {{ formatDate(workflow.updatedAt) }}
            </span>
          </button>
        </div>
      </UCard>

      <div class="space-y-6">
        <UCard class="border-slate-200/70">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div class="text-xs uppercase tracking-wider text-slate-400">
                Overview
              </div>
              <div class="mt-1 text-lg font-semibold text-slate-900">
                {{ selectedWorkflow?.name || "Select a workflow" }}
              </div>
            </div>
            <div class="flex items-center gap-2">
              <UBadge
                v-if="selectedWorkflow"
                :color="badgeColor(selectedWorkflow.status)"
                variant="soft"
              >
                {{ selectedWorkflow.status }}
              </UBadge>
              <UButton
                v-if="selectedWorkflow"
                color="neutral"
                variant="outline"
                :to="`/workflows/editor?workflowId=${selectedWorkflow.id}`"
              >
                Edit
              </UButton>
            </div>
          </div>

          <div v-if="statsPending" class="mt-4 text-sm text-slate-500">
            Loading stats...
          </div>
          <div v-else class="mt-4 space-y-4">
            <div v-if="selectedWorkflow" class="grid gap-4 sm:grid-cols-2">
              <div class="rounded-xl border border-slate-200 bg-white p-4">
                <div class="text-xs text-slate-500">Trigger type</div>
                <div class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedWorkflow.triggerType }}
                </div>
                <div v-if="triggerEndpoint" class="mt-2 text-xs text-slate-500">
                  Endpoint: {{ triggerEndpoint }}
                </div>
              </div>
              <div class="rounded-xl border border-slate-200 bg-white p-4">
                <div class="text-xs text-slate-500">Last updated</div>
                <div class="mt-1 text-sm font-semibold text-slate-900">
                  {{ formatDate(selectedWorkflow.updatedAt) }}
                </div>
                <div class="text-xs text-slate-500">
                  Created {{ formatDate(selectedWorkflow.createdAt) }}
                </div>
              </div>
            </div>
            <div v-if="stats" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div class="text-xs text-slate-500">Total runs</div>
                <div class="mt-1 text-xl font-semibold text-slate-900">
                  {{ stats.total }}
                </div>
              </div>
              <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div class="text-xs text-slate-500">Success rate</div>
                <div class="mt-1 text-xl font-semibold text-slate-900">
                  {{ formatPercent(stats.successRate) }}
                </div>
              </div>
              <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div class="text-xs text-slate-500">Avg duration</div>
                <div class="mt-1 text-xl font-semibold text-slate-900">
                  {{ formatDuration(stats.avgDurationMs) }}
                </div>
              </div>
              <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div class="text-xs text-slate-500">Last run</div>
                <div class="mt-1 text-sm font-semibold text-slate-900">
                  {{ stats.lastRunAt ? formatDate(stats.lastRunAt) : "-" }}
                </div>
                <div class="text-xs text-slate-500">
                  {{ stats.lastStatus || "No runs yet" }}
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <UCard class="border-slate-200/70">
          <div class="text-xs uppercase tracking-wider text-slate-400">
            Execution history
          </div>
          <div class="mt-4">
            <div v-if="executionsPending" class="text-sm text-slate-500">
              Loading executions...
            </div>
            <div
              v-else-if="executions && executions.length === 0"
              class="text-sm text-slate-500"
            >
              No executions yet.
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="execution in executions"
                :key="execution.id"
                class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2"
              >
                <div>
                  <div class="text-sm font-semibold text-slate-900">
                    {{ formatDate(execution.startedAt) }}
                  </div>
                  <div class="text-xs text-slate-500">
                    Steps: {{ execution.steps.length }}
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <UBadge :color="badgeColor(execution.status)" variant="soft">
                    {{ execution.status }}
                  </UBadge>
                  <span class="text-xs text-slate-500">
                    {{ formatDuration(durationMs(execution)) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </UCard>
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
