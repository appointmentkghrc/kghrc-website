import prisma from "@/lib/prisma";
import {
  DEFAULT_SERVICES_HIGHLIGHT_ITEMS,
  DEFAULT_SERVICES_HIGHLIGHT_TITLE,
  type ServicesHighlightItem,
} from "@/lib/servicesHighlightDefaults";

export type { ServicesHighlightItem };

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
  statsSectionBackgroundImage: string;
  diagnosticServicesDefaultHeaderImage: string;
  pmjayPatientsTreatedValue: string;
  pmjayPrimaryLogoUrl: string;
  pmjaySecondaryLogoUrl: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroDescription: string;
  heroCtaLabel: string;
  heroCtaHref: string;
  heroOpeningHoursRows: string[];
  doctorsSectionDescription: string;
  servicesHighlightTitle: string;
  servicesHighlightItems: ServicesHighlightItem[];
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
  statsSectionBackgroundImage: "/7.jpg",
  diagnosticServicesDefaultHeaderImage:
    "https://validthemes.net/site-template/medihub/assets/img/banner/4.jpg",
  pmjayPatientsTreatedValue: "0",
  pmjayPrimaryLogoUrl: "",
  pmjaySecondaryLogoUrl: "",
  heroTitleLine1: "Best care for your",
  heroTitleLine2: "Good health",
  heroDescription:
    "The ourselves suffering the sincerity. Inhabit her manners adapted age certain. Debating offended at branched striking be subjects.",
  heroCtaLabel: "Contact Us",
  heroCtaHref: "/contact",
  heroOpeningHoursRows: [],
  doctorsSectionDescription:
    "While mirth large of on front. Ye he greater related adapted proceed entered an. Through it examine express promise no.",
  servicesHighlightTitle: DEFAULT_SERVICES_HIGHLIGHT_TITLE,
  servicesHighlightItems: DEFAULT_SERVICES_HIGHLIGHT_ITEMS,
};

const SITE_SETTINGS_KEY = "main";

