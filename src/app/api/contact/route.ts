import { Resend } from "resend";
import { NextRequest } from "next/server";
import { getContactFormRecipientEmail } from "@/lib/contactFormRecipient";
import { jsonNoStore } from "@/lib/jsonNoStore";

const MAX_LEN = {
  name: 200,
  email: 320,
  phone: 40,
  message: 5000,
} as const;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    console.error("Missing RESEND_API_KEY or RESEND_FROM_EMAIL");
    return jsonNoStore(
      { error: "Contact form is not configured. Please try again later." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonNoStore({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return jsonNoStore({ error: "Invalid request body." }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const honeypot = typeof raw.website === "string" ? raw.website.trim() : "";
  if (honeypot) {
    return jsonNoStore({ ok: true });
  }

  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  const phone =
    typeof raw.phone === "string" ? raw.phone.trim().slice(0, MAX_LEN.phone) : "";
  const message = typeof raw.message === "string" ? raw.message.trim() : "";

  if (!name || name.length > MAX_LEN.name) {
    return jsonNoStore({ error: "Please enter your name." }, { status: 400 });
  }
  if (!email || email.length > MAX_LEN.email || !isValidEmail(email)) {
    return jsonNoStore({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!message || message.length > MAX_LEN.message) {
    return jsonNoStore({ error: "Please enter a message." }, { status: 400 });
  }

  const to = await getContactFormRecipientEmail();

  if (!to) {
    console.error("No destination email (CONTACT_FORM_TO_EMAIL or site primaryEmail)");
    return jsonNoStore(
      { error: "Contact form is not configured. Please try again later." },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);
  const text = [
    `New message from the website contact form`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "(not provided)"}`,
    ``,
    `Message:`,
    message,
  ].join("\n");

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject: `Contact form: ${name}`,
    text,
  });

  if (error) {
    console.error("Resend error:", error);
    return jsonNoStore(
      { error: "Could not send your message. Please try again or call us directly." },
      { status: 502 }
    );
  }

  return jsonNoStore({ ok: true });
}
