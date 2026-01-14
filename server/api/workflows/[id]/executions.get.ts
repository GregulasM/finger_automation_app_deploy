import { createError, getQuery, getRouterParam } from "h3";
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

  const query = getQuery(event);
  const limit = Math.min(Number(query.limit ?? 20), 100);

  const executions = await prisma.execution.findMany({
    where: { workflowId },
    orderBy: { startedAt: "desc" },
    take: Number.isFinite(limit) ? limit : 20,
    include: {
      steps: {
        orderBy: { stepOrder: "asc" },
      },
    },
  });

  return executions;
});
