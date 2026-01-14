<template>
  <div class="space-y-4">
    <div
      class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
    >
      <div class="flex flex-1 flex-wrap items-center gap-3">
        <UInput
          v-model="workflowName"
          placeholder="Workflow name"
          class="min-w-[220px] flex-1"
        />
        <div class="flex items-center gap-2 text-sm text-slate-500">
          <USwitch v-model="workflowActive" />
          <span>Active</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <UBadge color="neutral" variant="subtle">
          Trigger: {{ triggerLabel }}
        </UBadge>
        <UButton
          color="primary"
          :loading="saving || loadingWorkflow"
          @click="saveWorkflow"
        >
          Save
        </UButton>
      </div>
    </div>

    <UAlert
      v-if="saveError"
      color="red"
      variant="soft"
      title="Save failed"
      :description="saveError"
    />
    <UAlert
      v-if="loadError"
      color="red"
      variant="soft"
      title="Load failed"
      :description="loadError"
    />
    <UAlert
      v-if="saveSuccess"
      color="green"
      variant="soft"
      title="Saved"
      :description="saveSuccess"
    />

    <div
      class="flex h-[80vh] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
    >
      <aside class="w-64 border-r border-slate-200 bg-white p-4">
        <div
          class="text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          Blocks
        </div>
        <div class="mt-4 space-y-2">
          <div
            v-for="item in palette"
            :key="item.id"
            class="group flex w-full select-none flex-col gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white cursor-grab active:cursor-grabbing"
            :class="
              item.id === selectedPaletteId
                ? 'border-emerald-400/70 bg-emerald-50'
                : ''
            "
            draggable="true"
            role="button"
            tabindex="0"
            @dragstart="onDragStart($event, item)"
            @dragend="onDragEnd"
            @click="selectPalette(item)"
            @keydown.enter.prevent="addNodeFromPalette(item)"
            @keydown.space.prevent="addNodeFromPalette(item)"
          >
            <div class="flex items-center justify-between gap-2">
              <span>{{ item.label }}</span>
              <span class="text-xs uppercase text-slate-400">{{
                item.role
              }}</span>
            </div>
            <span class="text-xs font-normal text-slate-500">
              {{ item.summary }}
            </span>
          </div>
        </div>
        <div class="mt-6 rounded-lg border border-slate-200 bg-white p-3">
          <div
            class="text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Block details
          </div>
          <div v-if="selectedPalette" class="mt-2 space-y-2">
            <div class="text-sm font-semibold text-slate-900">
              {{ selectedPalette.label }}
            </div>
            <p class="text-xs text-slate-600">
              {{ selectedPalette.details }}
            </p>
            <div
              v-if="selectedPalette.tips?.length"
              class="space-y-1 text-xs text-slate-500"
            >
              <div v-for="tip in selectedPalette.tips" :key="tip">
                - {{ tip }}
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <UButton
                size="xs"
                color="primary"
                variant="soft"
                @click="addNodeFromPalette(selectedPalette)"
              >
                Add to canvas
              </UButton>
              <span class="text-[11px] text-slate-400">
                Tip: drag to place it precisely.
              </span>
            </div>
          </div>
          <div v-else class="mt-2 text-xs text-slate-500">
            Click a block to see what it does and how to configure it.
          </div>
        </div>
      </aside>

      <div
        ref="flowWrapper"
        class="relative flex-1"
        @drop="onDrop"
        @dragover="onDragOver"
      >
        <ClientOnly>
          <VueFlow
            :id="flowId"
            v-model:nodes="nodes"
            v-model:edges="edges"
            class="h-full w-full workflow-canvas"
            :fit-view-on-init="true"
            @connect="onConnect"
            @node-click="onNodeClick"
            @pane-click="clearSelection"
          />
        </ClientOnly>
      </div>

      <aside class="flex w-96 flex-col border-l border-slate-200 bg-white">
        <div class="border-b border-slate-200 px-6 py-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div
                class="text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                Node settings
              </div>
              <div class="mt-1 text-lg font-semibold text-slate-900">
                {{ selectedLabel }}
              </div>
            </div>
            <UButton
              v-if="selectedNode"
              color="red"
              variant="soft"
              size="xs"
              @click="removeSelectedNode"
            >
              Delete
            </UButton>
          </div>
        </div>
        <div class="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          <div v-if="!selectedNode" class="text-sm text-slate-500">
            Select a node to edit its settings.
          </div>

          <template v-else>
            <div class="space-y-6" :key="selectedNodeId || 'empty'">
              <div class="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div
                  class="text-[11px] font-semibold uppercase tracking-wider text-slate-400"
                >
                  About this block
                </div>
                <div class="mt-1 text-sm font-semibold text-slate-900">
                  {{ selectedHelp?.label || selectedLabel }}
                </div>
                <p class="mt-1 text-xs text-slate-600">
                  {{
                    selectedHelp?.details ||
                    "Configure this block to control how it behaves."
                  }}
                </p>
                <div
                  v-if="selectedHelp?.tips?.length"
                  class="mt-2 space-y-1 text-xs text-slate-500"
                >
                  <div v-for="tip in selectedHelp.tips" :key="tip">
                    - {{ tip }}
                  </div>
                </div>
              </div>

              <div v-if="selectedRole === 'trigger'" class="space-y-4">
                <div v-if="selectedType === 'Webhook'" class="space-y-3">
                  <UFormField label="Webhook URL">
                    <UInput
                      :model-value="webhookEndpoint"
                      placeholder="Save to generate the webhook URL"
                      readonly
                    />
                  </UFormField>
                  <div v-if="!workflowId" class="flex items-center gap-2">
                    <UButton
                      size="xs"
                      color="primary"
                      variant="soft"
                      :loading="saving"
                      @click="saveWorkflow"
                    >
                      Generate endpoint
                    </UButton>
                    <span class="text-xs text-slate-500">
                      Saving creates a stable URL for this trigger.
                    </span>
                  </div>
                </div>

                <div v-if="selectedType === 'Schedule'" class="space-y-3">
                  <UFormField label="Cron expression">
                    <UInput
                      :model-value="String(selectedConfig.cron ?? '')"
                      placeholder="*/5 * * * *"
                      @update:model-value="
                        (value) => updateTextConfig('cron', String(value))
                      "
                    />
                  </UFormField>
                  <UFormField label="Timezone">
                    <UInput
                      :model-value="String(selectedConfig.timezone ?? 'UTC')"
                      placeholder="UTC"
                      @update:model-value="
                        (value) => updateTextConfig('timezone', String(value))
                      "
                    />
                  </UFormField>
                </div>

                <div v-if="selectedType === 'Email'" class="space-y-3">
                  <UFormField label="Inbound email endpoint">
                    <UInput
                      :model-value="emailEndpoint"
                      placeholder="Save to generate the inbound endpoint"
                      readonly
                    />
                  </UFormField>
                  <div v-if="!workflowId" class="flex items-center gap-2">
                    <UButton
                      size="xs"
                      color="primary"
                      variant="soft"
                      :loading="saving"
                      @click="saveWorkflow"
                    >
                      Generate endpoint
                    </UButton>
                    <span class="text-xs text-slate-500">
                      Save once to get the inbound URL.
                    </span>
                  </div>
                  <div class="text-xs text-slate-500">
                    Configure your inbound email provider to POST to this URL.
                  </div>
                </div>
              </div>

              <div v-if="selectedRole === 'action'" class="space-y-6">
                <div
                  v-if="selectedActionType === 'HTTP Request'"
                  class="space-y-4"
                >
                  <UFormField label="URL">
                    <UInput
                      :model-value="String(selectedConfig.url ?? '')"
                      placeholder="https://api.example.com"
                      @update:model-value="
                        (value) => updateTextConfig('url', String(value))
                      "
                    />
                  </UFormField>
                  <UFormField label="Method">
                    <USelect
                      :items="httpMethods"
                      :model-value="String(selectedConfig.method ?? 'POST')"
                      @update:model-value="
                        (value) => updateTextConfig('method', String(value))
                      "
                    />
                  </UFormField>
                  <UFormField label="Headers (JSON)">
                    <UTextarea
                      :model-value="
                        formatJsonConfig(selectedConfig.headers, '{}')
                      "
                      placeholder='{"Authorization":"Bearer ..."}'
                      @update:model-value="
                        (value) => updateTextConfig('headers', String(value))
                      "
                    />
                  </UFormField>
                  <UFormField label="Body (JSON or text)">
                    <UTextarea
                      :model-value="String(selectedConfig.body ?? '')"
                      placeholder='{"id":"123"}'
                      @update:model-value="
                        (value) => updateTextConfig('body', String(value))
                      "
                    />
                  </UFormField>
                </div>

                <div v-if="selectedActionType === 'Email'" class="space-y-4">
                  <UFormField label="To">
                    <UInput
                      :model-value="String(selectedConfig.to ?? '')"
                      placeholder="user@example.com"
                      @update:model-value="
                        (value) => updateTextConfig('to', String(value))
                      "
                    />
                  </UFormField>
                  <UFormField label="Subject">
                    <UInput
                      :model-value="String(selectedConfig.subject ?? '')"
                      placeholder="Workflow update"
                      @update:model-value="
                        (value) => updateTextConfig('subject', String(value))
                      "
                    />
                  </UFormField>
                  <UFormField label="HTML">
                    <UTextarea
                      :model-value="String(selectedConfig.html ?? '')"
                      placeholder="<p>Hello!</p>"
                      @update:model-value="
                        (value) => updateTextConfig('html', String(value))
                      "
                    />
                  </UFormField>
                  <UFormField label="Text">
                    <UTextarea
                      :model-value="String(selectedConfig.text ?? '')"
                      placeholder="Plain text fallback"
                      @update:model-value="
                        (value) => updateTextConfig('text', String(value))
                      "
                    />
                  </UFormField>
                </div>

                <div v-if="selectedActionType === 'Telegram'" class="space-y-4">
                  <UFormField label="Bot token">
                    <UInput
                      :model-value="String(selectedConfig.botToken ?? '')"
                      placeholder="123456:ABC..."
                      @update:model-value="
                        (value) => updateTextConfig('botToken', String(value))
                      "
                    />
                  </UFormField>
                  <UFormField label="Chat ID">
                    <UInput
                      :model-value="String(selectedConfig.chatId ?? '')"
                      placeholder="123456789"
                      @update:model-value="
                        (value) => updateTextConfig('chatId', String(value))
                      "
                    />
                  </UFormField>
                  <UFormField label="Message">
                    <UTextarea
                      :model-value="String(selectedConfig.message ?? '')"
                      placeholder="Workflow completed"
                      @update:model-value="
                        (value) => updateTextConfig('message', String(value))
                      "
                    />
                  </UFormField>
                  <UFormField label="Parse mode">
                    <USelect
                      :items="telegramParseModes"
                      :model-value="
                        String(selectedConfig.parseMode ?? 'Markdown')
                      "
                      @update:model-value="
                        (value) => updateTextConfig('parseMode', String(value))
                      "
                    />
                  </UFormField>
                </div>

                <div v-if="selectedActionType === 'Database'" class="space-y-4">
                  <UFormField label="Model">
                    <UInput
                      :model-value="String(selectedConfig.model ?? '')"
                      placeholder="user"
                      @update:model-value="
                        (value) => updateTextConfig('model', String(value))
                      "
                    />
                  </UFormField>
                  <UFormField label="Operation">
                    <USelect
                      :items="dbOperations"
                      :model-value="
                        String(selectedConfig.operation ?? 'create')
                      "
                      @update:model-value="
                        (value) => updateTextConfig('operation', String(value))
                      "
                    />
                  </UFormField>
                  <UFormField label="Args (JSON)">
                    <UTextarea
                      :model-value="formatJsonConfig(selectedConfig.args, '{}')"
                      placeholder='{"data":{"email":"user@example.com"}}'
                      @update:model-value="
                        (value) => updateTextConfig('args', String(value))
                      "
                    />
                  </UFormField>
                </div>

                <div
                  v-if="selectedActionType === 'Transformation'"
                  class="space-y-4"
                >
                  <UFormField label="Expression">
                    <UTextarea
                      :model-value="String(selectedConfig.expression ?? '')"
                      placeholder="input.amount > 100"
                      @update:model-value="
                        (value) => updateTextConfig('expression', String(value))
                      "
                    />
                  </UFormField>
                  <UFormField label="Mapping (JSON)">
                    <UTextarea
                      :model-value="
                        formatJsonConfig(selectedConfig.mapping, '{}')
                      "
                      placeholder='{"total":"input.amount"}'
                      @update:model-value="
                        (value) => updateTextConfig('mapping', String(value))
                      "
                    />
                  </UFormField>
                </div>

                <div class="border-t border-slate-200 pt-4">
                  <div class="text-sm font-semibold text-slate-700">
                    Error handling
                  </div>
                  <div class="mt-3 space-y-3">
                    <UFormField label="Retry count">
                      <UInput
                        type="number"
                        :model-value="String(selectedConfig.retryCount ?? 0)"
                        @update:model-value="
                          (value) => updateNumberConfig('retryCount', value)
                        "
                      />
                    </UFormField>
                    <UFormField label="Retry delay (ms)">
                      <UInput
                        type="number"
                        :model-value="String(selectedConfig.retryDelayMs ?? 0)"
                        @update:model-value="
                          (value) => updateNumberConfig('retryDelayMs', value)
                        "
                      />
                    </UFormField>
                    <UFormField label="On error">
                      <USelect
                        :items="errorModes"
                        :model-value="String(selectedConfig.onError ?? 'fail')"
                        @update:model-value="
                          (value) => updateTextConfig('onError', String(value))
                        "
                      />
                    </UFormField>
                    <UFormField label="Notify email">
                      <UInput
                        :model-value="String(selectedConfig.notifyEmail ?? '')"
                        placeholder="alerts@example.com"
                        @update:model-value="
                          (value) =>
                            updateTextConfig('notifyEmail', String(value))
                        "
                      />
                    </UFormField>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { $fetch } from "ofetch";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  addEdge,
  type Connection,
  type Edge,
  type Node,
  useVueFlow,
  VueFlow,
} from "@vue-flow/core";

