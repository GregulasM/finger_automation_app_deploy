<script setup lang="ts">
import { provideWorkflowEditorContext } from "./workflow-editor/workflowEditorContext";
import { useWorkflowEditor } from "./workflow-editor/useWorkflowEditor";
import WorkflowEditorStatus from "./workflow-editor/WorkflowEditorStatus.vue";
import WorkflowEditorToolbar from "./workflow-editor/WorkflowEditorToolbar.vue";
import WorkflowEditorWorkspace from "./workflow-editor/WorkflowEditorWorkspace.vue";

const props = defineProps<{ workflowId?: string | null }>();
const context = useWorkflowEditor(props);

provideWorkflowEditorContext(context);
</script>

<template>
  <div class="h-full flex flex-col space-y-1 4xs:space-y-2 not-lg:space-y-0">
    <WorkflowEditorToolbar />
    <WorkflowEditorStatus />
    <WorkflowEditorWorkspace />
  </div>
</template>

<style scoped>
:deep([data-slot="base"]:focus),
:deep(input[data-slot="base"]:focus),
:deep(textarea[data-slot="base"]:focus),
:deep(select[data-slot="base"]:focus) {
  --tw-ring-width: 2px !important;
  --tw-ring-color: rgb(249 115 22) !important;
  --tw-ring-inset: inset !important;
  box-shadow: inset 0 0 0 2px rgb(249 115 22) !important;
}

:deep([data-slot="base"]:focus-visible),
:deep(input[data-slot="base"]:focus-visible),
:deep(textarea[data-slot="base"]:focus-visible),
:deep(select[data-slot="base"]:focus-visible) {
  --tw-ring-width: 2px !important;
  --tw-ring-color: rgb(249 115 22) !important;
  --tw-ring-inset: inset !important;
  box-shadow: inset 0 0 0 2px rgb(249 115 22) !important;
}

:deep(.vue-flow__node),
:deep(.vue-flow__node.vue-flow__node-default),
:deep(.vue-flow__node.nopan),
:deep(.vue-flow__node.draggable),
:deep(.vue-flow__node.selectable) {
  background-color: rgb(249 115 22) !important;
  color: rgb(9 9 11) !important;
  border-radius: 8px !important;
  padding: 10px 16px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  transition: background-color 0.15s ease !important;
}

:deep(.vue-flow__node:hover) {
  background-color: rgb(251, 146, 60) !important;
}

:deep(.vue-flow__node.selected) {
  background-color: rgb(234, 88, 12) !important;
}

:deep(.vue-flow__node *),
:deep(.vue-flow__node.vue-flow__node-default *) {
  color: rgb(9 9 11) !important;
}

:deep(.vue-flow__edge-path) {
  stroke: rgb(249 115 22) !important;
  stroke-width: 2px !important;
}

:deep(.vue-flow__edge.selected .vue-flow__edge-path),
:deep(.custom-edge.edge-selected) {
  stroke: rgb(251 146 60) !important;
  stroke-width: 3px !important;
}

:deep(.custom-node) {
  position: relative;
  background-color: rgb(249 115 22);
  color: rgb(9 9 11);
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 600;
  min-width: 120px;
  text-align: center;
}

:deep(.custom-node .node-label) {
  color: rgb(9 9 11);
  font-weight: 600;
}

:deep(.handle-input) {
  width: 14px !important;
  height: 14px !important;
  background-color: rgb(34 197 94) !important;
  border: 2px solid rgb(22 163 74) !important;
  border-radius: 50% !important;
  cursor: crosshair !important;
}

:deep(.handle-input::before) {
  content: "IN";
  position: absolute;
  left: -24px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 8px;
  font-weight: 700;
  color: rgb(34 197 94);
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}

:deep(.handle-output) {
  width: 14px !important;
  height: 14px !important;
  background-color: rgb(59 130 246) !important;
  border: 2px solid rgb(37 99 235) !important;
  border-radius: 50% !important;
  cursor: crosshair !important;
}

:deep(.handle-output::after) {
  content: "OUT";
  position: absolute;
  right: -28px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 8px;
  font-weight: 700;
  color: rgb(59 130 246);
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}

:deep(.edge-delete-button) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: rgb(239 68 68);
  border-radius: 50%;
  cursor: pointer;
  opacity: 0;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  z-index: 100;
}

:deep(.edge-delete-button:hover) {
  background-color: rgb(220 38 38);
  transform: scale(1.1);
}

:deep(.edge-delete-button.visible) {
  opacity: 1;
}

:deep(.edge-delete-button svg) {
  color: white;
}

:deep(.vue-flow__edge:hover + .edge-delete-button),
:deep(.vue-flow__edge.selected + .edge-delete-button) {
  opacity: 1;
}

:deep(.vue-flow__handle) {
  width: 14px !important;
  height: 14px !important;
  border-radius: 50% !important;
}

:deep(.vue-flow__handle-left),
:deep(.vue-flow__handle[data-handlepos="left"]) {
  background-color: rgb(34 197 94) !important;
  border: 2px solid rgb(22 163 74) !important;
}

:deep(.vue-flow__handle-right),
:deep(.vue-flow__handle[data-handlepos="right"]) {
  background-color: rgb(59 130 246) !important;
  border: 2px solid rgb(37 99 235) !important;
}

:deep(.vue-flow__handle-top),
:deep(.vue-flow__handle[data-handlepos="top"]) {
  background-color: rgb(34 197 94) !important;
  border: 2px solid rgb(22 163 74) !important;
}

:deep(.vue-flow__handle-bottom),
:deep(.vue-flow__handle[data-handlepos="bottom"]) {
  background-color: rgb(59 130 246) !important;
  border: 2px solid rgb(37 99 235) !important;
}
</style>
