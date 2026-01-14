<template>
  <div class="fixed inset-0 bg-zinc-950 flex flex-col pt-12 4xs:pt-12 3xs:pt-13 2xs:pt-14 xs:pt-14 sm:pt-14 md:pt-16 lg:pt-16">
    <div class="flex-1 flex flex-col px-1 4xs:px-2 3xs:px-3 xs:px-4 pb-2 overflow-hidden">
      <div class="flex-1 overflow-hidden min-h-0">
        <WorkflowEditor :workflow-id="workflowId" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const route = useRoute();
const workflowId = computed(() =>
  typeof route.query.workflowId === "string" ? route.query.workflowId : null,
);
</script>
