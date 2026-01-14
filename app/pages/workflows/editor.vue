<template>
  <div class="space-y-4 px-6 py-8">
    <div>
      <h1 class="text-2xl font-semibold text-slate-900">Workflow Editor</h1>
      <p class="text-sm text-slate-500">
        Build and configure your automation flow.
      </p>
    </div>
    <WorkflowEditor :workflow-id="workflowId" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const route = useRoute();
const workflowId = computed(() =>
  typeof route.query.workflowId === "string" ? route.query.workflowId : null,
);
</script>
