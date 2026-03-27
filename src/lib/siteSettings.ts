import prisma from "@/lib/prisma";

export type SiteContactSettings = {
  officeAddress: string;
  primaryPhone: string;
  secondaryPhone: string;
  primaryEmail: string;
  secondaryEmail: string;
  mapEmbedUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  heroBackgroundImage: string;
  diagnosticServicesDefaultHeaderImage: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroDescription: string;
  heroCtaLabel: string;
  heroCtaHref: string;
  heroOpeningHoursRows: string[];
  doctorsSectionDescription: string;
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
  facebookUrl: "",
  instagramUrl: "",
  twitterUrl: "",
  youtubeUrl: "",
  linkedinUrl: "",
  heroBackgroundImage: "/image7.jpeg",
  diagnosticServicesDefaultHeaderImage:
    "https://validthemes.net/site-template/medihub/assets/img/banner/4.jpg",
  heroTitleLine1: "Best care for your",
  heroTitleLine2: "Good health",
  heroDescription:
    "The ourselves suffering the sincerity. Inhabit her manners adapted age certain. Debating offended at branched striking be subjects.",
  heroCtaLabel: "Contact Us",
  heroCtaHref: "/contact",
  heroOpeningHoursRows: [],
  doctorsSectionDescription:
    "While mirth large of on front. Ye he greater related adapted proceed entered an. Through it examine express promise no.",
};

const SITE_SETTINGS_KEY = "main";

