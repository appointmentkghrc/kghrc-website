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

    const nextSettings = {
      officeAddress:
        body.officeAddress ?? DEFAULT_SITE_CONTACT_SETTINGS.officeAddress,
      primaryPhone: body.primaryPhone ?? DEFAULT_SITE_CONTACT_SETTINGS.primaryPhone,
      secondaryPhone:
        body.secondaryPhone ?? DEFAULT_SITE_CONTACT_SETTINGS.secondaryPhone,
      primaryEmail: body.primaryEmail ?? DEFAULT_SITE_CONTACT_SETTINGS.primaryEmail,
      secondaryEmail:
        body.secondaryEmail ?? DEFAULT_SITE_CONTACT_SETTINGS.secondaryEmail,
      mapEmbedUrl: body.mapEmbedUrl ?? DEFAULT_SITE_CONTACT_SETTINGS.mapEmbedUrl,
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
