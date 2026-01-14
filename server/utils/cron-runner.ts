import CronParser from "cron-parser";
import { prisma } from "../../app/lib/prisma";
import { enqueueWorkflow } from "./workflow-queue";

type CronRunResult = {
  queued: number;
  executions: Array<{ workflowId: string; executionId: string }>;
};

export async function runCronWorkflows(
  payload: unknown = {},
): Promise<CronRunResult> {
  const workflows = await prisma.workflow.findMany({
    where: {
      status: "ACTIVE",
      triggerType: "CRON",
    },
    select: {
      id: true,
      graphData: true,
      executions: {
        select: { startedAt: true },
        orderBy: { startedAt: "desc" },
        take: 1,
      },
    },
  });

  const now = new Date();

  const executions = await Promise.all(
    workflows.map(async (workflow) => {
      if (
        !isCronDue(
          workflow.graphData,
          now,
          workflow.executions[0]?.startedAt ?? null,
        )
      ) {
        return null;
      }

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
  if (!trigger) {
    return true;
  }

  try {
    const interval = CronParser.parseExpression(trigger.cron, {
      currentDate: now,
      tz: trigger.timezone || undefined,
    });
    const previous = interval.prev().toDate();

    if (lastRunAt && lastRunAt >= previous) {
      return false;
    }

    return previous <= now;
  } catch (error) {
    console.warn("Invalid cron expression", trigger.cron, error);
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

  const triggerNode = data.nodes
    .map((node) => node as Record<string, unknown>)
    .find((node) => {
      const nodeData = (node.data ?? {}) as Record<string, unknown>;
      const role = String(nodeData.role ?? "").toLowerCase();
      const type = String(nodeData.type ?? node.type ?? "").toLowerCase();
      return role === "trigger" && (type === "schedule" || type === "cron");
    });

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
