import { inject, provide } from "vue";
import type { InjectionKey } from "vue";
import type { WorkflowEditorContext } from "./useWorkflowEditor";

const workflowEditorKey: InjectionKey<WorkflowEditorContext> = Symbol(
  "workflowEditor",
);

export function provideWorkflowEditorContext(context: WorkflowEditorContext) {
  provide(workflowEditorKey, context);
}

export function useWorkflowEditorContext() {
  const context = inject(workflowEditorKey);
  if (!context) {
    throw new Error("WorkflowEditorContext is not provided");
  }
  return context;
}
