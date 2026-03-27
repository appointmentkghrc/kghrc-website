import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_SITE_CONTACT_SETTINGS,
  getSiteContactSettings,
  upsertSiteContactSettings,
} from "@/lib/siteSettings";

export async function GET() {
  try {
    const settings = await getSiteContactSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return NextResponse.json(
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

    const normalizeOpeningHoursRows = (value: unknown, fallback: string[]) => {
      if (!Array.isArray(value)) return fallback;

      const nextRows = value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter((item) => item.length > 0 && item.includes("|"));

      return nextRows.length > 0 ? nextRows : fallback;
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
      diagnosticServicesDefaultHeaderImage:
        typeof body.diagnosticServicesDefaultHeaderImage === "string" &&
        body.diagnosticServicesDefaultHeaderImage.trim().length > 0
          ? body.diagnosticServicesDefaultHeaderImage.trim()
          : currentSettings.diagnosticServicesDefaultHeaderImage,
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
      heroOpeningHoursRows: normalizeOpeningHoursRows(
        body.heroOpeningHoursRows,
        currentSettings.heroOpeningHoursRows
      ),
      doctorsSectionDescription:
        typeof body.doctorsSectionDescription === "string" &&
        body.doctorsSectionDescription.trim().length > 0
          ? body.doctorsSectionDescription.trim()
          : currentSettings.doctorsSectionDescription,
    };

    const updatedSettings = await upsertSiteContactSettings(nextSettings);
    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("Error updating site settings:", error);
    return NextResponse.json(
      { error: "Failed to update site settings" },
      { status: 500 }
    );
  }
}