type NodeData = {
  label: string;
  type: string;
  role?: "trigger" | "action";
  actionType?: string;
  config?: Record<string, unknown>;
};

type PaletteItem = {
  id: string;
  label: string;
  type: string;
  role: "trigger" | "action";
  actionType?: string;
  config?: Record<string, unknown>;
  summary: string;
  details: string;
  tips?: string[];
};

const props = defineProps<{ workflowId?: string | null }>();
const flowId = "workflow-editor";

const palette: PaletteItem[] = [
  {
    id: "webhook",
    label: "Webhook",
    type: "Webhook",
    role: "trigger",
    summary: "Incoming HTTP request triggers the workflow.",
    details:
      "Expose a webhook endpoint and start the flow when data is posted.",
    tips: [
      "Use JSON payloads from external apps.",
      "Save once to generate the URL.",
    ],
    config: {},
  },
  {
    id: "schedule",
    label: "Schedule",
    type: "Schedule",
    role: "trigger",
    summary: "Run the workflow on a cron schedule.",
    details: "Define a cron expression and timezone to trigger automatically.",
    tips: ["Example: */5 * * * *", "Timezone defaults to UTC."],
    config: { cron: "*/5 * * * *", timezone: "UTC" },
  },
  {
    id: "email-trigger",
    label: "Email",
    type: "Email",
    role: "trigger",
    summary: "Trigger when an inbound email arrives.",
    details: "Point your inbound email provider to the generated endpoint.",
    tips: ["Providers can POST email payloads.", "Save once to get the URL."],
    config: {},
  },
  {
    id: "http-request",
    label: "HTTP Request",
    type: "HTTP Request",
    role: "action",
    actionType: "HTTP Request",
    summary: "Send an HTTP request to an API.",
    details:
      "Configure method, headers, and body. The response becomes the next step input.",
    tips: ["Use output from previous steps.", "Timeout defaults to 15s."],
    config: { url: "", method: "POST", headers: "{}", body: "" },
  },
  {
    id: "email-action",
    label: "Email",
    type: "Email",
    role: "action",
    actionType: "Email",
    summary: "Send an email notification.",
    details: "Uses your configured email service with HTML or text content.",
    tips: ["Provide recipient and subject.", "HTML is optional."],
    config: { to: "", subject: "", html: "", text: "" },
  },
  {
    id: "telegram",
    label: "Telegram",
    type: "Telegram",
    role: "action",
    actionType: "Telegram",
    summary: "Send a message to Telegram.",
    details: "Requires a bot token and the target chat ID.",
    tips: ["Create a bot via BotFather.", "Use the chat ID of your target."],
    config: { botToken: "", chatId: "", message: "", parseMode: "Markdown" },
  },
  {
    id: "database",
    label: "Database",
    type: "Database",
    role: "action",
    actionType: "Database",
    summary: "Run a database operation.",
    details: "Executes a Prisma operation against your database.",
    tips: ["Model name matches Prisma client.", "Args must be valid JSON."],
    config: { model: "", operation: "create", args: "{}" },
  },
  {
    id: "transformation",
    label: "Transformation",
    type: "Transformation",
    role: "action",
    actionType: "Transformation",
    summary: "Transform or filter the payload.",
    details: "Use an expression or mapping to shape data between steps.",
    tips: [
      "Expression returns new payload.",
      "Mapping can pick fields by path.",
    ],
    config: { expression: "", mapping: "{}" },
  },
];

const httpMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const errorModes = ["fail", "pause"];
const telegramParseModes = ["Markdown", "MarkdownV2", "HTML"];
const dbOperations = [
  "create",
  "update",
  "upsert",
  "delete",
  "findMany",
  "findUnique",
];
const triggerTypeKeys = new Set(["webhook", "schedule", "cron", "email"]);

const nodes = ref<Node<NodeData>[]>([]);
const edges = ref<Edge[]>([]);
const selectedNodeId = ref<string | null>(null);
const selectedPaletteId = ref<string | null>(palette[0]?.id ?? null);
const flowWrapper = ref<HTMLDivElement | null>(null);
const workflowName = ref("Untitled workflow");
const workflowActive = ref(true);
const workflowId = ref<string | null>(null);
const saveError = ref<string | null>(null);
const saveSuccess = ref<string | null>(null);
const saving = ref(false);
const loadingWorkflow = ref(false);
const loadError = ref<string | null>(null);
const draggingItem = ref<PaletteItem | null>(null);

const selectedNode = computed(
  () =>
    nodes.value.find((node) => String(node.id) === selectedNodeId.value) ??
    null,
);
const selectedConfig = computed(() => {
  const data = selectedNode.value?.data;
  if (!data) {
    return {};
  }
  if (data.config && typeof data.config === "object") {
    return data.config as Record<string, unknown>;
  }
  return data as Record<string, unknown>;
});
const selectedType = computed(() =>
  normalizeNodeType(getNodeRawType(selectedNode.value)),
);
const selectedRole = computed(() => inferNodeRole(selectedNode.value));
const selectedActionType = computed(() =>
  selectedRole.value === "action" ? selectedType.value : "",
);
const selectedLabel = computed(
  () => selectedNode.value?.data?.label || selectedType.value || "Node",
);
const selectedPalette = computed(
  () => palette.find((item) => item.id === selectedPaletteId.value) ?? null,
);
const selectedHelp = computed(() => {
  if (!selectedRole.value || !selectedType.value) {
    return null;
  }
  const typeKey = normalizePaletteType(selectedType.value);
  return (
    palette.find(
      (item) =>
        item.role === selectedRole.value &&
        normalizePaletteType(item.type) === typeKey,
    ) ?? null
  );
});
const triggerLabel = computed(() => {
  const triggerNode = getTriggerNode();
  return triggerNode?.data?.label ?? "Not set";
});

