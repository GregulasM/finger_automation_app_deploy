<script setup lang="ts">
import { useWorkflowEditorContext } from "../workflowEditorContext";

const { t } = useI18n();
const {
  webhookEndpoint,
  copyToClipboard,
  clipboardCopied,
  workflowId,
  saving,
  saveWorkflow,
  inputStyles,
  formFieldStyles,
} = useWorkflowEditorContext();
</script>

<template>
  <div class="space-y-4">
    <div class="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
      <div class="flex items-start gap-2">
        <svg
          class="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <div class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          <div class="font-semibold text-cyan-400 mb-1">
            {{ t("editor.webhook.howItWorks") }}
          </div>
          {{ t("editor.webhook.description") }}
        </div>
      </div>
    </div>

    <UFormField :label="t('editor.webhookUrl')" :ui="formFieldStyles">
      <div class="flex gap-2">
        <UInput
          :model-value="webhookEndpoint"
          :placeholder="t('editor.saveToGenerateWebhook')"
          readonly
          :ui="inputStyles"
          class="flex-1"
        />
        <button
          v-if="webhookEndpoint"
          type="button"
          class="px-3 py-2 rounded-md border border-orange-500/50 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition text-[9px] xs:text-[10px] font-semibold"
          @click="copyToClipboard(webhookEndpoint)"
        >
          {{ clipboardCopied === "webhook" ? "✓" : t("editor.webhook.copy") }}
        </button>
      </div>
      <template #hint>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.webhook.urlHint") }}
        </span>
      </template>
    </UFormField>

    <div v-if="!workflowId" class="flex items-center gap-3">
      <button
        type="button"
        :disabled="saving"
        class="rounded-md border border-orange-500 bg-orange-500 px-4 py-2 text-zinc-950 transition hover:brightness-110 disabled:opacity-50"
        @click="saveWorkflow"
      >
        <span class="text-[9px] xs:text-[10px] sm:text-[11px] font-semibold">
          {{
            saving ? t("editor.saving") : t("editor.webhook.generate")
          }}
        </span>
      </button>
      <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
        {{ t("editor.webhook.saveFirst") }}
      </span>
    </div>

    <div class="rounded-lg border border-orange-500/20 bg-zinc-900/50 p-3">
      <div
        class="text-[9px] xs:text-[10px] sm:text-[11px] font-semibold text-zinc-400 mb-2"
      >
        {{ t("editor.webhook.usageExamples") }}
      </div>
      <div class="space-y-2">
        <div class="text-[8px] xs:text-[9px] text-zinc-500">cURL:</div>
        <code
          class="block text-[8px] xs:text-[9px] text-orange-400 font-mono bg-zinc-800/50 p-2 rounded break-all"
        >
          curl -X POST {{ webhookEndpoint || "YOUR_URL" }} -H
          "Content-Type: application/json" -d '{"data": "test"}'
        </code>
      </div>
    </div>

    <div class="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
      <div class="flex items-start gap-2">
        <svg
          class="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.webhook.dataFlowHint") }}
        </span>
      </div>
    </div>
  </div>
</template>
