import { CronExpressionParser } from "cron-parser";
import { prisma } from "../../app/lib/prisma";
import { enqueueWorkflow } from "./workflow-queue";

type CronRunResult = {
  queued: number;
  executions: Array<{ workflowId: string; executionId: string }>;
};

export async function runCronWorkflows(
  payload: unknown = {},
): Promise<CronRunResult> {
  // Get ALL active workflows and check graphData for cron triggers
  // This allows workflows to have multiple trigger types
  const allActiveWorkflows = await prisma.workflow.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      graphData: true,
      triggerType: true,
      executions: {
        select: { startedAt: true },
        orderBy: { startedAt: "desc" },
        take: 1,
      },
    },
  });

  // Filter workflows that have a cron/schedule trigger in their graphData
  const workflows = allActiveWorkflows.filter((workflow) => {
    const cronTrigger = extractCronTrigger(workflow.graphData);
    return cronTrigger !== null && cronTrigger.cron;
  });

  const now = new Date();

  const executions = await Promise.all(
    workflows.map(async (workflow) => {
      const lastRun = workflow.executions[0]?.startedAt ?? null;
      const isDue = isCronDue(workflow.graphData, now, lastRun);

      if (!isDue) {
        return null;
      }

      console.log(`[Cron Runner] Triggering workflow "${workflow.name}"`);

      const execution = await prisma.execution.create({
        data: {
          workflowId: workflow.id,
          status: "PENDING",
          logs: [
            {
              at: new Date().toISOString(),
              level: "info",
              message: "Cron trigger received",
            },
          ],
        },
      });

      await enqueueWorkflow({
        workflowId: workflow.id,
        executionId: execution.id,
        payload: {
          scheduledAt: new Date().toISOString(),
          payload,
        },
        source: "cron",
      });

      return { workflowId: workflow.id, executionId: execution.id };
    }),
  );

  const filteredExecutions = executions.filter(
    (execution): execution is { workflowId: string; executionId: string } =>
      execution !== null,
  );

  return { queued: filteredExecutions.length, executions: filteredExecutions };
}

function isCronDue(graphData: unknown, now: Date, lastRunAt: Date | null) {
  const trigger = extractCronTrigger(graphData);
  if (!trigger || !trigger.cron) {
    return false;
  }

  try {
    // cron-parser v5 uses CronExpressionParser.parse()
    const expression = CronExpressionParser.parse(trigger.cron, {
      currentDate: now,
      tz: trigger.timezone || undefined,
    });
    
    const previous = expression.prev().toDate();

    // If we've already run after the previous scheduled time, don't run again
    if (lastRunAt && lastRunAt >= previous) {
      return false;
    }

    return previous <= now;
  } catch (error) {
    console.error("[Cron Runner] Invalid cron expression:", trigger.cron, error);
    return false;
  }
}

function extractCronTrigger(graphData: unknown) {
  if (!graphData || typeof graphData !== "object") {
    return null;
  }
  const data = graphData as Record<string, unknown>;
  if (!Array.isArray(data.nodes)) {
    return null;
  }

  // Get all connected node IDs (nodes that have outgoing edges)
  const edges = Array.isArray(data.edges) ? data.edges : [];
  const connectedNodeIds = new Set(
    edges.map((e) => String((e as Record<string, unknown>).source))
  );

  const triggerNode = data.nodes
    .map((node) => node as Record<string, unknown>)
    .find((node) => {
      const nodeId = String(node.id ?? "");
      const nodeData = (node.data ?? {}) as Record<string, unknown>;
      const role = String(nodeData.role ?? "").toLowerCase();
      const type = String(nodeData.type ?? node.type ?? "").toLowerCase();
      // Trigger must be schedule/cron AND must have at least one outgoing edge
      return role === "trigger" && (type === "schedule" || type === "cron") && connectedNodeIds.has(nodeId);
    });

  if (!triggerNode) {
    return null;
  }

  const nodeData = (triggerNode?.data ?? {}) as Record<string, unknown>;
  const config = (nodeData.config ?? nodeData) as Record<string, unknown>;
  const cron = typeof config.cron === "string" ? config.cron.trim() : "";
  
  if (!cron) {
    return null;
  }

  const timezone =
    typeof config.timezone === "string" ? config.timezone.trim() : "";

  return { cron, timezone };
}
