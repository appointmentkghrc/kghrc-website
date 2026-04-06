import { getSiteContactSettings } from "@/lib/siteSettings";

/** Inbox for public forms: env override, else site primary email. */
export async function getContactFormRecipientEmail(): Promise<string | null> {
  const toEnv = process.env.CONTACT_FORM_TO_EMAIL?.trim();
  if (toEnv) return toEnv;
  const settings = await getSiteContactSettings();
  const primary = settings.primaryEmail?.trim();
  return primary || null;
}
