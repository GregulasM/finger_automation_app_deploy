import { ImapFlow, type FetchMessageObject } from "imapflow";
import { prisma } from "../../app/lib/prisma";
import { enqueueWorkflow } from "./workflow-queue";

// Common IMAP servers by domain
const IMAP_SERVERS: Record<string, { host: string; port: number }> = {
  "gmail.com": { host: "imap.gmail.com", port: 993 },
  "googlemail.com": { host: "imap.gmail.com", port: 993 },
  "mail.ru": { host: "imap.mail.ru", port: 993 },
  "inbox.ru": { host: "imap.mail.ru", port: 993 },
  "list.ru": { host: "imap.mail.ru", port: 993 },
  "bk.ru": { host: "imap.mail.ru", port: 993 },
  "yahoo.com": { host: "imap.mail.yahoo.com", port: 993 },
  "yandex.ru": { host: "imap.yandex.ru", port: 993 },
  "yandex.com": { host: "imap.yandex.ru", port: 993 },
  "ya.ru": { host: "imap.yandex.ru", port: 993 },
  "outlook.com": { host: "outlook.office365.com", port: 993 },
  "hotmail.com": { host: "outlook.office365.com", port: 993 },
  "live.com": { host: "outlook.office365.com", port: 993 },
  "icloud.com": { host: "imap.mail.me.com", port: 993 },
  "me.com": { host: "imap.mail.me.com", port: 993 },
  "protonmail.com": { host: "127.0.0.1", port: 1143 }, // ProtonMail Bridge
  "proton.me": { host: "127.0.0.1", port: 1143 },
  "zoho.com": { host: "imap.zoho.com", port: 993 },
  "aol.com": { host: "imap.aol.com", port: 993 },
  "gmx.com": { host: "imap.gmx.com", port: 993 },
  "gmx.net": { host: "imap.gmx.net", port: 993 },
};

// Get IMAP server settings from email domain
export function getImapServer(email: string): { host: string; port: number } | null {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return null;
  return IMAP_SERVERS[domain] || null;
}

// Get all known IMAP servers for UI dropdown
export function getKnownImapServers(): Array<{ domain: string; host: string; port: number }> {
  return Object.entries(IMAP_SERVERS).map(([domain, config]) => ({
    domain,
    ...config,
  }));
}

type EmailTriggerConfig = {
  imapEmail?: string;
  imapPassword?: string;
  imapHost?: string;
  imapPort?: number;
  imapFolder?: string;
  lastUid?: number;
  filterFrom?: string;
  filterSubject?: string;
};

type EmailPayload = {
  uid: number;
  from: string;
  to: string;
  subject: string;
  date: string;
  text: string;
  html: string;
  headers: Record<string, string>;
};

// Test IMAP connection
export async function testImapConnection(config: {
  email: string;
  password: string;
  host?: string;
  port?: number;
}): Promise<{ ok: boolean; error?: string; mailboxes?: string[] }> {
  const serverConfig = config.host
    ? { host: config.host, port: config.port || 993 }
    : getImapServer(config.email);

  if (!serverConfig) {
    return {
      ok: false,
      error: `Unknown email provider. Please specify IMAP server manually.`,
    };
  }

  const client = new ImapFlow({
    host: serverConfig.host,
    port: serverConfig.port,
    secure: true,
    auth: {
      user: config.email,
      pass: config.password,
    },
    logger: false,
  });

  try {
    await client.connect();
    
    // List mailboxes using list() method
    const mailboxList = await client.list();
    const mailboxes = mailboxList.map((m) => m.path);
    
    await client.logout();
    
    return { ok: true, mailboxes };
  } catch (error) {
    // Extract error message from various error types
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
      // Check for responseText in IMAP errors
      if ('responseText' in error && typeof (error as any).responseText === 'string') {
        message = (error as any).responseText || message;
      }
    } else if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object') {
      message = JSON.stringify(error);
    }
    
    // Provide helpful error messages
    if (message.includes("AUTHENTICATIONFAILED") || message.includes("Invalid credentials") || message.includes("authentication failed") || message.includes("Lookup failed")) {
      return {
        ok: false,
        error: "Authentication failed. Check your email and App Password. For Gmail, enable 2FA and create an App Password.",
      };
    }
    if (message.includes("ECONNREFUSED")) {
      return {
        ok: false,
        error: `Cannot connect to ${serverConfig.host}:${serverConfig.port}. Check if IMAP is enabled in your email settings.`,
      };
    }
    if (message.includes("ETIMEDOUT") || message.includes("timeout")) {
      return {
        ok: false,
        error: "Connection timed out. The IMAP server may be unreachable.",
      };
    }
    if (message.includes("ENOTFOUND") || message.includes("getaddrinfo")) {
      return {
        ok: false,
        error: `Cannot resolve ${serverConfig.host}. Check the IMAP server address.`,
      };
    }
    if (message.includes("certificate") || message.includes("SSL") || message.includes("TLS")) {
      return {
        ok: false,
        error: "SSL/TLS certificate error. The IMAP server might have an invalid certificate.",
      };
    }
    
    return { ok: false, error: message };
  }
}

