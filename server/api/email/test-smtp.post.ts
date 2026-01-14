import { createError, readBody } from "h3";
import { testEmailProvider, sendEmailWithProvider, type EmailConfig, type EmailProvider } from "../../utils/email-providers";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  const provider = String(body.provider || "gmail") as EmailProvider;
  const action = String(body.action || "test"); // "test" or "send"
  
  const config: EmailConfig = {
    provider,
    smtpEmail: body.smtpEmail || body.email,
    smtpPassword: body.smtpPassword || body.password,
    smtpHost: body.smtpHost || body.host,
    smtpPort: body.smtpPort || body.port,
    sendgridApiKey: body.sendgridApiKey,
    resendApiKey: body.resendApiKey,
    from: body.from,
  };

  if (action === "test") {
    // Just test the connection/credentials
    const result = await testEmailProvider(config);
    return {
      ok: result.ok,
      error: result.error,
      details: result.details,
      provider,
    };
  }

  if (action === "send") {
    // Send an actual test email
    const to = body.to;
    if (!to) {
      throw createError({
        statusCode: 400,
        statusMessage: "Recipient email (to) is required for sending",
      });
    }

    const result = await sendEmailWithProvider(config, {
      to,
      subject: body.subject || "Test Email from Finger Automation",
      html: body.html || `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #f97316;">🎉 Test Email Successful!</h2>
          <p>This is a test email from your Finger Automation workflow.</p>
          <p>If you received this message, your email configuration is working correctly.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #888; font-size: 12px;">
            Provider: <strong>${provider}</strong><br>
            Sent at: ${new Date().toISOString()}
          </p>
        </div>
      `,
      text: body.text || "Test email from Finger Automation. Your email configuration is working correctly!",
    });

    return {
      ok: result.ok,
      error: result.error,
      messageId: result.messageId,
      provider: result.provider,
    };
  }

  throw createError({
    statusCode: 400,
    statusMessage: "Invalid action. Use 'test' or 'send'.",
  });
});
