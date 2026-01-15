<template>
  <div
    class="fixed inset-0 bg-zinc-950 flex flex-col pt-12 4xs:pt-12 3xs:pt-13 2xs:pt-14 xs:pt-14 sm:pt-14 md:pt-16 lg:pt-16 xl:pt-18 2xl:pt-20 3xl:pt-24 4xl:pt-28 5xl:pt-32"
  >
    <div
      class="flex-1 flex flex-col px-1 4xs:px-2 3xs:px-3 xs:px-4 pb-2 overflow-hidden"
    >
      <div class="flex-1 overflow-hidden min-h-0">
        <WorkflowEditor :workflow-id="workflowId" :key="editorKey" />
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
const editorKey = computed(() => {
  if (workflowId.value) {
    return `workflow-${workflowId.value}`;
  }
  const newKey =
    typeof route.query.new === "string" && route.query.new.trim()
      ? route.query.new
      : "blank";
  return `new-${newKey}`;
});
</script>