watch(
  selectedHelp,
  (help) => {
    if (help) {
      selectedPaletteId.value = help.id;
    }
  },
  { immediate: true },
);

watch(selectedNode, (node) => {
  if (!node && selectedNodeId.value) {
    selectedNodeId.value = null;
  }
});

function normalizePaletteType(value: string) {
  const key = value.toLowerCase().trim();
  if (key === "cron" || key === "schedule") {
    return "schedule";
  }
  return key;
}

function normalizeNodeType(value: string) {
  const key = normalizePaletteType(value);
  if (!key) {
    return "";
  }
  if (key === "webhook") {
    return "Webhook";
  }
  if (key === "schedule") {
    return "Schedule";
  }
  if (key === "email") {
    return "Email";
  }
  if (key === "http request") {
    return "HTTP Request";
  }
  if (key === "telegram") {
    return "Telegram";
  }
  if (key === "database") {
    return "Database";
  }
  if (key === "transformation") {
    return "Transformation";
  }
  return value;
}

function getNodeRawType(node?: Node<NodeData> | null) {
  if (!node) {
    return "";
  }
  const data = node.data ?? {};
  return String(data.type ?? data.actionType ?? node.type ?? "");
}

function inferNodeRole(node?: Node<NodeData> | null) {
  if (!node) {
    return "";
  }

  const data = node.data ?? {};
  if (data.role) {
    return data.role;
  }
  if (data.actionType) {
    return "action";
  }

  const config =
    data.config && typeof data.config === "object"
      ? (data.config as Record<string, unknown>)
      : (data as Record<string, unknown>);

  const actionKeys = [
    "url",
    "method",
    "headers",
    "body",
    "to",
    "subject",
    "html",
    "text",
    "botToken",
    "chatId",
    "message",
    "parseMode",
    "model",
    "operation",
    "args",
    "expression",
    "mapping",
  ];

  const triggerKeys = ["cron", "timezone"];

  if (actionKeys.some((key) => key in config)) {
    return "action";
  }
  if (triggerKeys.some((key) => key in config)) {
    return "trigger";
  }

  const rawType = normalizePaletteType(getNodeRawType(node));
  if (!rawType) {
    return "";
  }
  return triggerTypeKeys.has(rawType) ? "trigger" : "action";
}

