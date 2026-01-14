import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@finger.io" },
    update: {},
    create: {
      email: "demo@finger.io",
      passwordHash,
    },
  });

  const existingWorkflow = await prisma.workflow.findFirst({
    where: { userId: user.id, name: "Demo Webhook to HTTP" },
  });

  const workflow =
    existingWorkflow ??
    (await prisma.workflow.create({
      data: {
        userId: user.id,
        name: "Demo Webhook to HTTP",
        status: "ACTIVE",
        triggerType: "WEBHOOK",
        graphData: {
          nodes: [
            {
              id: "trigger-webhook",
              type: "input",
              position: { x: 0, y: 80 },
              data: { label: "Webhook", type: "Webhook", role: "trigger" },
            },
            {
              id: "http-1",
              position: { x: 260, y: 80 },
              data: {
                label: "HTTP Request",
                type: "HTTP Request",
                role: "action",
                actionType: "HTTP Request",
                order: 1,
                config: { url: "https://example.com", method: "POST" },
              },
            },
          ],
          edges: [
            { id: "edge-1", source: "trigger-webhook", target: "http-1" },
          ],
        },
      },
    }));

  const executionExists = await prisma.execution.findFirst({
    where: { workflowId: workflow.id },
  });

  if (!executionExists) {
    const execution = await prisma.execution.create({
      data: {
        workflowId: workflow.id,
        status: "SUCCESS",
        logs: [
          {
            at: new Date().toISOString(),
            level: "info",
            message: "Seeded execution",
          },
        ],
        startedAt: new Date(),
        finishedAt: new Date(),
      },
    });

    await prisma.executionStep.create({
      data: {
        executionId: execution.id,
        stepKey: "http-1",
        stepOrder: 1,
        status: "SUCCESS",
        input: { hello: "world" },
        output: { ok: true },
        duration: 120,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
