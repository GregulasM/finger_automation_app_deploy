import { runCronWorkflows } from "../utils/cron-runner";

type CronGlobals = typeof globalThis & {
  workflowCronInterval?: NodeJS.Timeout;
  workflowCronRunning?: boolean;
};

export default defineNitroPlugin(() => {
  const globalForCron = globalThis as CronGlobals;

  if (globalForCron.workflowCronInterval) {
    return;
  }

  const tick = async () => {
    if (globalForCron.workflowCronRunning) {
      return;
    }
    globalForCron.workflowCronRunning = true;
    try {
      await runCronWorkflows({});
    } catch (error) {
      console.warn("Cron run failed", error);
    } finally {
      globalForCron.workflowCronRunning = false;
    }
  };

  void tick();
  globalForCron.workflowCronInterval = setInterval(() => {
    void tick();
  }, 60_000);
});
