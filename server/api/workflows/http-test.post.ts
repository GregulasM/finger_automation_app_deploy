import { getRequestURL, readBody, setResponseStatus } from "h3";
import { requireAuthUser } from "../../utils/auth";
import {
  WORKFLOW_CHAIN_HEADER,
  isInternalWorkflowHook,
} from "../../utils/workflow-chain";

type HttpTestResponse = {
  ok: boolean;
  status: number;
  data: string;
};

function parseHeaders(value: unknown): Record<string, string> {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object") {
        return Object.fromEntries(
          Object.entries(parsed).map(([key, val]) => [key, String(val)]),
        );
      }
    } catch {
      return {};
    }
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [
        key,
        String(val),
      ]),
    );
  }

  return {};
}

function makeError(event: Parameters<typeof setResponseStatus>[0], message: string, status = 400): HttpTestResponse {
  setResponseStatus(event, status);
  return { ok: false, status, data: message };
}

export default defineEventHandler(async (event) => {
  await requireAuthUser(event);

  const body = await readBody(event);
  const url = String(body?.url ?? "").trim();
  if (!url) {
    return makeError(event, "Missing URL");
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return makeError(event, "Invalid URL");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return makeError(event, "Unsupported URL protocol");
  }

  const method = String(body?.method ?? "GET").toUpperCase();
  const headers = parseHeaders(body?.headers);
  const rawBody = body?.body;
  const shouldSendBody = !["GET", "HEAD"].includes(method);
  const payload =
    typeof rawBody === "string"
      ? rawBody.trim() === ""
        ? "{}"
        : rawBody
      : rawBody ?? {};

  const workflowId = String(body?.workflowId ?? "").trim();
  const appOrigin = getRequestURL(event).origin;
  const hasChainHeader = Object.keys(headers).some(
    (key) => key.toLowerCase() === WORKFLOW_CHAIN_HEADER,
  );
  if (
    workflowId &&
    appOrigin &&
    parsedUrl.origin === appOrigin &&
    isInternalWorkflowHook(parsedUrl.pathname) &&
    !hasChainHeader
  ) {
    headers[WORKFLOW_CHAIN_HEADER] = workflowId;
  }

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: shouldSendBody
        ? typeof payload === "string"
          ? payload
          : JSON.stringify(payload)
        : undefined,
    });

    const contentType = response.headers.get("content-type") || "";
    let data: string;
    if (contentType.includes("application/json")) {
      const json = await response.json();
      data = JSON.stringify(json, null, 2);
    } else {
      data = await response.text();
    }

    setResponseStatus(event, response.status);
    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    return makeError(event, message, 502);
  }
});