// Extract email trigger config from graphData
function extractEmailTriggerConfig(graphData: unknown): { nodeId: string; config: EmailTriggerConfig } | null {
  if (!graphData || typeof graphData !== "object") return null;
  
  const data = graphData as Record<string, unknown>;
  if (!Array.isArray(data.nodes)) return null;

  // Get connected nodes
  const edges = Array.isArray(data.edges) ? data.edges : [];
  const connectedNodeIds = new Set(
    edges.map((e) => String((e as Record<string, unknown>).source))
  );

  const triggerNode = data.nodes
    .map((node) => node as Record<string, unknown>)
    .find((node) => {
      const nodeId = String(node.id ?? "");
      const nodeData = (node.data ?? {}) as Record<string, unknown>;
      const role = String(nodeData.role ?? "").toLowerCase();
      const type = String(nodeData.type ?? node.type ?? "").toLowerCase();
      // Must be email trigger AND connected
      return role === "trigger" && type === "email" && connectedNodeIds.has(nodeId);
    });

  if (!triggerNode) return null;

  const nodeData = (triggerNode.data ?? {}) as Record<string, unknown>;
  const config = (nodeData.config ?? {}) as EmailTriggerConfig;
  
  return {
    nodeId: String(triggerNode.id),
    config,
  };
}

