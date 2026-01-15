<script setup lang="ts">
import { useWorkflowEditorContext } from "../workflowEditorContext";
import TriggerWebhookSettings from "./TriggerWebhookSettings.vue";
import TriggerScheduleSettings from "./TriggerScheduleSettings.vue";
import TriggerEmailSettings from "./TriggerEmailSettings.vue";

const { selectedType } = useWorkflowEditorContext();
</script>

<template>
  <div class="space-y-4">
    <TriggerWebhookSettings v-if="selectedType === 'Webhook'" />
    <TriggerScheduleSettings v-if="selectedType === 'Schedule'" />
    <TriggerEmailSettings v-if="selectedType === 'Email'" />
  </div>
</template>
