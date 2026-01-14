import { createError } from "h3";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(payload: EmailPayload) {
  const config = useRuntimeConfig();
  const apiKey = config.resendApiKey as string | undefined;
  const from = (config.resendFrom as string | undefined) || "noreply@finger.io";

  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set. Email skipped.");
    return { id: "dev-skipped" };
  }

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
    const message = await response.text();
    throw createError({
      statusCode: 502,
      statusMessage: "Email service error",
      data: message,
    });
  }

  return response.json();
}

export function buildVerificationEmail(code: string, email: string) {
  return {
    to: email,
    subject: "Confirm your email",
    html: `<p>Your verification code:</p><p><strong>${code}</strong></p>`,
    text: `Your verification code: ${code}`,
  };
}

export function buildLoginCodeEmail(code: string, email: string) {
  return {
    to: email,
    subject: "Your sign-in code",
    html: `<p>Your login code:</p><p><strong>${code}</strong></p>`,
    text: `Your login code: ${code}`,
  };
}

export function buildResetEmail(token: string, email: string) {
  const config = useRuntimeConfig();
  const baseUrl =
    (config.public?.appUrl as string | undefined) || "http://localhost:3000";
  const url = new URL("/auth/reset", baseUrl);
  url.searchParams.set("token", token);

  return {
    to: email,
    subject: "Reset your password",
    html: `<p>Reset your password:</p><p><a href="${url.toString()}">${url.toString()}</a></p>`,
    text: `Reset your password: ${url.toString()}`,
  };
}
