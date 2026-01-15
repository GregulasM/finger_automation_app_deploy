<script setup lang="ts">
import { useWorkflowEditorContext } from "../workflowEditorContext";

const { t } = useI18n();
const {
  availableDbModels,
  dbOperationsWithDesc,
  selectedConfig,
  updateTextConfig,
  updateDbArgsTemplate,
  formatJsonConfig,
  getDbArgsPlaceholder,
  getDbArgsExample,
  applyDbArgsTemplate,
  inputStyles,
  textareaStyles,
  formFieldStyles,
} = useWorkflowEditorContext();
</script>

<template>
  <div class="space-y-4">
    <UFormField :label="t('editor.model')" :ui="formFieldStyles">
      <div class="flex flex-wrap gap-1 mb-2">
        <button
          v-for="model in availableDbModels"
          :key="model.value"
          type="button"
          class="px-2 py-1 rounded text-[9px] xs:text-[10px] font-semibold transition-colors"
          :class="
            String(selectedConfig.model ?? '') === model.value
              ? 'bg-orange-500 text-zinc-950'
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
          "
          @click="updateTextConfig('model', model.value)"
        >
          {{ model.label }}
        </button>
      </div>
      <UInput
        :model-value="String(selectedConfig.model ?? '')"
        :placeholder="t('editor.db.modelPlaceholder')"
        :ui="inputStyles"
        @update:model-value="(value) => updateTextConfig('model', String(value))"
      />
      <template #hint>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.db.modelHint") }}
        </span>
      </template>
    </UFormField>

    <UFormField :label="t('editor.operation')" :ui="formFieldStyles">
      <div class="grid grid-cols-3 gap-1">
        <button
          v-for="op in dbOperationsWithDesc"
          :key="op.value"
          type="button"
          class="flex flex-col items-start px-2 py-1.5 rounded text-left transition-colors"
          :class="
            String(selectedConfig.operation ?? 'create') === op.value
              ? 'bg-orange-500 text-zinc-950'
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
          "
          @click="
            updateTextConfig('operation', op.value);
            updateDbArgsTemplate(op.value);
          "
        >
          <span class="text-[9px] xs:text-[10px] font-bold">{{ op.label }}</span>
          <span class="text-[7px] xs:text-[8px] opacity-70">{{ op.desc }}</span>
        </button>
      </div>
    </UFormField>

    <UFormField :label="t('editor.args')" :ui="formFieldStyles">
      <UTextarea
        :model-value="formatJsonConfig(selectedConfig.args, '{}')"
        :placeholder="
          getDbArgsPlaceholder(String(selectedConfig.operation ?? 'create'))
        "
        :ui="textareaStyles"
        :rows="6"
        @update:model-value="(value) => updateTextConfig('args', String(value))"
      />
      <template #hint>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.db.argsHint") }}
        </span>
      </template>
    </UFormField>

    <div class="rounded-lg border border-orange-500/20 bg-zinc-900/50 p-3">
      <div
        class="text-[9px] xs:text-[10px] sm:text-[11px] font-semibold text-zinc-400 mb-2"
      >
        {{ t("editor.db.exampleFor") }} {{ selectedConfig.operation ?? "create" }}:
      </div>
      <pre
        class="text-zinc-300 text-[8px] xs:text-[9px] font-mono whitespace-pre-wrap"
        >{{
          getDbArgsExample(String(selectedConfig.operation ?? "create"))
        }}</pre
      >
      <button
        type="button"
        class="mt-2 text-[9px] xs:text-[10px] text-orange-400 hover:text-orange-300 underline"
        @click="applyDbArgsTemplate(String(selectedConfig.operation ?? 'create'))"
      >
        {{ t("editor.db.useTemplate") }}
      </button>
    </div>

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
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.db.autoDataHint") }}
        </span>
      </div>
    </div>
  </div>
</template>