const parseServicesHighlightItems = (raw: unknown): ServicesHighlightItem[] => {
  if (!raw || !Array.isArray(raw)) return DEFAULT_SERVICES_HIGHLIGHT_ITEMS;

  const parsed: ServicesHighlightItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const obj = entry as Record<string, unknown>;
    const title = typeof obj.title === "string" ? obj.title.trim() : "";
    const href = typeof obj.href === "string" ? obj.href.trim() : "";
    const iconKey = typeof obj.iconKey === "string" ? obj.iconKey.trim() : "userRound";
    if (title.length === 0 || href.length === 0) continue;
    parsed.push({ title, href, iconKey });
  }

  return parsed.length > 0 ? parsed : DEFAULT_SERVICES_HIGHLIGHT_ITEMS;
};

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
          statsSectionBackgroundImage: string | null;
          diagnosticServicesDefaultHeaderImage: string | null;
          pmjayPatientsTreatedValue: string | null;
          pmjayPrimaryLogoUrl: string | null;
          pmjaySecondaryLogoUrl: string | null;
          heroTitleLine1: string | null;
          heroTitleLine2: string | null;
          heroDescription: string | null;
          heroCtaLabel: string | null;
          heroCtaHref: string | null;
          heroOpeningHoursRows: string[];
          doctorsSectionDescription: string | null;
          servicesHighlightTitle: string | null;
          servicesHighlightItems: unknown;
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
    statsSectionBackgroundImage:
      settings.statsSectionBackgroundImage?.trim() ||
      DEFAULT_SITE_CONTACT_SETTINGS.statsSectionBackgroundImage,
    diagnosticServicesDefaultHeaderImage:
      settings.diagnosticServicesDefaultHeaderImage?.trim() ||
      DEFAULT_SITE_CONTACT_SETTINGS.diagnosticServicesDefaultHeaderImage,
    pmjayPatientsTreatedValue:
      settings.pmjayPatientsTreatedValue?.trim() ||
      DEFAULT_SITE_CONTACT_SETTINGS.pmjayPatientsTreatedValue,
    pmjayPrimaryLogoUrl:
      settings.pmjayPrimaryLogoUrl?.trim() ||
      DEFAULT_SITE_CONTACT_SETTINGS.pmjayPrimaryLogoUrl,
    pmjaySecondaryLogoUrl:
      settings.pmjaySecondaryLogoUrl?.trim() ||
      DEFAULT_SITE_CONTACT_SETTINGS.pmjaySecondaryLogoUrl,
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
    servicesHighlightTitle:
      settings.servicesHighlightTitle?.trim() ??
      DEFAULT_SITE_CONTACT_SETTINGS.servicesHighlightTitle,
    servicesHighlightItems: parseServicesHighlightItems(settings.servicesHighlightItems),
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
            statsSectionBackgroundImage: string;
            diagnosticServicesDefaultHeaderImage: string;
            pmjayPatientsTreatedValue: string;
            pmjayPrimaryLogoUrl: string;
            pmjaySecondaryLogoUrl: string;
            heroTitleLine1: string;
            heroTitleLine2: string;
            heroDescription: string;
            heroCtaLabel: string;
            heroCtaHref: string;
            heroOpeningHoursRows: string[];
            doctorsSectionDescription: string;
            servicesHighlightTitle: string;
            servicesHighlightItems: ServicesHighlightItem[];
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
            statsSectionBackgroundImage: string;
            diagnosticServicesDefaultHeaderImage: string;
            pmjayPatientsTreatedValue: string;
            pmjayPrimaryLogoUrl: string;
            pmjaySecondaryLogoUrl: string;
            heroTitleLine1: string;
            heroTitleLine2: string;
            heroDescription: string;
            heroCtaLabel: string;
            heroCtaHref: string;
            heroOpeningHoursRows: string[];
            doctorsSectionDescription: string;
            servicesHighlightTitle: string;
            servicesHighlightItems: ServicesHighlightItem[];
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
          statsSectionBackgroundImage: string | null;
          diagnosticServicesDefaultHeaderImage: string | null;
          pmjayPatientsTreatedValue: string | null;
          pmjayPrimaryLogoUrl: string | null;
          pmjaySecondaryLogoUrl: string | null;
          heroTitleLine1: string | null;
          heroTitleLine2: string | null;
          heroDescription: string | null;
          heroCtaLabel: string | null;
          heroCtaHref: string | null;
          heroOpeningHoursRows: string[];
          doctorsSectionDescription: string | null;
          servicesHighlightTitle: string | null;
          servicesHighlightItems: unknown;
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
      statsSectionBackgroundImage: data.statsSectionBackgroundImage,
      diagnosticServicesDefaultHeaderImage:
        data.diagnosticServicesDefaultHeaderImage,
      pmjayPatientsTreatedValue: data.pmjayPatientsTreatedValue,
      pmjayPrimaryLogoUrl: data.pmjayPrimaryLogoUrl,
      pmjaySecondaryLogoUrl: data.pmjaySecondaryLogoUrl,
      heroTitleLine1: data.heroTitleLine1,
      heroTitleLine2: data.heroTitleLine2,
      heroDescription: data.heroDescription,
      heroCtaLabel: data.heroCtaLabel,
      heroCtaHref: data.heroCtaHref,
      heroOpeningHoursRows: data.heroOpeningHoursRows,
      doctorsSectionDescription: data.doctorsSectionDescription,
      servicesHighlightTitle: data.servicesHighlightTitle,
      servicesHighlightItems: data.servicesHighlightItems,
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
      statsSectionBackgroundImage: data.statsSectionBackgroundImage,
      diagnosticServicesDefaultHeaderImage:
        data.diagnosticServicesDefaultHeaderImage,
      pmjayPatientsTreatedValue: data.pmjayPatientsTreatedValue,
      pmjayPrimaryLogoUrl: data.pmjayPrimaryLogoUrl,
      pmjaySecondaryLogoUrl: data.pmjaySecondaryLogoUrl,
      heroTitleLine1: data.heroTitleLine1,
      heroTitleLine2: data.heroTitleLine2,
      heroDescription: data.heroDescription,
      heroCtaLabel: data.heroCtaLabel,
      heroCtaHref: data.heroCtaHref,
      heroOpeningHoursRows: data.heroOpeningHoursRows,
      doctorsSectionDescription: data.doctorsSectionDescription,
      servicesHighlightTitle: data.servicesHighlightTitle,
      servicesHighlightItems: data.servicesHighlightItems,
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
    statsSectionBackgroundImage:
      settings.statsSectionBackgroundImage?.trim() ||
      DEFAULT_SITE_CONTACT_SETTINGS.statsSectionBackgroundImage,
    diagnosticServicesDefaultHeaderImage:
      settings.diagnosticServicesDefaultHeaderImage?.trim() ||
      DEFAULT_SITE_CONTACT_SETTINGS.diagnosticServicesDefaultHeaderImage,
    pmjayPatientsTreatedValue:
      settings.pmjayPatientsTreatedValue?.trim() ||
      DEFAULT_SITE_CONTACT_SETTINGS.pmjayPatientsTreatedValue,
    pmjayPrimaryLogoUrl:
      settings.pmjayPrimaryLogoUrl?.trim() ||
      DEFAULT_SITE_CONTACT_SETTINGS.pmjayPrimaryLogoUrl,
    pmjaySecondaryLogoUrl:
      settings.pmjaySecondaryLogoUrl?.trim() ||
      DEFAULT_SITE_CONTACT_SETTINGS.pmjaySecondaryLogoUrl,
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
    servicesHighlightTitle:
      settings.servicesHighlightTitle?.trim() ??
      DEFAULT_SITE_CONTACT_SETTINGS.servicesHighlightTitle,
    servicesHighlightItems: parseServicesHighlightItems(settings.servicesHighlightItems),
  };
}
