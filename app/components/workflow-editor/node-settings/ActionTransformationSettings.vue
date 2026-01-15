<script setup lang="ts">
import { useWorkflowEditorContext } from "../workflowEditorContext";

const { t } = useI18n();
const {
  transformMode,
  expressionExamples,
  mappingFields,
  addMappingField,
  removeMappingField,
  updateMappingField,
  formatJsonConfig,
  updateTextConfig,
  selectedConfig,
  inputStyles,
  textareaStyles,
  formFieldStyles,
} = useWorkflowEditorContext();
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-3">
      <span
        class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px] font-semibold"
      >
        {{ t("editor.transform.mode") }}:
      </span>
      <div class="flex gap-1">
        <button
          type="button"
          class="px-2 py-1 rounded text-[9px] xs:text-[10px] font-semibold transition-colors"
          :class="
            transformMode === 'expression'
              ? 'bg-orange-500 text-zinc-950'
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
          "
          @click="transformMode = 'expression'"
        >
          {{ t("editor.transform.expression") }}
        </button>
        <button
          type="button"
          class="px-2 py-1 rounded text-[9px] xs:text-[10px] font-semibold transition-colors"
          :class="
            transformMode === 'mapping'
              ? 'bg-orange-500 text-zinc-950'
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
          "
          @click="transformMode = 'mapping'"
        >
          {{ t("editor.transform.mapping") }}
        </button>
      </div>
    </div>

    <template v-if="transformMode === 'expression'">
      <UFormField :label="t('editor.expression')" :ui="formFieldStyles">
        <UTextarea
          :model-value="String(selectedConfig.expression ?? '')"
          :placeholder="t('editor.transform.expressionPlaceholder')"
          :ui="textareaStyles"
          :rows="4"
          @update:model-value="
            (value) => updateTextConfig('expression', String(value))
          "
        />
        <template #hint>
          <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
            {{ t("editor.transform.expressionHint") }}
          </span>
        </template>
      </UFormField>

      <div class="rounded-lg border border-orange-500/20 bg-zinc-900/50 p-3">
        <div
          class="text-[9px] xs:text-[10px] sm:text-[11px] font-semibold text-zinc-400 mb-2"
        >
          {{ t("editor.transform.examples") }}:
        </div>
        <div class="space-y-2">
          <button
            v-for="(example, idx) in expressionExamples"
            :key="idx"
            type="button"
            class="w-full text-left p-2 rounded bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
            @click="updateTextConfig('expression', example.code)"
          >
            <div class="text-[8px] xs:text-[9px] text-zinc-500 mb-1">
              {{ example.desc }}
            </div>
            <code class="text-[8px] xs:text-[9px] text-orange-400 font-mono">{{
              example.code
            }}</code>
          </button>
        </div>
      </div>
    </template>

    <template v-if="transformMode === 'mapping'">
      <UFormField :label="t('editor.mapping')" :ui="formFieldStyles">
        <UTextarea
          :model-value="formatJsonConfig(selectedConfig.mapping, '{}')"
          :placeholder="t('editor.transform.mappingPlaceholder')"
          :ui="textareaStyles"
          :rows="6"
          @update:model-value="
            (value) => updateTextConfig('mapping', String(value))
          "
        />
        <template #hint>
          <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
            {{ t("editor.transform.mappingHint") }}
          </span>
        </template>
      </UFormField>

      <div class="rounded-lg border border-orange-500/20 bg-zinc-900/50 p-3">
        <div
          class="text-[9px] xs:text-[10px] sm:text-[11px] font-semibold text-zinc-400 mb-2"
        >
          {{ t("editor.transform.mappingBuilder") }}:
        </div>
        <div class="space-y-2">
          <div
            v-for="(field, idx) in mappingFields"
            :key="idx"
            class="flex gap-2 items-center"
          >
            <UInput
              :model-value="field.key"
              placeholder="outputField"
              :ui="{
                ...inputStyles,
                base: inputStyles.base + ' text-[9px]',
              }"
              class="flex-1"
              @update:model-value="(v) => updateMappingField(idx, 'key', String(v))"
            />
            <span class="text-zinc-500">←</span>
            <UInput
              :model-value="field.value"
              placeholder="input.fieldPath"
              :ui="{
                ...inputStyles,
                base: inputStyles.base + ' text-[9px]',
              }"
              class="flex-1"
              @update:model-value="
                (v) => updateMappingField(idx, 'value', String(v))
              "
            />
            <button
              type="button"
              class="p-1 text-red-400 hover:text-red-300"
              @click="removeMappingField(idx)"
            >
              <svg
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <button
            type="button"
            class="text-[9px] xs:text-[10px] text-orange-400 hover:text-orange-300"
            @click="addMappingField"
          >
            + {{ t("editor.transform.addField") }}
          </button>
        </div>
      </div>
    </template>

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
          {{ t("editor.transform.dataFlowHint") }}
        </span>
      </div>
    </div>
  </div>
</template>
