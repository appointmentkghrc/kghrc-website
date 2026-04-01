import prisma from "@/lib/prisma";

/** Parsed row for home departments section, footer, etc. (`label|value` from About settings). */
export type OpeningHoursItem = {
  day: string;
  time: string;
};

/** Converts About `openingHoursRows` strings (`Label|Value`) into display items. */
export function parseOpeningHoursRowsToItems(rows: string[]): OpeningHoursItem[] {
  if (!rows || rows.length === 0) return [];

  return rows
    .filter((row) => typeof row === "string" && row.includes("|"))
    .map((row) => row.split("|"))
    .map(([day, time]) => ({
      day: (day ?? "").trim(),
      time: (time ?? "").trim(),
    }))
    .filter((row) => row.day.length > 0);
}

export type AboutSettings = {
  heroTitle: string;
  heroBreadcrumb: string;
  heroBackgroundImage: string;
  aboutTagline: string;
  profileTitle: string;
  profileDescription: string;
  profileImagePrimary: string;
  profileImageSecondary: string;
  contactTitle: string;
  contactDescription: string;
  contactButtonLabel: string;
  contactButtonHref: string;
  openingHoursTitle: string;
  openingHoursRows: string[];
  cancerTitle: string;
  cancerDescription: string;
  cancerButtonLabel: string;
  cancerButtonHref: string;
  missionTitle: string;
  missionPoints: string[];
  visionTitle: string;
  visionPoints: string[];
  diagnosticTitle: string;
  diagnosticItems: string[];
  facilitiesTitle: string;
  facilitiesItems: string[];
  servicesTitle: string;
  servicesItems: string[];
};

export const DEFAULT_ABOUT_SETTINGS: AboutSettings = {
  heroTitle: "About Us",
  heroBreadcrumb: "HOME › ABOUT",
  heroBackgroundImage: "https://validthemes.net/site-template/medihub/assets/img/banner/5.jpg",
  aboutTagline: "KANKE GENERAL HOSPITAL & RESEARCH CENTRE",
  profileTitle: "Hospital Profile",
  profileDescription:
    "Kanke General Hospital & Research Centre is a 100 bedded multi-speciality hospital located in Ranchi. The hospital started as a small OPD in 1990 by Dr. Shambhu Prasad Singh and later developed into a modern healthcare institution. It was registered under the Clinical Establishment Act on 9 March 2009. The hospital is committed to providing high quality and affordable healthcare services with experienced doctors, trained staff and modern medical equipment.",
  profileImagePrimary: "https://validthemes.net/site-template/medihub/assets/img/about/1.jpg",
  profileImageSecondary: "https://validthemes.net/site-template/medihub/assets/img/about/2.jpg",
  contactTitle: "Contact Us",
  contactDescription:
    "Moment he at on wonder at season little. Six garden result summer set family esteem nay estate. End admiration mrs unreserved.",
  contactButtonLabel: "READ MORE",
  contactButtonHref: "/contact",
  openingHoursTitle: "OPENING HOURS",
  openingHoursRows: ["Mon - Tues :|6.00 AM - 10.00 PM", "Wednes - Thurs :|8.00 AM - 6.00 PM", "Sun :|Closed"],
  cancerTitle: "CANCER CARE",
  cancerDescription:
    "Moment he at on wonder at season little. Six garden result summer set family esteem nay estate. End admiration mrs unreserved.",
  cancerButtonLabel: "READ MORE",
  cancerButtonHref: "/contact",
  missionTitle: "Mission",
  missionPoints: [
    "To provide the best quality healthcare services at an affordable cost.",
    "To deliver ethical and patient-centered treatment.",
    "To ensure accurate diagnosis using modern technology.",
    "To continuously improve healthcare quality.",
  ],
  visionTitle: "Vision",
  visionPoints: [
    "To become one of the leading healthcare institutions.",
    "To provide world-class healthcare facilities.",
    "To promote medical education and research.",
    "To ensure accessible healthcare for all.",
  ],
  diagnosticTitle: "Diagnostic Services",
  diagnosticItems: ["Laboratory", "CT Scan", "X-Ray", "Ultrasound", "MRI", "3D Vasculography", "TMT"],
  facilitiesTitle: "Hospital Facilities",
  facilitiesItems: ["Operation Theatre", "Electronic Fetal Monitoring", "Endoscopy", "EECP"],
  servicesTitle: "Hospital Services",
  servicesItems: [
    "Ayushman Bharat Help Desk",
    "15000+ Ayushman Bharat cases treated",
    "Cashless TPA treatment",
    "Emergency services",
    "24×7 patient care",
  ],
};

const ABOUT_SETTINGS_KEY = "main_about";

type AboutSettingsRecord = AboutSettings & {
  heroBackgroundImage: string | null;
  profileImagePrimary: string | null;
  profileImageSecondary: string | null;
};

type AboutSectionDelegate = {
  findUnique: (args: { where: { key: string } }) => Promise<AboutSettingsRecord | null>;
  upsert: (args: {
    where: { key: string };
    create: { key: string } & AboutSettings;
    update: AboutSettings;
  }) => Promise<AboutSettingsRecord>;
};

