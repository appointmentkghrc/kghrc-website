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
      heroBackgroundImage:
        typeof body.heroBackgroundImage === "string" &&
        body.heroBackgroundImage.trim().length > 0
          ? body.heroBackgroundImage.trim()
          : DEFAULT_SITE_CONTACT_SETTINGS.heroBackgroundImage,
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
