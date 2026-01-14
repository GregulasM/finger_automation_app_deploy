import { createError, getRouterParam, readBody } from "h3";
import { prisma } from "../../../app/lib/prisma";
import { enqueueWorkflow } from "../../utils/workflow-queue";

export default defineEventHandler(async (event) => {
  const workflowId = getRouterParam(event, "workflowId");
  if (!workflowId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing workflowId",
    });
  }

  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
  });

  if (!workflow || workflow.status !== "ACTIVE") {
    throw createError({
      statusCode: 404,
      statusMessage: "Workflow not found",
    });
  }

  if (workflow.triggerType !== "WEBHOOK") {
    throw createError({
      statusCode: 400,
      statusMessage: "Workflow trigger type is not webhook",
    });
  }

  const payload = await readBody(event);

  const execution = await prisma.execution.create({
    data: {
      workflowId: workflow.id,
      status: "PENDING",
      logs: [
        {
          at: new Date().toISOString(),
          level: "info",
          message: "Webhook received",
        },
      ],
    },
  });

  await enqueueWorkflow({
    workflowId: workflow.id,
    executionId: execution.id,
    payload,
    source: "webhook",
  });

  return { queued: true, executionId: execution.id };
});