const normalizeOpeningHoursRows = (rows: string[] | null | undefined): string[] => {
  if (!rows || rows.length === 0) return [];

  const normalizedRows = rows
    .map((row) => row.trim())
    .filter((row) => row.length > 0 && row.includes("|"));

  return normalizedRows;
};

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
          facebookUrl: string | null;
          instagramUrl: string | null;
          twitterUrl: string | null;
          youtubeUrl: string | null;
          linkedinUrl: string | null;
          heroBackgroundImage: string | null;
          diagnosticServicesDefaultHeaderImage: string | null;
          heroTitleLine1: string | null;
          heroTitleLine2: string | null;
          heroDescription: string | null;
          heroCtaLabel: string | null;
          heroCtaHref: string | null;
          heroOpeningHoursRows: string[];
          doctorsSectionDescription: string | null;
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
    facebookUrl: settings.facebookUrl?.trim() || DEFAULT_SITE_CONTACT_SETTINGS.facebookUrl,
    instagramUrl: settings.instagramUrl?.trim() || DEFAULT_SITE_CONTACT_SETTINGS.instagramUrl,
    twitterUrl: settings.twitterUrl?.trim() || DEFAULT_SITE_CONTACT_SETTINGS.twitterUrl,
    youtubeUrl: settings.youtubeUrl?.trim() || DEFAULT_SITE_CONTACT_SETTINGS.youtubeUrl,
    linkedinUrl: settings.linkedinUrl?.trim() || DEFAULT_SITE_CONTACT_SETTINGS.linkedinUrl,
    heroBackgroundImage:
      settings.heroBackgroundImage ?? DEFAULT_SITE_CONTACT_SETTINGS.heroBackgroundImage,
    diagnosticServicesDefaultHeaderImage:
      settings.diagnosticServicesDefaultHeaderImage?.trim() ||
      DEFAULT_SITE_CONTACT_SETTINGS.diagnosticServicesDefaultHeaderImage,
    heroTitleLine1:
      settings.heroTitleLine1?.trim() || DEFAULT_SITE_CONTACT_SETTINGS.heroTitleLine1,
    heroTitleLine2:
      settings.heroTitleLine2?.trim() || DEFAULT_SITE_CONTACT_SETTINGS.heroTitleLine2,
    heroDescription:
      settings.heroDescription?.trim() || DEFAULT_SITE_CONTACT_SETTINGS.heroDescription,
    heroCtaLabel:
      settings.heroCtaLabel?.trim() || DEFAULT_SITE_CONTACT_SETTINGS.heroCtaLabel,
    heroCtaHref:
      settings.heroCtaHref?.trim() || DEFAULT_SITE_CONTACT_SETTINGS.heroCtaHref,
    heroOpeningHoursRows: normalizeOpeningHoursRows(settings.heroOpeningHoursRows),
    doctorsSectionDescription:
      settings.doctorsSectionDescription?.trim() ||
      DEFAULT_SITE_CONTACT_SETTINGS.doctorsSectionDescription,
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
            facebookUrl: string;
            instagramUrl: string;
            twitterUrl: string;
            youtubeUrl: string;
            linkedinUrl: string;
            heroBackgroundImage: string;
            diagnosticServicesDefaultHeaderImage: string;
            heroTitleLine1: string;
            heroTitleLine2: string;
            heroDescription: string;
            heroCtaLabel: string;
            heroCtaHref: string;
            heroOpeningHoursRows: string[];
            doctorsSectionDescription: string;
          };
          update: {
            officeAddress: string;
            primaryPhone: string;
            secondaryPhone: string;
            primaryEmail: string;
            secondaryEmail: string;
            mapEmbedUrl: string;
            facebookUrl: string;
            instagramUrl: string;
            twitterUrl: string;
            youtubeUrl: string;
            linkedinUrl: string;
            heroBackgroundImage: string;
            diagnosticServicesDefaultHeaderImage: string;
            heroTitleLine1: string;
            heroTitleLine2: string;
            heroDescription: string;
            heroCtaLabel: string;
            heroCtaHref: string;
            heroOpeningHoursRows: string[];
            doctorsSectionDescription: string;
          };
        }) => Promise<{
          officeAddress: string;
          primaryPhone: string;
          secondaryPhone: string;
          primaryEmail: string;
          secondaryEmail: string;
          mapEmbedUrl: string;
          facebookUrl: string | null;
          instagramUrl: string | null;
          twitterUrl: string | null;
          youtubeUrl: string | null;
          linkedinUrl: string | null;
          heroBackgroundImage: string | null;
          diagnosticServicesDefaultHeaderImage: string | null;
          heroTitleLine1: string | null;
          heroTitleLine2: string | null;
          heroDescription: string | null;
          heroCtaLabel: string | null;
          heroCtaHref: string | null;
          heroOpeningHoursRows: string[];
          doctorsSectionDescription: string | null;
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
      facebookUrl: data.facebookUrl,
      instagramUrl: data.instagramUrl,
      twitterUrl: data.twitterUrl,
      youtubeUrl: data.youtubeUrl,
      linkedinUrl: data.linkedinUrl,
      heroBackgroundImage: data.heroBackgroundImage,
      diagnosticServicesDefaultHeaderImage:
        data.diagnosticServicesDefaultHeaderImage,
      heroTitleLine1: data.heroTitleLine1,
      heroTitleLine2: data.heroTitleLine2,
      heroDescription: data.heroDescription,
      heroCtaLabel: data.heroCtaLabel,
      heroCtaHref: data.heroCtaHref,
      heroOpeningHoursRows: data.heroOpeningHoursRows,
      doctorsSectionDescription: data.doctorsSectionDescription,
    },
    update: {
      officeAddress: data.officeAddress,
      primaryPhone: data.primaryPhone,
      secondaryPhone: data.secondaryPhone,
      primaryEmail: data.primaryEmail,
      secondaryEmail: data.secondaryEmail,
      mapEmbedUrl: data.mapEmbedUrl,
      facebookUrl: data.facebookUrl,
      instagramUrl: data.instagramUrl,
      twitterUrl: data.twitterUrl,
      youtubeUrl: data.youtubeUrl,
      linkedinUrl: data.linkedinUrl,
      heroBackgroundImage: data.heroBackgroundImage,
      diagnosticServicesDefaultHeaderImage:
        data.diagnosticServicesDefaultHeaderImage,
      heroTitleLine1: data.heroTitleLine1,
      heroTitleLine2: data.heroTitleLine2,
      heroDescription: data.heroDescription,
      heroCtaLabel: data.heroCtaLabel,
      heroCtaHref: data.heroCtaHref,
      heroOpeningHoursRows: data.heroOpeningHoursRows,
      doctorsSectionDescription: data.doctorsSectionDescription,
    },
  });

  return {
    officeAddress: settings.officeAddress,
    primaryPhone: settings.primaryPhone,
    secondaryPhone: settings.secondaryPhone,
    primaryEmail: settings.primaryEmail,
    secondaryEmail: settings.secondaryEmail,
    mapEmbedUrl: settings.mapEmbedUrl,
    facebookUrl: settings.facebookUrl?.trim() || DEFAULT_SITE_CONTACT_SETTINGS.facebookUrl,
    instagramUrl: settings.instagramUrl?.trim() || DEFAULT_SITE_CONTACT_SETTINGS.instagramUrl,
    twitterUrl: settings.twitterUrl?.trim() || DEFAULT_SITE_CONTACT_SETTINGS.twitterUrl,
    youtubeUrl: settings.youtubeUrl?.trim() || DEFAULT_SITE_CONTACT_SETTINGS.youtubeUrl,
    linkedinUrl: settings.linkedinUrl?.trim() || DEFAULT_SITE_CONTACT_SETTINGS.linkedinUrl,
    heroBackgroundImage:
      settings.heroBackgroundImage ?? DEFAULT_SITE_CONTACT_SETTINGS.heroBackgroundImage,
    diagnosticServicesDefaultHeaderImage:
      settings.diagnosticServicesDefaultHeaderImage?.trim() ||
      DEFAULT_SITE_CONTACT_SETTINGS.diagnosticServicesDefaultHeaderImage,
    heroTitleLine1:
      settings.heroTitleLine1?.trim() || DEFAULT_SITE_CONTACT_SETTINGS.heroTitleLine1,
    heroTitleLine2:
      settings.heroTitleLine2?.trim() || DEFAULT_SITE_CONTACT_SETTINGS.heroTitleLine2,
    heroDescription:
      settings.heroDescription?.trim() || DEFAULT_SITE_CONTACT_SETTINGS.heroDescription,
    heroCtaLabel:
      settings.heroCtaLabel?.trim() || DEFAULT_SITE_CONTACT_SETTINGS.heroCtaLabel,
    heroCtaHref:
      settings.heroCtaHref?.trim() || DEFAULT_SITE_CONTACT_SETTINGS.heroCtaHref,
    heroOpeningHoursRows: normalizeOpeningHoursRows(settings.heroOpeningHoursRows),
    doctorsSectionDescription:
      settings.doctorsSectionDescription?.trim() ||
      DEFAULT_SITE_CONTACT_SETTINGS.doctorsSectionDescription,
  };
}
