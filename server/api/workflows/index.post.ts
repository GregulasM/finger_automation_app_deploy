import { prisma } from "../../../app/lib/prisma";
import { requireAuthUser } from "../../utils/auth";
import { readValidatedBody, workflowSaveSchema } from "../../utils/validation";

export default defineEventHandler(async (event) => {
  const authUser = await requireAuthUser(event);
  const body = await readValidatedBody(event, workflowSaveSchema);

  const workflow = await prisma.workflow.create({
    data: {
      userId: authUser.id,
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
