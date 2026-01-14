import nodemailer from "nodemailer";

export type EmailProvider = "resend" | "gmail" | "sendgrid" | "smtp";

export type EmailConfig = {
  provider: EmailProvider;
  // For Gmail/SMTP
  smtpEmail?: string;
  smtpPassword?: string;
  smtpHost?: string;
  smtpPort?: number;
  // For SendGrid
  sendgridApiKey?: string;
  // For Resend
  resendApiKey?: string;
  // Common
  from?: string;
};

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

// Gmail SMTP settings
const GMAIL_SMTP = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use TLS
};

// Common SMTP servers
export const SMTP_SERVERS: Record<string, { host: string; port: number; secure: boolean }> = {
  gmail: { host: "smtp.gmail.com", port: 587, secure: false },
  "mail.ru": { host: "smtp.mail.ru", port: 465, secure: true },
  yandex: { host: "smtp.yandex.ru", port: 465, secure: true },
  outlook: { host: "smtp.office365.com", port: 587, secure: false },
  yahoo: { host: "smtp.mail.yahoo.com", port: 465, secure: true },
};

/**
 * Send email via Gmail SMTP
 */
async function sendViaGmail(
  config: EmailConfig,
  payload: EmailPayload
): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  if (!config.smtpEmail || !config.smtpPassword) {
    return { ok: false, error: "Gmail email and App Password are required" };
  }

  const transporter = nodemailer.createTransport({
    ...GMAIL_SMTP,
    auth: {
      user: config.smtpEmail,
      pass: config.smtpPassword,
    },
  });

  try {
    const result = await transporter.sendMail({
      from: config.from || config.smtpEmail,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });

    return { ok: true, messageId: result.messageId };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: message };
  }
}

/**
 * Send email via custom SMTP
 */
async function sendViaSMTP(
  config: EmailConfig,
  payload: EmailPayload
): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  if (!config.smtpEmail || !config.smtpPassword || !config.smtpHost) {
    return { ok: false, error: "SMTP credentials and host are required" };
  }

  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort || 587,
    secure: config.smtpPort === 465,
    auth: {
      user: config.smtpEmail,
      pass: config.smtpPassword,
    },
  });

  try {
    const result = await transporter.sendMail({
      from: config.from || config.smtpEmail,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });

    return { ok: true, messageId: result.messageId };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: message };
  }
}

/**
 * Send email via SendGrid API
 */
async function sendViaSendGrid(
  config: EmailConfig,
  payload: EmailPayload
): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  const apiKey = config.sendgridApiKey;
  
  if (!apiKey) {
    return { ok: false, error: "SendGrid API key is required" };
  }

  const from = config.from || config.smtpEmail || "noreply@example.com";

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: payload.to }] }],
        from: { email: from },
        subject: payload.subject,
        content: [
          { type: "text/plain", value: payload.text || payload.html.replace(/<[^>]*>/g, "") },
          { type: "text/html", value: payload.html },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { ok: false, error: `SendGrid error: ${response.status} - ${errorText}` };
    }

    // SendGrid returns 202 Accepted with no body
    const messageId = response.headers.get("x-message-id") || `sg-${Date.now()}`;
    return { ok: true, messageId };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: message };
  }
}

/**
 * Send email via Resend API
 */
async function sendViaResend(
  config: EmailConfig,
  payload: EmailPayload
): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  const apiKey = config.resendApiKey || useRuntimeConfig().resendApiKey;
  
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set. Email skipped.");
    return { ok: false, error: "Resend API key not configured" };
  }

  const from = config.from || (useRuntimeConfig().resendFrom as string) || "noreply@finger.io";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { ok: false, error: `Resend error: ${response.status} - ${errorText}` };
    }

    const result = await response.json();
    return { ok: true, messageId: result.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: message };
  }
}

/**
 * Universal email sender - routes to the correct provider
 */
export async function sendEmailWithProvider(
  config: EmailConfig,
  payload: EmailPayload
): Promise<{ ok: boolean; messageId?: string; error?: string; provider: string }> {
  const provider = config.provider || "resend";

  let result: { ok: boolean; messageId?: string; error?: string };

  switch (provider) {
    case "gmail":
      result = await sendViaGmail(config, payload);
      break;
    case "sendgrid":
      result = await sendViaSendGrid(config, payload);
      break;
    case "smtp":
      result = await sendViaSMTP(config, payload);
      break;
    case "resend":
    default:
      result = await sendViaResend(config, payload);
      break;
  }

  return { ...result, provider };
}

/**
 * Test email connection/credentials
 */
export async function testEmailProvider(
  config: EmailConfig
): Promise<{ ok: boolean; error?: string; details?: string }> {
  const provider = config.provider || "resend";

  switch (provider) {
    case "gmail": {
      if (!config.smtpEmail || !config.smtpPassword) {
        return { ok: false, error: "Email and App Password are required" };
      }

      const transporter = nodemailer.createTransport({
        ...GMAIL_SMTP,
        auth: {
          user: config.smtpEmail,
          pass: config.smtpPassword,
        },
      });

      try {
        await transporter.verify();
        return { ok: true, details: `Connected to Gmail as ${config.smtpEmail}` };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (message.includes("Invalid login") || message.includes("authentication")) {
          return { ok: false, error: "Authentication failed. Make sure you're using an App Password, not your regular password." };
        }
        return { ok: false, error: message };
      }
    }

    case "smtp": {
      if (!config.smtpEmail || !config.smtpPassword || !config.smtpHost) {
        return { ok: false, error: "SMTP email, password, and host are required" };
      }

      const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort || 587,
        secure: config.smtpPort === 465,
        auth: {
          user: config.smtpEmail,
          pass: config.smtpPassword,
        },
      });

      try {
        await transporter.verify();
        return { ok: true, details: `Connected to ${config.smtpHost}` };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { ok: false, error: message };
      }
    }

    case "sendgrid": {
      if (!config.sendgridApiKey) {
        return { ok: false, error: "SendGrid API key is required" };
      }

      // Test SendGrid API key by checking scopes
      try {
        const response = await fetch("https://api.sendgrid.com/v3/scopes", {
          headers: {
            Authorization: `Bearer ${config.sendgridApiKey}`,
          },
        });

        if (!response.ok) {
          return { ok: false, error: "Invalid SendGrid API key" };
        }

        return { ok: true, details: "SendGrid API key is valid" };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { ok: false, error: message };
      }
    }

    case "resend":
    default: {
      const apiKey = config.resendApiKey || useRuntimeConfig().resendApiKey;
      if (!apiKey) {
        return { ok: false, error: "Resend API key not configured. Set RESEND_API_KEY in .env or provide it in config." };
      }

      // Test Resend API key
      try {
        const response = await fetch("https://api.resend.com/domains", {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });

        if (!response.ok) {
          return { ok: false, error: "Invalid Resend API key" };
        }

        return { ok: true, details: "Resend API key is valid" };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { ok: false, error: message };
      }
    }
  }
}