function getTriggerNode() {
  return nodes.value.find((node) => {
    return inferNodeRole(node) === "trigger";
  });
}

function normalizeLoadedNode(raw: Node<NodeData>, index: number) {
  const node = raw as Node<NodeData>;
  const data = node.data && typeof node.data === "object" ? node.data : {};
  const rawType = getNodeRawType({ ...node, data: data as NodeData });
  const type = normalizeNodeType(rawType);
  const role = inferNodeRole({ ...node, data: data as NodeData });
  const actionType =
    (data as NodeData).actionType ?? (role === "action" ? type : undefined);
  const config = {
    ...(data &&
    typeof (data as NodeData).config === "object" &&
    (data as NodeData).config
      ? (data as NodeData).config
      : {}),
  } as Record<string, unknown>;
  const configKeys = [
    "cron",
    "timezone",
    "url",
    "method",
    "headers",
    "body",
    "to",
    "subject",
    "html",
    "text",
    "botToken",
    "chatId",
    "message",
    "parseMode",
    "model",
    "operation",
    "args",
    "expression",
    "mapping",
    "retryCount",
    "retryDelayMs",
    "onError",
    "notifyEmail",
  ];
  for (const key of configKeys) {
    if (key in data && !(key in config)) {
      config[key] = (data as Record<string, unknown>)[key];
    }
  }
  if (role === "action" && type === "Telegram") {
    const parseMode = String(config.parseMode ?? "").trim();
    if (!parseMode) {
      config.parseMode = "Markdown";
    }
  }

  return {
    ...node,
    id: String(node.id ?? index),
    draggable: true,
    selectable: true,
    data: {
      ...(data as NodeData),
      label:
        typeof (data as NodeData).label === "string" &&
        (data as NodeData).label.trim()
          ? (data as NodeData).label
          : type || "Node",
      type,
      role,
      actionType,
      config,
    },
  };
}

