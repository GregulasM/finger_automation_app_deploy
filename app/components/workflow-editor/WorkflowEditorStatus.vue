<script setup lang="ts">
import { useWorkflowEditorContext } from "./workflowEditorContext";

const { t } = useI18n();
const { saving, loadingWorkflow, saveError, loadError } =
  useWorkflowEditorContext();
</script>

<template>
  <div v-if="saving || loadingWorkflow" class="px-1">
    <div
      class="relative h-[3px] w-full overflow-hidden rounded-full bg-zinc-700/60 after:absolute after:left-0 after:top-0 after:bottom-0 after:w-[45%] after:rounded-full after:content-[''] after:bg-gradient-to-r after:from-transparent after:via-orange-500/80 after:to-transparent after:animate-[loading-bar-slide_1.2s_ease-in-out_infinite]"
    ></div>
  </div>

  <UAlert
    v-if="saveError"
    color="error"
    variant="soft"
    :title="t('editor.saveFailed')"
    :description="saveError"
    :ui="{ root: 'ring-0 py-1 text-xs' }"
  />
  <UAlert
    v-if="loadError"
    color="error"
    variant="soft"
    :title="t('editor.loadFailed')"
    :description="loadError"
    :ui="{ root: 'ring-0 py-1 text-xs' }"
  />
</template>
