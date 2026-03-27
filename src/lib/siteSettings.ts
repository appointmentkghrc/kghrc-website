import prisma from "@/lib/prisma";

export type SiteContactSettings = {
  officeAddress: string;
  primaryPhone: string;
  secondaryPhone: string;
  primaryEmail: string;
  secondaryEmail: string;
  mapEmbedUrl: string;
};

export const DEFAULT_SITE_CONTACT_SETTINGS: SiteContactSettings = {
  officeAddress:
    "Kanke General Hospital, Arsande Road, Near Kanke Block Chowk, Kanke, Jharkhand 834006",
  primaryPhone: "+91-6206803663",
  secondaryPhone: "06512450844",
  primaryEmail: "appointment.kghrc@gmail.com",
  secondaryEmail: "Kankegeneralhospital@gmail.com",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Kanke%20General%20Hospital%2C%20Arsande%20Road%2C%20Near%20Kanke%20Block%20Chowk%2C%20Kanke%2C%20Jharkhand%20834006&output=embed",
};

const SITE_SETTINGS_KEY = "main";

export async function getSiteContactSettings(): Promise<SiteContactSettings> {
  const prismaClient = prisma as unknown as Record<string, unknown>;
  const siteSettingDelegate = prismaClient.siteSetting as
    | {
        findUnique: (args: { where: { key: string } }) => Promise<{
          officeAddress: string;
          primaryPhone: string;
          secondaryPhone: string;
          primaryEmail: string;
          secondaryEmail: string;
          mapEmbedUrl: string;
        } | null>;
      }
    | undefined;

  if (!siteSettingDelegate) {
    return DEFAULT_SITE_CONTACT_SETTINGS;
  }

  const settings = await siteSettingDelegate.findUnique({
    where: { key: SITE_SETTINGS_KEY },
  });

  if (!settings) {
    return DEFAULT_SITE_CONTACT_SETTINGS;
  }

  return {
    officeAddress: settings.officeAddress,
    primaryPhone: settings.primaryPhone,
    secondaryPhone: settings.secondaryPhone,
    primaryEmail: settings.primaryEmail,
    secondaryEmail: settings.secondaryEmail,
    mapEmbedUrl: settings.mapEmbedUrl,
  };
}

export async function upsertSiteContactSettings(
  data: SiteContactSettings
): Promise<SiteContactSettings> {
  const prismaClient = prisma as unknown as Record<string, unknown>;
  const siteSettingDelegate = prismaClient.siteSetting as
    | {
        upsert: (args: {
          where: { key: string };
          create: {
            key: string;
            officeAddress: string;
            primaryPhone: string;
            secondaryPhone: string;
            primaryEmail: string;
            secondaryEmail: string;
            mapEmbedUrl: string;
          };
          update: {
            officeAddress: string;
            primaryPhone: string;
            secondaryPhone: string;
            primaryEmail: string;
            secondaryEmail: string;
            mapEmbedUrl: string;
          };
        }) => Promise<{
          officeAddress: string;
          primaryPhone: string;
          secondaryPhone: string;
          primaryEmail: string;
          secondaryEmail: string;
          mapEmbedUrl: string;
        }>;
      }
    | undefined;

  if (!siteSettingDelegate) {
    return data;
  }

  const settings = await siteSettingDelegate.upsert({
    where: { key: SITE_SETTINGS_KEY },
    create: {
      key: SITE_SETTINGS_KEY,
      officeAddress: data.officeAddress,
      primaryPhone: data.primaryPhone,
      secondaryPhone: data.secondaryPhone,
      primaryEmail: data.primaryEmail,
      secondaryEmail: data.secondaryEmail,
      mapEmbedUrl: data.mapEmbedUrl,
    },
    update: {
      officeAddress: data.officeAddress,
      primaryPhone: data.primaryPhone,
      secondaryPhone: data.secondaryPhone,
      primaryEmail: data.primaryEmail,
      secondaryEmail: data.secondaryEmail,
      mapEmbedUrl: data.mapEmbedUrl,
    },
  });

  return {
    officeAddress: settings.officeAddress,
    primaryPhone: settings.primaryPhone,
    secondaryPhone: settings.secondaryPhone,
    primaryEmail: settings.primaryEmail,
    secondaryEmail: settings.secondaryEmail,
    mapEmbedUrl: settings.mapEmbedUrl,
  };
}
