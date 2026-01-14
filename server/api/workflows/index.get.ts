import { prisma } from "../../../app/lib/prisma";
import { requireAuthUser } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const authUser = await requireAuthUser(event);

  const workflows = await prisma.workflow.findMany({
    where: { userId: authUser.id },
    orderBy: { updatedAt: "desc" },
    include: {
      executions: {
        select: { status: true, startedAt: true, finishedAt: true },
        orderBy: { startedAt: "desc" },
        take: 1,
      },
    },
  });

  return workflows.map((workflow) => ({
    id: workflow.id,
    name: workflow.name,
    status: workflow.status,
    triggerType: workflow.triggerType,
    createdAt: workflow.createdAt,
    updatedAt: workflow.updatedAt,
    lastRun: workflow.executions[0]?.startedAt ?? null,
    lastStatus: workflow.executions[0]?.status ?? null,
  }));
});