const getAboutSectionDelegate = (): AboutSectionDelegate | undefined => {
  const prismaClient = prisma as unknown as Record<string, unknown>;
  return prismaClient.aboutSection as AboutSectionDelegate | undefined;
};

const normalizeStringList = (value: unknown, fallback: string[]): string[] => {
  if (!Array.isArray(value)) return fallback;
  const normalized = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  return normalized.length > 0 ? normalized : fallback;
};

const mapRecordToSettings = (record: AboutSettingsRecord): AboutSettings => {
  return {
    heroTitle: record.heroTitle?.trim() || DEFAULT_ABOUT_SETTINGS.heroTitle,
    heroBreadcrumb: record.heroBreadcrumb?.trim() || DEFAULT_ABOUT_SETTINGS.heroBreadcrumb,
    heroBackgroundImage: record.heroBackgroundImage?.trim() || DEFAULT_ABOUT_SETTINGS.heroBackgroundImage,
    aboutTagline: record.aboutTagline?.trim() || DEFAULT_ABOUT_SETTINGS.aboutTagline,
    profileTitle: record.profileTitle?.trim() || DEFAULT_ABOUT_SETTINGS.profileTitle,
    profileDescription: record.profileDescription?.trim() || DEFAULT_ABOUT_SETTINGS.profileDescription,
    profileImagePrimary: record.profileImagePrimary?.trim() || DEFAULT_ABOUT_SETTINGS.profileImagePrimary,
    profileImageSecondary: record.profileImageSecondary?.trim() || DEFAULT_ABOUT_SETTINGS.profileImageSecondary,
    contactTitle: record.contactTitle?.trim() || DEFAULT_ABOUT_SETTINGS.contactTitle,
    contactDescription: record.contactDescription?.trim() || DEFAULT_ABOUT_SETTINGS.contactDescription,
    contactButtonLabel: record.contactButtonLabel?.trim() || DEFAULT_ABOUT_SETTINGS.contactButtonLabel,
    contactButtonHref: record.contactButtonHref?.trim() || DEFAULT_ABOUT_SETTINGS.contactButtonHref,
    openingHoursTitle: record.openingHoursTitle?.trim() || DEFAULT_ABOUT_SETTINGS.openingHoursTitle,
    openingHoursRows: normalizeStringList(record.openingHoursRows, DEFAULT_ABOUT_SETTINGS.openingHoursRows),
    cancerTitle: record.cancerTitle?.trim() || DEFAULT_ABOUT_SETTINGS.cancerTitle,
    cancerDescription: record.cancerDescription?.trim() || DEFAULT_ABOUT_SETTINGS.cancerDescription,
    cancerButtonLabel: record.cancerButtonLabel?.trim() || DEFAULT_ABOUT_SETTINGS.cancerButtonLabel,
    cancerButtonHref: record.cancerButtonHref?.trim() || DEFAULT_ABOUT_SETTINGS.cancerButtonHref,
    missionTitle: record.missionTitle?.trim() || DEFAULT_ABOUT_SETTINGS.missionTitle,
    missionPoints: normalizeStringList(record.missionPoints, DEFAULT_ABOUT_SETTINGS.missionPoints),
    visionTitle: record.visionTitle?.trim() || DEFAULT_ABOUT_SETTINGS.visionTitle,
    visionPoints: normalizeStringList(record.visionPoints, DEFAULT_ABOUT_SETTINGS.visionPoints),
    diagnosticTitle: record.diagnosticTitle?.trim() || DEFAULT_ABOUT_SETTINGS.diagnosticTitle,
    diagnosticItems: normalizeStringList(record.diagnosticItems, DEFAULT_ABOUT_SETTINGS.diagnosticItems),
    facilitiesTitle: record.facilitiesTitle?.trim() || DEFAULT_ABOUT_SETTINGS.facilitiesTitle,
    facilitiesItems: normalizeStringList(record.facilitiesItems, DEFAULT_ABOUT_SETTINGS.facilitiesItems),
    servicesTitle: record.servicesTitle?.trim() || DEFAULT_ABOUT_SETTINGS.servicesTitle,
    servicesItems: normalizeStringList(record.servicesItems, DEFAULT_ABOUT_SETTINGS.servicesItems),
  };
};

export async function getAboutSettings(): Promise<AboutSettings> {
  const aboutDelegate = getAboutSectionDelegate();
  if (!aboutDelegate) {
    return DEFAULT_ABOUT_SETTINGS;
  }

  const settings = await aboutDelegate.findUnique({
    where: { key: ABOUT_SETTINGS_KEY },
  });

  if (!settings) {
    return DEFAULT_ABOUT_SETTINGS;
  }

  return mapRecordToSettings(settings);
}

export async function upsertAboutSettings(settings: AboutSettings): Promise<AboutSettings> {
  const aboutDelegate = getAboutSectionDelegate();
  if (!aboutDelegate) {
    throw new Error(
      "About settings model is not available. Run prisma generate and restart the server."
    );
  }

  const saved = await aboutDelegate.upsert({
    where: { key: ABOUT_SETTINGS_KEY },
    create: {
      key: ABOUT_SETTINGS_KEY,
      ...settings,
    },
    update: settings,
  });

  return mapRecordToSettings(saved);
}
