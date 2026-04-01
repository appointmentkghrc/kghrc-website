import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Ensures core site configuration exists. Does not insert demo doctors, blogs,
 * testimonials, or other content — add those via Admin or your own migration.
 */
async function main() {
  console.log("Starting seed...");

  await prisma.siteSetting.upsert({
    where: { key: "main" },
    create: {
      key: "main",
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
      heroTitleLine1: "Best care for your",
      heroTitleLine2: "Good health",
      heroDescription:
        "The ourselves suffering the sincerity. Inhabit her manners adapted age certain. Debating offended at branched striking be subjects.",
      heroCtaLabel: "Contact Us",
      heroCtaHref: "/contact",
      doctorsSectionDescription:
        "While mirth large of on front. Ye he greater related adapted proceed entered an. Through it examine express promise no.",
      pmjayPatientsTreatedValue: "0",
      pmjayPrimaryLogoUrl: null,
      pmjaySecondaryLogoUrl: null,
    },
    update: {
      heroOpeningHoursRows: [],
    },
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