const { project } = useVueFlow(flowId);
const runtimeConfig = useRuntimeConfig();
const appUrl = computed(() => runtimeConfig.public?.appUrl || "");
const webhookEndpoint = computed(() =>
  workflowId.value ? `${appUrl.value}/api/hooks/${workflowId.value}` : "",
);
const emailEndpoint = computed(() =>
  workflowId.value
    ? `${appUrl.value}/api/email/inbound/${workflowId.value}`
    : "",
);

function selectPalette(item: PaletteItem) {
  selectedPaletteId.value = item.id;
}

function createNodeFromPalette(
  item: PaletteItem,
  position: { x: number; y: number },
) {
  const nodeId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${item.id}-${Date.now()}`;
  const role = item.role;
  const actionType =
    role === "action" ? (item.actionType ?? item.type) : undefined;

  nodes.value = [
    ...nodes.value,
    {
      id: nodeId,
      type: "default",
      draggable: true,
      selectable: true,
      position,
      data: {
        label: item.label,
        type: item.type,
        role,
        actionType,
        config: { ...(item.config ?? {}) },
      },
    },
  ];

  return nodeId;
}

function addNodeFromPalette(item: PaletteItem) {
  selectPalette(item);
  if (!flowWrapper.value) {
    return;
  }

  const bounds = flowWrapper.value.getBoundingClientRect();
  const position = project({
    x: bounds.width / 2,
    y: bounds.height / 2,
  });

  const nodeId = createNodeFromPalette(item, position);
  selectedNodeId.value = nodeId;
}

function onDragStart(event: DragEvent, item: PaletteItem) {
  selectPalette(item);
  draggingItem.value = item;
  if (!event.dataTransfer) {
    return;
  }
  event.dataTransfer.setData("text/plain", item.id);
  event.dataTransfer.setData("application/vueflow", JSON.stringify(item));
  event.dataTransfer.effectAllowed = "move";
}

function onDragEnd() {
  draggingItem.value = null;
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
}

function onDrop(event: DragEvent) {
  event.preventDefault();
  if (!flowWrapper.value) {
    return;
  }

  const raw = event.dataTransfer?.getData("application/vueflow");
  let item: PaletteItem | null = null;
  if (raw) {
    try {
      item = JSON.parse(raw) as PaletteItem;
    } catch {
      item = null;
    }
  }

  if (!item) {
    const fallbackId = event.dataTransfer?.getData("text/plain") ?? "";
    const normalizedFallback = fallbackId.trim().toLowerCase();
    item =
      palette.find((entry) => entry.id === fallbackId) ??
      palette.find(
        (entry) =>
          entry.label.toLowerCase() === normalizedFallback ||
          entry.type.toLowerCase() === normalizedFallback,
      ) ??
      (selectedPaletteId.value
        ? (palette.find((entry) => entry.id === selectedPaletteId.value) ??
          null)
        : null);
  }

  if (!item && draggingItem.value) {
    item = draggingItem.value;
  }

  if (!item) {
    return;
  }
  draggingItem.value = null;

  const bounds = flowWrapper.value.getBoundingClientRect();
  const position = project({
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  });

  const nodeId = createNodeFromPalette(item, position);
  selectedNodeId.value = nodeId;
}

function onConnect(params: Connection) {
  edges.value = addEdge(params, edges.value);
}

function onNodeClick(
  event: { node?: Node<NodeData> } | Node<NodeData> | MouseEvent | null,
  nodeFromEvent?: Node<NodeData>,
) {
  const node = nodeFromEvent ?? (event && "node" in event ? event.node : event);
  if (!node?.id) {
    return;
  }
  selectedNodeId.value = String(node.id);
}

function clearSelection() {
  selectedNodeId.value = null;
}

function removeNodeById(nodeId: string) {
  nodes.value = nodes.value.filter((node) => String(node.id) !== nodeId);
  edges.value = edges.value.filter(
    (edge) => edge.source !== nodeId && edge.target !== nodeId,
  );
  if (selectedNodeId.value === nodeId) {
    selectedNodeId.value = null;
  }
}

function removeSelectedNode() {
  if (!selectedNodeId.value) {
    return;
  }
  removeNodeById(selectedNodeId.value);
}

function handleKeydown(event: KeyboardEvent) {
  if (!selectedNodeId.value) {
    return;
  }
  const target = event.target as HTMLElement | null;
  const tagName = target?.tagName?.toLowerCase();
  if (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    target?.isContentEditable
  ) {
    return;
  }

  if (event.key === "Delete" || event.key === "Backspace") {
    event.preventDefault();
    removeSelectedNode();
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});

function updateSelectedConfig(patch: Record<string, unknown>) {
  if (!selectedNode.value) {
    return;
  }

  nodes.value = nodes.value.map((node) => {
    if (node.id !== selectedNode.value?.id) {
      return node;
    }
    const data = (node.data ?? {}) as NodeData;
    const nextConfig = { ...(data.config ?? {}), ...patch };
    return {
      ...node,
      data: {
        ...data,
        config: nextConfig,
      },
    };
  });
}

function updateTextConfig(key: string, value: string | number) {
  updateSelectedConfig({ [key]: value });
}

function updateNumberConfig(key: string, value: string | number) {
  const numeric = Number(value);
  updateSelectedConfig({
    [key]: Number.isFinite(numeric) ? numeric : 0,
  });
}

function formatJsonConfig(value: unknown, fallback = "") {
  if (typeof value === "string") {
    return value;
  }
  if (value && typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return fallback;
    }
  }
  return fallback;
}

async function loadWorkflow(id: string) {
  loadingWorkflow.value = true;
  loadError.value = null;
  try {
    const response = await $fetch<{
      id: string;
      name: string;
      status: "ACTIVE" | "INACTIVE";
      graphData: { nodes?: Node<NodeData>[]; edges?: Edge[] };
    }>(`/api/workflows/${id}`, {
      credentials: "include",
    });

    workflowId.value = response.id;
    workflowName.value = response.name;
    workflowActive.value = response.status === "ACTIVE";
    nodes.value = Array.isArray(response.graphData?.nodes)
      ? response.graphData.nodes.map((node, index) =>
          normalizeLoadedNode(node as Node<NodeData>, index),
        )
      : [];
    edges.value = Array.isArray(response.graphData?.edges)
      ? response.graphData.edges
      : [];
    selectedNodeId.value = null;
  } catch (error) {
    loadError.value = getErrorMessage(error);
  } finally {
    loadingWorkflow.value = false;
  }
}

watch(
  () => props.workflowId,
  (id) => {
    if (id) {
      void loadWorkflow(id);
    }
  },
  { immediate: true },
);

async function saveWorkflow() {
  saveError.value = null;
  saveSuccess.value = null;

  const name = workflowName.value.trim();
  if (!name) {
    saveError.value = "Workflow name is required.";
    return;
  }

  const triggerType = resolveTriggerType();
  if (!triggerType) {
    saveError.value = "Add a trigger block before saving.";
    return;
  }

  const payload = {
    name,
    status: workflowActive.value ? "ACTIVE" : "INACTIVE",
    triggerType,
    graphData: {
      nodes: nodes.value,
      edges: edges.value,
    },
  };

  saving.value = true;
  try {
    if (workflowId.value) {
      const response = await $fetch<{ id: string }>(
        `/api/workflows/${workflowId.value}`,
        {
          method: "PUT",
          body: payload,
          credentials: "include",
        },
      );
      workflowId.value = response.id ?? workflowId.value;
      saveSuccess.value = "Workflow updated.";
    } else {
      const response = await $fetch<{ id: string }>("/api/workflows", {
        method: "POST",
        body: payload,
        credentials: "include",
      });
      workflowId.value = response.id ?? null;
      saveSuccess.value = "Workflow saved.";
    }
  } catch (error) {
    saveError.value = getErrorMessage(error);
  } finally {
    saving.value = false;
  }
}

function resolveTriggerType() {
  const triggerNode = getTriggerNode();
  const raw = normalizePaletteType(getNodeRawType(triggerNode));
  if (!raw) {
    return null;
  }
  if (raw === "schedule") {
    return "CRON";
  }
  if (raw === "email") {
    return "EMAIL";
  }
  return "WEBHOOK";
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object") {
    const data = (
      error as { data?: { statusMessage?: string; message?: string } }
    ).data;
    if (data?.statusMessage) {
      return data.statusMessage;
    }
    if (data?.message) {
      return data.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unexpected error.";
}
</script>
