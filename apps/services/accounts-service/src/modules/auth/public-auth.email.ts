import { Injectable } from "@nestjs/common";

import { StructuredLogger } from "@growblic/nest-common";

// Sends the password-reset email via Resend (same HTTP-API approach the project
// already uses for internship invoices/certificates). It NEVER throws to the
// caller and NEVER surfaces send errors — forgot-password must stay
// enumeration-safe and non-blocking even before email is configured. Failures
// are logged server-side only.
@Injectable()
export class PublicAuthEmailProvider {
  constructor(private readonly logger: StructuredLogger) {}

  async sendPasswordReset(email: string, resetUrl: string): Promise<void> {
    // Development convenience: print the reset link so the flow is testable
    // without email configured. Never runs in production.
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.info(`[accounts-service:password-reset] ${email} ${resetUrl}`);
    }

    const apiKey = process.env.RESEND_API_KEY?.trim();
    const from = process.env.PUBLIC_AUTH_FROM_EMAIL?.trim();
    if (!apiKey || !from) {
      this.logger.warning(
        { errorCode: "PUBLIC_AUTH_EMAIL_NOT_CONFIGURED" },
        "password reset email skipped (RESEND_API_KEY / PUBLIC_AUTH_FROM_EMAIL not set)",
      );
      return;
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${apiKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [email],
          subject: "Reset your Growblic password",
          html: resetPasswordHtml(resetUrl),
        }),
      });
      if (!response.ok) {
        throw new Error(`Email provider returned ${response.status}`);
      }
    } catch {
      // Swallow — the client already received the generic success message.
      this.logger.failure(
        { errorCode: "PUBLIC_AUTH_EMAIL_SEND_FAILED" },
        "password reset email failed to send",
      );
    }
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function resetPasswordHtml(resetUrl: string) {
  const safeUrl = escapeHtml(resetUrl);
  return [
    '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#0f172a">',
    "<h2>Reset your Growblic password</h2>",
    "<p>We received a request to reset your Growblic account password. This link expires in 30 minutes and can be used once.</p>",
    `<p><a href="${safeUrl}" style="display:inline-block;background:#020617;color:#fff;padding:12px 20px;border-radius:9999px;text-decoration:none;font-weight:700">Reset password</a></p>`,
    `<p>If the button does not work, copy this link into your browser:<br>${safeUrl}</p>`,
    "<p>If you did not request this, you can safely ignore this email.</p>",
    "</div>",
  ].join("");
}
