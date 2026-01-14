import { createError, getRouterParam } from "h3";
import { prisma } from "../../../../app/lib/prisma";
import { requireAuthUser } from "../../../utils/auth";

export default defineEventHandler(async (event) => {
  const workflowId = getRouterParam(event, "id");
  if (!workflowId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing workflow id",
    });
  }

  const authUser = await requireAuthUser(event);

  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
    select: { userId: true },
  });

  if (!workflow || workflow.userId !== authUser.id) {
    throw createError({
      statusCode: 404,
      statusMessage: "Workflow not found",
    });
  }

  const executions = await prisma.execution.findMany({
    where: { workflowId },
    select: { status: true, startedAt: true, finishedAt: true },
  });

  const total = executions.length;
  const statusCounts = executions.reduce(
    (acc, execution) => {
      acc[execution.status] = (acc[execution.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const durations = executions
    .filter((execution) => execution.finishedAt)
    .map((execution) =>
      execution.finishedAt
        ? execution.finishedAt.getTime() - execution.startedAt.getTime()
        : 0,
    )
    .filter((duration) => duration > 0);

  const avgDurationMs = durations.length
    ? Math.round(
        durations.reduce((sum, value) => sum + value, 0) / durations.length,
      )
    : 0;

  const lastRun = executions
    .slice()
    .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())[0];

  return {
    total,
    statusCounts,
    successRate: total ? (statusCounts.SUCCESS ?? 0) / total : 0,
    avgDurationMs,
    lastRunAt: lastRun?.startedAt ?? null,
    lastStatus: lastRun?.status ?? null,
  };
});
