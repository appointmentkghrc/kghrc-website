import { Resend } from "resend";
import { NextRequest } from "next/server";
import { getContactFormRecipientEmail } from "@/lib/contactFormRecipient";
import { jsonNoStore } from "@/lib/jsonNoStore";

const MAX_LEN = {
  name: 200,
  query: 5000,
} as const;

function isValidInMobileDigits(value: string): boolean {
  return /^\d{10}$/.test(value);
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    console.error("Missing RESEND_API_KEY or RESEND_FROM_EMAIL");
    return jsonNoStore(
      { error: "Appointment form is not configured. Please try again later." },
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
  const mobileRaw = typeof raw.mobile === "string" ? raw.mobile.replace(/\D/g, "") : "";
  const query = typeof raw.query === "string" ? raw.query.trim() : "";

  if (!name || name.length > MAX_LEN.name) {
    return jsonNoStore({ error: "Please enter your name." }, { status: 400 });
  }
  if (!isValidInMobileDigits(mobileRaw)) {
    return jsonNoStore(
      { error: "Please enter a valid 10-digit mobile number." },
      { status: 400 }
    );
  }
  if (!query || query.length > MAX_LEN.query) {
    return jsonNoStore({ error: "Please describe your query or problem." }, { status: 400 });
  }

  const to = await getContactFormRecipientEmail();
  if (!to) {
    console.error("No destination email (CONTACT_FORM_TO_EMAIL or site primaryEmail)");
    return jsonNoStore(
      { error: "Appointment form is not configured. Please try again later." },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);
  const mobileDisplay = `+91 ${mobileRaw}`;
  const text = [
    `New appointment query from the website home page`,
    ``,
    `Name: ${name}`,
    `Mobile: ${mobileDisplay}`,
    ``,
    `Query / problem:`,
    query,
  ].join("\n");

  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject: `Appointment query: ${name}`,
    text,
  });

  if (error) {
    console.error("Resend error:", error);
    return jsonNoStore(
      { error: "Could not send your query. Please try again or call us directly." },
      { status: 502 }
    );
  }

  return jsonNoStore({ ok: true });
}
