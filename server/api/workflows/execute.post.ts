import { createError, getHeader, getRequestURL, readRawBody } from "h3";
import { processWorkflowJob } from "../../utils/workflow-runner";
import { verifyQStashRequest } from "../../utils/qstash";
import { workflowJobSchema } from "../../utils/validation";

export default defineEventHandler(async (event) => {
  const rawBody = await readRawBody(event);
  if (!rawBody) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing body",
    });
  }

  const bodyText =
    typeof rawBody === "string" ? rawBody : rawBody.toString("utf8");
  const signature = getHeader(event, "upstash-signature") ?? "";
  const url = getRequestURL(event).toString();

  const isValid = await verifyQStashRequest({
    signature,
    body: bodyText,
    url,
  });

  if (!isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid QStash signature",
    });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(bodyText);
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid JSON payload",
    });
  }

  const parsed = workflowJobSchema.safeParse(payload);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid workflow job payload",
      data: parsed.error.flatten(),
    });
  }

  await processWorkflowJob(parsed.data);

  return { ok: true };
});
