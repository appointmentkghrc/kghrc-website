import { NextRequest } from "next/server";
import { jsonNoStore } from "@/lib/jsonNoStore";
import {
  DEFAULT_SITE_CONTACT_SETTINGS,
  getSiteContactSettings,
  upsertSiteContactSettings,
} from "@/lib/siteSettings";

export async function GET() {
  try {
    const settings = await getSiteContactSettings();
    return jsonNoStore(settings);
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return jsonNoStore(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const currentSettings = await getSiteContactSettings();

    const normalizeUrlField = (value: unknown, fallback: string) => {
      if (typeof value !== "string") return fallback;
      const trimmed = value.trim();
      return trimmed;
    };

    const normalizeServicesHighlightItems = (
      value: unknown,
      fallback: typeof currentSettings.servicesHighlightItems
    ) => {
      if (!Array.isArray(value)) return fallback;
      const next: { title: string; href: string; iconKey: string }[] = [];
      for (const entry of value) {
        if (!entry || typeof entry !== "object") continue;
        const obj = entry as Record<string, unknown>;
        const title = typeof obj.title === "string" ? obj.title.trim() : "";
        const href = typeof obj.href === "string" ? obj.href.trim() : "";
        const iconKey = typeof obj.iconKey === "string" ? obj.iconKey.trim() : "userRound";
        if (title.length === 0 || href.length === 0) continue;
        next.push({ title, href, iconKey });
      }
      return next.length > 0 ? next : fallback;
    };

    const nextSettings = {
      officeAddress:
        body.officeAddress ?? currentSettings.officeAddress,
      primaryPhone: body.primaryPhone ?? currentSettings.primaryPhone,
      secondaryPhone:
        body.secondaryPhone ?? currentSettings.secondaryPhone,
      primaryEmail: body.primaryEmail ?? currentSettings.primaryEmail,
      secondaryEmail:
        body.secondaryEmail ?? currentSettings.secondaryEmail,
      mapEmbedUrl: body.mapEmbedUrl ?? currentSettings.mapEmbedUrl,
      facebookUrl: normalizeUrlField(body.facebookUrl, currentSettings.facebookUrl),
      instagramUrl: normalizeUrlField(body.instagramUrl, currentSettings.instagramUrl),
      twitterUrl: normalizeUrlField(body.twitterUrl, currentSettings.twitterUrl),
      youtubeUrl: normalizeUrlField(body.youtubeUrl, currentSettings.youtubeUrl),
      linkedinUrl: normalizeUrlField(body.linkedinUrl, currentSettings.linkedinUrl),
      heroBackgroundImage:
        typeof body.heroBackgroundImage === "string" &&
        body.heroBackgroundImage.trim().length > 0
          ? body.heroBackgroundImage.trim()
          : DEFAULT_SITE_CONTACT_SETTINGS.heroBackgroundImage,
      statsSectionBackgroundImage:
        typeof body.statsSectionBackgroundImage === "string" &&
        body.statsSectionBackgroundImage.trim().length > 0
          ? body.statsSectionBackgroundImage.trim()
          : currentSettings.statsSectionBackgroundImage,
      diagnosticServicesDefaultHeaderImage:
        typeof body.diagnosticServicesDefaultHeaderImage === "string" &&
        body.diagnosticServicesDefaultHeaderImage.trim().length > 0
          ? body.diagnosticServicesDefaultHeaderImage.trim()
          : currentSettings.diagnosticServicesDefaultHeaderImage,
      doctorsPageHeroImage:
        typeof body.doctorsPageHeroImage === "string" &&
        body.doctorsPageHeroImage.trim().length > 0
          ? body.doctorsPageHeroImage.trim()
          : currentSettings.doctorsPageHeroImage,
      servicesPageHeroImage:
        typeof body.servicesPageHeroImage === "string" &&
        body.servicesPageHeroImage.trim().length > 0
          ? body.servicesPageHeroImage.trim()
          : currentSettings.servicesPageHeroImage,
      blogPageHeroImage:
        typeof body.blogPageHeroImage === "string" &&
        body.blogPageHeroImage.trim().length > 0
          ? body.blogPageHeroImage.trim()
          : currentSettings.blogPageHeroImage,
      contactPageHeroImage:
        typeof body.contactPageHeroImage === "string" &&
        body.contactPageHeroImage.trim().length > 0
          ? body.contactPageHeroImage.trim()
          : currentSettings.contactPageHeroImage,
      heroTitleLine1:
        typeof body.heroTitleLine1 === "string" && body.heroTitleLine1.trim().length > 0
          ? body.heroTitleLine1.trim()
          : currentSettings.heroTitleLine1,
      heroTitleLine2:
        typeof body.heroTitleLine2 === "string" && body.heroTitleLine2.trim().length > 0
          ? body.heroTitleLine2.trim()
          : currentSettings.heroTitleLine2,
      heroDescription:
        typeof body.heroDescription === "string" && body.heroDescription.trim().length > 0
          ? body.heroDescription.trim()
          : currentSettings.heroDescription,
      heroCtaLabel:
        typeof body.heroCtaLabel === "string" && body.heroCtaLabel.trim().length > 0
          ? body.heroCtaLabel.trim()
          : currentSettings.heroCtaLabel,
      heroCtaHref:
        typeof body.heroCtaHref === "string" && body.heroCtaHref.trim().length > 0
          ? body.heroCtaHref.trim()
          : currentSettings.heroCtaHref,
      doctorsSectionDescription:
        typeof body.doctorsSectionDescription === "string" &&
        body.doctorsSectionDescription.trim().length > 0
          ? body.doctorsSectionDescription.trim()
          : currentSettings.doctorsSectionDescription,
      pmjayPatientsTreatedValue:
        typeof body.pmjayPatientsTreatedValue === "string" &&
        body.pmjayPatientsTreatedValue.trim().length > 0
          ? body.pmjayPatientsTreatedValue.trim()
          : currentSettings.pmjayPatientsTreatedValue,
      pmjayPrimaryLogoUrl: normalizeUrlField(
        body.pmjayPrimaryLogoUrl,
        currentSettings.pmjayPrimaryLogoUrl
      ),
      pmjaySecondaryLogoUrl: normalizeUrlField(
        body.pmjaySecondaryLogoUrl,
        currentSettings.pmjaySecondaryLogoUrl
      ),
      servicesHighlightTitle:
        typeof body.servicesHighlightTitle === "string"
          ? body.servicesHighlightTitle.trim()
          : currentSettings.servicesHighlightTitle,
      servicesHighlightItems: normalizeServicesHighlightItems(
        body.servicesHighlightItems,
        currentSettings.servicesHighlightItems
      ),
    };

    const updatedSettings = await upsertSiteContactSettings(nextSettings);
    return jsonNoStore(updatedSettings);
  } catch (error) {
    console.error("Error updating site settings:", error);
    return jsonNoStore(
      { error: "Failed to update site settings" },
      { status: 500 }
    );
  }
}
