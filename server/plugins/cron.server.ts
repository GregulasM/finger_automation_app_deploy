import { runCronWorkflows } from "../utils/cron-runner";

type CronGlobals = typeof globalThis & {
  workflowCronInterval?: NodeJS.Timeout;
  workflowCronRunning?: boolean;
  workflowCronStarted?: boolean;
};

export default defineNitroPlugin(() => {
  const globalForCron = globalThis as CronGlobals;

  // Avoid duplicate initialization
  if (globalForCron.workflowCronStarted) {
    return;
  }
  globalForCron.workflowCronStarted = true;

  // Clear any existing interval (for HMR in dev)
  if (globalForCron.workflowCronInterval) {
    clearInterval(globalForCron.workflowCronInterval);
  }

  console.log("[Cron Plugin] Starting workflow cron scheduler...");

  const tick = async () => {
    if (globalForCron.workflowCronRunning) {
      return;
    }
    globalForCron.workflowCronRunning = true;
    try {
      const result = await runCronWorkflows({});
      if (result.queued > 0) {
        console.log(`[Cron Plugin] Queued ${result.queued} workflow(s):`, result.executions);
      }
    } catch (error) {
      console.error("[Cron Plugin] Cron run failed:", error);
    } finally {
      globalForCron.workflowCronRunning = false;
    }
  };

  // Initial tick after short delay to let server fully start
  setTimeout(() => {
    console.log("[Cron Plugin] Running initial cron check...");
    void tick();
  }, 5000);

  // Run every 30 seconds for more responsive scheduling
  globalForCron.workflowCronInterval = setInterval(() => {
    void tick();
  }, 30_000);

  console.log("[Cron Plugin] Cron scheduler started (interval: 30s)");
});