// Poll a single workflow's email
async function pollWorkflowEmail(workflow: {
  id: string;
  name: string;
  graphData: unknown;
}): Promise<{ triggered: boolean; newUid?: number; error?: string }> {
  const triggerInfo = extractEmailTriggerConfig(workflow.graphData);
  
  if (!triggerInfo) {
    return { triggered: false, error: "No email trigger config found" };
  }
  
  const { config } = triggerInfo;
  
  if (!config.imapEmail || !config.imapPassword) {
    return { triggered: false, error: "IMAP credentials not configured" };
  }

  const serverConfig = config.imapHost
    ? { host: config.imapHost, port: config.imapPort || 993 }
    : getImapServer(config.imapEmail);

  if (!serverConfig) {
    return { triggered: false, error: "Unknown IMAP server" };
  }

  const client = new ImapFlow({
    host: serverConfig.host,
    port: serverConfig.port,
    secure: true,
    auth: {
      user: config.imapEmail,
      pass: config.imapPassword,
    },
    logger: false,
  });

  try {
    await client.connect();

    const folder = config.imapFolder || "INBOX";
    const lock = await client.getMailboxLock(folder);

    try {
      const lastUid = config.lastUid || 0;
      
      // IMPORTANT: If lastUid is 0, this is the FIRST run
      // We should NOT process any existing emails - only record the current highest UID
      // This prevents triggering workflows for ALL existing emails
      if (lastUid === 0) {
        // Get the highest UID in the mailbox to set as starting point
        const status = await client.status(folder, { uidNext: true });
        const currentHighestUid = (status.uidNext || 1) - 1;
        
        console.log(`[IMAP Polling] First run for "${workflow.name}" - setting lastUid to ${currentHighestUid} (skipping existing emails)`);
        
        // Update lastUid so next run only gets NEW emails
        await updateWorkflowLastUid(workflow.id, triggerInfo.nodeId, currentHighestUid);
        
        lock.release();
        return { triggered: false, newUid: currentHighestUid };
      }

      // Get messages newer than lastUid
      const searchCriteria: Record<string, unknown> = { uid: `${lastUid + 1}:*` };
      
      // Add filters if configured
      if (config.filterFrom) {
        searchCriteria.from = config.filterFrom;
      }
      if (config.filterSubject) {
        searchCriteria.subject = config.filterSubject;
      }

      let newLastUid = lastUid;
      let triggeredCount = 0;

      // Limit to 10 emails per polling run to prevent flooding
      const MAX_EMAILS_PER_RUN = 10;
      
      for await (const message of client.fetch(searchCriteria, {
        uid: true,
        envelope: true,
        source: true,
        bodyStructure: true,
      })) {
        // Skip if UID is not greater than lastUid (can happen with UID ranges)
        if (message.uid <= lastUid) continue;

        // Update lastUid even if we hit the limit (so we don't reprocess)
        if (message.uid > newLastUid) {
          newLastUid = message.uid;
        }

        // Limit how many emails we process per run
        if (triggeredCount >= MAX_EMAILS_PER_RUN) {
          console.log(`[IMAP Polling] Hit limit of ${MAX_EMAILS_PER_RUN} emails for "${workflow.name}", remaining will be processed next run`);
          continue; // Continue to update newLastUid but don't trigger more workflows
        }

        // Parse email
        const emailPayload = await parseMessage(message);

        // Create execution
        const execution = await prisma.execution.create({
          data: {
            workflowId: workflow.id,
            status: "PENDING",
            logs: [
              {
                at: new Date().toISOString(),
                level: "info",
                message: `Email received from ${emailPayload.from}: ${emailPayload.subject}`,
              },
            ],
          },
        });

        // Enqueue workflow
        await enqueueWorkflow({
          workflowId: workflow.id,
          executionId: execution.id,
          payload: emailPayload,
          source: "email",
        });

        triggeredCount++;
        console.log(`[IMAP Polling] Triggered workflow "${workflow.name}" for email UID ${message.uid}`);
      }

      // Update lastUid in workflow graphData
      if (newLastUid > lastUid) {
        await updateWorkflowLastUid(workflow.id, triggerInfo.nodeId, newLastUid);
      }

      return { triggered: triggeredCount > 0, newUid: newLastUid };
    } finally {
      lock.release();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[IMAP Polling] Error for workflow "${workflow.name}":`, message);
    return { triggered: false, error: message };
  } finally {
    try {
      await client.logout();
    } catch {
      // Ignore logout errors
    }
  }
}

async function parseMessage(message: FetchMessageObject): Promise<EmailPayload> {
  const envelope = message.envelope;
  
  return {
    uid: message.uid,
    from: envelope.from?.[0]?.address || "",
    to: envelope.to?.[0]?.address || "",
    subject: envelope.subject || "",
    date: envelope.date?.toISOString() || new Date().toISOString(),
    text: "", // Would need additional parsing for body
    html: "",
    headers: {
      messageId: envelope.messageId || "",
      inReplyTo: envelope.inReplyTo || "",
    },
  };
}

async function updateWorkflowLastUid(workflowId: string, nodeId: string, lastUid: number) {
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
    select: { graphData: true },
  });

  if (!workflow?.graphData) return;

  const graphData = workflow.graphData as Record<string, unknown>;
  const nodes = graphData.nodes as Array<Record<string, unknown>>;

  const updatedNodes = nodes.map((node) => {
    if (String(node.id) !== nodeId) return node;

    const nodeData = (node.data ?? {}) as Record<string, unknown>;
    const config = (nodeData.config ?? {}) as Record<string, unknown>;

    return {
      ...node,
      data: {
        ...nodeData,
        config: {
          ...config,
          lastUid,
        },
      },
    };
  });

  await prisma.workflow.update({
    where: { id: workflowId },
    data: {
      graphData: {
        ...graphData,
        nodes: updatedNodes,
      },
    },
  });
}

// Main polling function - called by cron
export async function runEmailPolling(): Promise<{
  checked: number;
  triggered: number;
  errors: string[];
}> {
  // Get all active workflows
  const workflows = await prisma.workflow.findMany({
    where: { status: "ACTIVE" },
    select: {
      id: true,
      name: true,
      graphData: true,
    },
  });

  // Filter to those with email triggers that have IMAP configured
  const emailWorkflows = workflows.filter((w) => {
    const trigger = extractEmailTriggerConfig(w.graphData);
    return trigger && trigger.config.imapEmail && trigger.config.imapPassword;
  });

  if (emailWorkflows.length === 0) {
    return { checked: 0, triggered: 0, errors: [] };
  }

  console.log(`[IMAP Polling] Checking ${emailWorkflows.length} workflow(s) with email triggers`);

  let triggered = 0;
  const errors: string[] = [];

  for (const workflow of emailWorkflows) {
    const result = await pollWorkflowEmail(workflow);
    if (result.triggered) {
      triggered++;
    }
    if (result.error) {
      errors.push(`${workflow.name}: ${result.error}`);
    }
  }

  return { checked: emailWorkflows.length, triggered, errors };
}
