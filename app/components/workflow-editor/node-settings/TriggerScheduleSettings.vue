<script setup lang="ts">
import { useWorkflowEditorContext } from "../workflowEditorContext";

const { t } = useI18n();
const {
  selectedConfig,
  updateTextConfig,
  cronPresets,
  commonTimezones,
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          <div class="font-semibold text-cyan-400 mb-1">
            {{ t("editor.schedule.howItWorks") }}
          </div>
          {{ t("editor.schedule.description") }}
        </div>
      </div>
    </div>

    <UFormField :label="t('editor.cronExpression')" :ui="formFieldStyles">
      <UInput
        :model-value="String(selectedConfig.cron ?? '')"
        placeholder="*/5 * * * *"
        :ui="inputStyles"
        @update:model-value="(value) => updateTextConfig('cron', String(value))"
      />
      <template #hint>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.schedule.cronHint") }}
        </span>
      </template>
    </UFormField>

    <div class="flex flex-wrap gap-1">
      <button
        v-for="preset in cronPresets"
        :key="preset.value"
        type="button"
        class="px-2 py-1 rounded text-[8px] xs:text-[9px] font-semibold transition-colors"
        :class="
          String(selectedConfig.cron ?? '') === preset.value
            ? 'bg-orange-500 text-zinc-950'
            : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
        "
        @click="updateTextConfig('cron', preset.value)"
      >
        {{ preset.label }}
      </button>
    </div>

    <div class="rounded-lg border border-orange-500/20 bg-zinc-900/50 p-3">
      <div
        class="text-[9px] xs:text-[10px] sm:text-[11px] font-semibold text-zinc-400 mb-2"
      >
        {{ t("editor.schedule.cronFormat") }}
      </div>
      <div class="font-mono text-[9px] xs:text-[10px] text-orange-400 mb-2">
        ┌───────────── {{ t("editor.schedule.minute") }} (0-59)<br />
        │ ┌─────────── {{ t("editor.schedule.hour") }} (0-23)<br />
        │ │ ┌───────── {{ t("editor.schedule.dayMonth") }} (1-31)<br />
        │ │ │ ┌─────── {{ t("editor.schedule.month") }} (1-12)<br />
        │ │ │ │ ┌───── {{ t("editor.schedule.dayWeek") }} (0-6)<br />
        * * * * *
      </div>
      <div class="text-zinc-500 text-[8px] xs:text-[9px] space-y-1">
        <div>
          <code class="text-orange-400">*</code> —
          {{ t("editor.schedule.any") }}
        </div>
        <div>
          <code class="text-orange-400">*/5</code> —
          {{ t("editor.schedule.every5") }}
        </div>
        <div>
          <code class="text-orange-400">0,30</code> —
          {{ t("editor.schedule.specific") }}
        </div>
      </div>
    </div>

    <UFormField :label="t('editor.timezone')" :ui="formFieldStyles">
      <div class="flex gap-2">
        <UInput
          :model-value="String(selectedConfig.timezone ?? 'UTC')"
          placeholder="UTC"
          :ui="inputStyles"
          class="flex-1"
          @update:model-value="
            (value) => updateTextConfig('timezone', String(value))
          "
        />
      </div>
      <template #hint>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.schedule.timezoneHint") }}
        </span>
      </template>
    </UFormField>

    <div class="flex flex-wrap gap-1">
      <button
        v-for="tz in commonTimezones"
        :key="tz"
        type="button"
        class="px-2 py-1 rounded text-[8px] xs:text-[9px] font-semibold transition-colors"
        :class="
          String(selectedConfig.timezone ?? 'UTC') === tz
            ? 'bg-orange-500 text-zinc-950'
            : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
        "
        @click="updateTextConfig('timezone', tz)"
      >
        {{ tz }}
      </button>
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
          {{ t("editor.schedule.dataFlowHint") }}
        </span>
      </div>
    </div>
  </div>
</template>
