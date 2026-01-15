<script setup lang="ts">
import { useWorkflowEditorContext } from "../workflowEditorContext";
import ActionHttpSettings from "./ActionHttpSettings.vue";
import ActionEmailSettings from "./ActionEmailSettings.vue";
import ActionTelegramSettings from "./ActionTelegramSettings.vue";
import ActionDatabaseSettings from "./ActionDatabaseSettings.vue";
import ActionTransformationSettings from "./ActionTransformationSettings.vue";
import ActionErrorHandling from "./ActionErrorHandling.vue";

const { selectedActionType } = useWorkflowEditorContext();
</script>

<template>
  <div class="space-y-4">
    <ActionHttpSettings v-if="selectedActionType === 'HTTP Request'" />
    <ActionEmailSettings v-if="selectedActionType === 'Email'" />
    <ActionTelegramSettings v-if="selectedActionType === 'Telegram'" />
    <ActionDatabaseSettings v-if="selectedActionType === 'Database'" />
    <ActionTransformationSettings
      v-if="selectedActionType === 'Transformation'"
    />
    <ActionErrorHandling />
  </div>
</template>
