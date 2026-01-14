import type { WorkflowJobData } from "./workflow-job";
import { getQStashClient } from "./qstash";
import { processWorkflowJob } from "./workflow-runner";

export async function enqueueWorkflow(payload: WorkflowJobData) {
  const config = useRuntimeConfig();
  const appUrl = config.public?.appUrl as string | undefined;
  const token = config.qstashToken as string | undefined;

  if (!token || !appUrl) {
    void processWorkflowJob(payload).catch((error) => {
      console.warn("Workflow execution failed", error);
    });
    return;
  }

  const url = new URL("/api/workflows/execute", appUrl).toString();
  const client = getQStashClient();
  const deduplicationId =
    payload.executionId ??
    `${payload.workflowId}:${payload.source}:${Date.now()}`;

  await client.publishJSON({
    url,
    body: payload,
    retries: 3,
    deduplicationId,
  });
}
