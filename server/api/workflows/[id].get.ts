import { createError, getRouterParam } from "h3";
import { prisma } from "../../../app/lib/prisma";
import { requireAuthUser } from "../../utils/auth";

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
  });

  if (!workflow || workflow.userId !== authUser.id) {
    throw createError({
      statusCode: 404,
      statusMessage: "Workflow not found",
    });
  }

  return {
    id: workflow.id,
    name: workflow.name,
    status: workflow.status,
    triggerType: workflow.triggerType,
    graphData: workflow.graphData,
    createdAt: workflow.createdAt,
    updatedAt: workflow.updatedAt,
  };
});
