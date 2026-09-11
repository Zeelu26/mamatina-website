import "server-only";
import { Resend } from "resend";

/**
 * Sends the business owner an email when a new contact / order inquiry
 * arrives. Designed to NEVER throw — if email isn't configured or Resend
 * fails, the caller (the contact API) still succeeds and the message is
 * already saved in Supabase.
 */

const FREEMAIL = /@(gmail|yahoo|hotmail|outlook|live|icloud|aol|proton(mail)?)\.[a-z.]+$/i;

function resolveFrom(): string {
  const configured = process.env.CONTACT_FROM_EMAIL?.trim();
  // Resend will only send FROM a domain you've verified. A free mailbox
  // (gmail, etc.) can't be verified, so fall back to Resend's shared
  // sandbox sender, which works with no setup.
  if (configured && configured.includes("@") && !FREEMAIL.test(configured)) {
    return configured;
  }
  return "MaMaTina <onboarding@resend.dev>";
}

export type ContactNotification = {
  name: string;
  email: string;
  phone: string;
  message: string;
  productInterest?: string | null;
  quantity?: string | null;
  eventDate?: string | null;
};

export async function sendContactNotification(
  data: ContactNotification,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_RECEIVER_EMAIL?.trim();

  if (!apiKey || !to) {
    // Email not configured — silently skip. The inquiry is still saved.
    return;
  }

  try {
    const resend = new Resend(apiKey);

    const rows: [string, string | null | undefined][] = [
      ["Name", data.name],
      ["Email", data.email],
      ["Phone", data.phone],
      ["Flavor of interest", data.productInterest],
      ["Quantity", data.quantity],
      ["Event date", data.eventDate],
    ];

    const detailRows = rows
      .filter(([, v]) => v && String(v).trim().length > 0)
      .map(
        ([label, value]) =>
          `<tr><td style="padding:6px 16px 6px 0;color:#5C3E86;font:600 12px/1.4 Arial,sans-serif;text-transform:uppercase;letter-spacing:1px;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;color:#1B1029;font:400 15px/1.5 Arial,sans-serif">${escapeHtml(String(value))}</td></tr>`,
      )
      .join("");

    const html = `
      <div style="max-width:560px;margin:0 auto;background:#F8F5FB;padding:32px;border-radius:16px;font-family:Arial,sans-serif">
        <div style="font:700 24px Georgia,serif;color:#3A2358;margin-bottom:4px">MaMaTina</div>
        <div style="font:600 11px Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#A8893F;margin-bottom:24px">New Inquiry</div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px">${detailRows}</table>
        <div style="font:600 12px Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;color:#5C3E86;margin-bottom:8px">Message</div>
        <div style="background:#fff;border:1px solid #E9E1F0;border-radius:12px;padding:16px;color:#1B1029;font:400 15px/1.6 Arial,sans-serif;white-space:pre-line">${escapeHtml(data.message)}</div>
        <div style="margin-top:24px;font:400 13px Arial,sans-serif;color:#5C3E86">Reply directly to this email to respond to ${escapeHtml(data.name)}.</div>
      </div>`;

    await resend.emails.send({
      from: resolveFrom(),
      to,
      replyTo: data.email,
      subject: `New inquiry from ${data.name}${data.productInterest ? ` · ${data.productInterest}` : ""}`,
      html,
    });
  } catch (error) {
    // Never let an email failure break the contact form.
    console.error("Contact notification email failed:", error);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
