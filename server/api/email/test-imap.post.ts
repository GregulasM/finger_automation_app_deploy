import { createError, readBody } from "h3";
import { testImapConnection, getImapServer, getKnownImapServers } from "../../utils/imap-polling";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "").trim();
  const host = body.host ? String(body.host).trim() : undefined;
  const port = body.port ? Number(body.port) : undefined;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and password are required",
    });
  }

  // Auto-detect IMAP server if not provided
  const autoDetected = getImapServer(email);
  const serverHost = host || autoDetected?.host;
  const serverPort = port || autoDetected?.port || 993;

  if (!serverHost) {
    // Return list of known servers for manual selection
    return {
      ok: false,
      error: "Unknown email provider. Please select IMAP server manually.",
      knownServers: getKnownImapServers(),
      needsManualConfig: true,
    };
  }

  const result = await testImapConnection({
    email,
    password,
    host: serverHost,
    port: serverPort,
  });

  return {
    ...result,
    server: {
      host: serverHost,
      port: serverPort,
      autoDetected: !host && !!autoDetected,
    },
  };
});
