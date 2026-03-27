import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_ABOUT_SETTINGS,
  getAboutSettings,
  type AboutSettings,
  upsertAboutSettings,
} from "@/lib/aboutSettings";

const normalizeString = (value: unknown, fallback: string): string => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const normalizeStringList = (value: unknown, fallback: string[]): string[] => {
  if (!Array.isArray(value)) return fallback;
  const normalized = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  return normalized.length > 0 ? normalized : fallback;
};

export async function GET() {
  try {
    const settings = await getAboutSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching about settings:", error);
    return NextResponse.json({ error: "Failed to fetch about settings" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const current = await getAboutSettings();

    const nextSettings: AboutSettings = {
      heroTitle: normalizeString(body.heroTitle, current.heroTitle),
      heroBreadcrumb: normalizeString(body.heroBreadcrumb, current.heroBreadcrumb),
      heroBackgroundImage: normalizeString(body.heroBackgroundImage, DEFAULT_ABOUT_SETTINGS.heroBackgroundImage),
      aboutTagline: normalizeString(body.aboutTagline, current.aboutTagline),
      profileTitle: normalizeString(body.profileTitle, current.profileTitle),
      profileDescription: normalizeString(body.profileDescription, current.profileDescription),
      profileImagePrimary: normalizeString(body.profileImagePrimary, current.profileImagePrimary),
      profileImageSecondary: normalizeString(body.profileImageSecondary, current.profileImageSecondary),
      contactTitle: normalizeString(body.contactTitle, current.contactTitle),
      contactDescription: normalizeString(body.contactDescription, current.contactDescription),
      contactButtonLabel: normalizeString(body.contactButtonLabel, current.contactButtonLabel),
      contactButtonHref: normalizeString(body.contactButtonHref, current.contactButtonHref),
      openingHoursTitle: normalizeString(body.openingHoursTitle, current.openingHoursTitle),
      openingHoursRows: normalizeStringList(body.openingHoursRows, current.openingHoursRows),
      cancerTitle: normalizeString(body.cancerTitle, current.cancerTitle),
      cancerDescription: normalizeString(body.cancerDescription, current.cancerDescription),
      cancerButtonLabel: normalizeString(body.cancerButtonLabel, current.cancerButtonLabel),
      cancerButtonHref: normalizeString(body.cancerButtonHref, current.cancerButtonHref),
      missionTitle: normalizeString(body.missionTitle, current.missionTitle),
      missionPoints: normalizeStringList(body.missionPoints, current.missionPoints),
      visionTitle: normalizeString(body.visionTitle, current.visionTitle),
      visionPoints: normalizeStringList(body.visionPoints, current.visionPoints),
      diagnosticTitle: normalizeString(body.diagnosticTitle, current.diagnosticTitle),
      diagnosticItems: normalizeStringList(body.diagnosticItems, current.diagnosticItems),
      facilitiesTitle: normalizeString(body.facilitiesTitle, current.facilitiesTitle),
      facilitiesItems: normalizeStringList(body.facilitiesItems, current.facilitiesItems),
      servicesTitle: normalizeString(body.servicesTitle, current.servicesTitle),
      servicesItems: normalizeStringList(body.servicesItems, current.servicesItems),
    };

    const updated = await upsertAboutSettings(nextSettings);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating about settings:", error);
    return NextResponse.json({ error: "Failed to update about settings" }, { status: 500 });
  }
}
