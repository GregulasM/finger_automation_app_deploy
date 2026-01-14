import { readBody } from "h3";
import { runCronWorkflows } from "../../utils/cron-runner";

export default defineEventHandler(async (event) => {
  const payload = await readBody(event).catch(() => ({}));
  return await runCronWorkflows(payload);
});
