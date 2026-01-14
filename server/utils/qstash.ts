import { Client, Receiver } from "@upstash/qstash";
import { createError } from "h3";

type QStashGlobals = typeof globalThis & {
  qstashClient?: Client;
  qstashReceiver?: Receiver;
};

const globalForQStash = globalThis as QStashGlobals;

export function getQStashClient() {
  if (globalForQStash.qstashClient) {
    return globalForQStash.qstashClient;
  }

  const config = useRuntimeConfig();
  const token = config.qstashToken as string | undefined;

  if (!token) {
    throw createError({
      statusCode: 500,
      statusMessage: "QStash token is missing",
    });
  }

  globalForQStash.qstashClient = new Client({ token });
  return globalForQStash.qstashClient;
}

function getQStashReceiver() {
  if (globalForQStash.qstashReceiver) {
    return globalForQStash.qstashReceiver;
  }

  const config = useRuntimeConfig();
  const currentSigningKey = config.qstashCurrentSigningKey as string | undefined;
  const nextSigningKey = config.qstashNextSigningKey as string | undefined;

  if (!currentSigningKey || !nextSigningKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "QStash signing keys are missing",
    });
  }

  globalForQStash.qstashReceiver = new Receiver({
    currentSigningKey,
    nextSigningKey,
  });

  return globalForQStash.qstashReceiver;
}

export async function verifyQStashRequest(params: {
  signature: string;
  body: string;
  url: string;
}) {
  const receiver = getQStashReceiver();
  try {
    return await receiver.verify({
      signature: params.signature,
      body: params.body,
      url: params.url,
    });
  } catch (error) {
    console.warn("QStash signature verification failed", error);
    return false;
  }
}
