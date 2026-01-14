import { createError, getRouterParam } from "h3";
import { prisma } from "../../../app/lib/prisma";
import { requireAuthUser } from "../../utils/auth";
import { readValidatedBody, workflowSaveSchema } from "../../utils/validation";

export default defineEventHandler(async (event) => {
  const workflowId = getRouterParam(event, "id");
  if (!workflowId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing workflow id",
    });
  }

  const authUser = await requireAuthUser(event);
  const body = await readValidatedBody(event, workflowSaveSchema);

  const existing = await prisma.workflow.findUnique({
    where: { id: workflowId },
    select: { userId: true },
  });

  if (!existing || existing.userId !== authUser.id) {
    throw createError({
      statusCode: 404,
      statusMessage: "Workflow not found",
    });
  }

  const workflow = await prisma.workflow.update({
    where: { id: workflowId },
    data: {
      name: body.name,
      status: body.status,
      triggerType: body.triggerType,
      graphData: body.graphData,
    },
  });

  return {
    id: workflow.id,
    name: workflow.name,
    status: workflow.status,
    triggerType: workflow.triggerType,
  };
});
