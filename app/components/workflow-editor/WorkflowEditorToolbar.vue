<script setup lang="ts">
import { useWorkflowEditorContext } from "./workflowEditorContext";

const { t } = useI18n();
const {
  editorPanelOpen,
  workflowName,
  workflowActive,
  titleInputStyles,
  templateItems,
  triggerLabel,
  saving,
  loadingWorkflow,
  saveWorkflow,
} = useWorkflowEditorContext();
</script>

<template>
  <div
    :class="[
      'flex flex-col lg:flex-row flex-wrap items-stretch lg:items-center justify-between gap-2 border border-orange-500/30 transition not-lg:mx-10',
      'px-1 4xs:px-2 xs:px-3 py-1 4xs:py-1.5 xs:py-2 lg:px-2 4xs:lg:px-3 lg:py-2',
      'rounded-b-lg lg:rounded-lg',
      'bg-zinc-900/95 backdrop-blur-sm lg:bg-zinc-800/90 lg:backdrop-blur-0',
      'fixed lg:static inset-x-0 top-12 4xs:top-12 3xs:top-13 2xs:top-14 xs:top-14 sm:top-14 md:top-16 z-40 lg:z-auto',
      'shadow-lg lg:shadow-none',
      'max-h-[70vh] overflow-y-auto lg:max-h-none lg:overflow-visible',
      editorPanelOpen ? 'flex' : 'hidden',
      'lg:flex',
    ]"
  >
    <div
      class="flex flex-1 min-w-0 flex-col 2xs:flex-row flex-wrap items-start 2xs:items-center gap-3"
    >
      <UInput
        v-model="workflowName"
        :placeholder="t('editor.workflowName')"
        class="w-full 2xs:w-auto lg:min-w-[320px] flex-1"
        :ui="titleInputStyles"
      />
      <div
        class="flex items-center gap-2 text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
      >
        <USwitch v-model="workflowActive" :ui="{ root: 'ring-0' }" />
        <span>{{ t("editor.active") }}</span>
      </div>
    </div>
    <div
      class="flex flex-wrap items-center gap-2 justify-end mt-2 sm:mt-0 w-full lg:w-auto"
    >
      <UBadge
        color="neutral"
        variant="soft"
        :ui="{
          root: 'ring-0',
          base: 'bg-zinc-800 border-orange-500/30 text-zinc-100',
        }"
      >
        {{ t("editor.trigger") }}: {{ triggerLabel }}
      </UBadge>

      <UDropdownMenu
        :items="templateItems"
        :content="{ align: 'end' }"
        :ui="{
          content: 'min-w-[220px] bg-zinc-800 border border-orange-500/30 p-1',
          item: 'text-zinc-100 hover:bg-zinc-700 data-highlighted:bg-zinc-700 rounded px-3 py-2 cursor-pointer',
          itemLeadingIcon: 'text-zinc-400',
          label: 'text-zinc-100 font-medium',
        }"
      >
        <button
          type="button"
          class="rounded-md border border-orange-500/30 bg-zinc-800/90 px-3 4xs:px-4 py-2 4xs:py-2.5 text-zinc-100 transition hover:border-orange-500/70 hover:bg-zinc-800 flex items-center gap-1"
        >
          <svg
            class="w-3 h-3 4xs:w-4 4xs:h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>
          <span
            class="hidden xs:inline text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold"
          >
            {{ t("editor.templates") }}
          </span>
        </button>
      </UDropdownMenu>

      <button
        type="button"
        :disabled="saving || loadingWorkflow"
        class="rounded-md border border-orange-500 bg-orange-500 px-2 2xs:px-3 xs:px-4 py-1 3xs:py-2 text-zinc-950 transition hover:brightness-110 disabled:opacity-50"
        @click="saveWorkflow"
      >
        <span
          class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold"
        >
          <span v-if="saving || loadingWorkflow">{{ t("editor.saving") }}</span>
          <span v-else>{{ t("editor.save") }}</span>
        </span>
      </button>
    </div>
  </div>
</template>
