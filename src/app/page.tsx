import DepartmentsSection from "@/components/DepartmentsSection";
import PmjayPatientsTreatedSection from "@/components/PmjayPatientsTreatedSection";
import ServicesHighlightSection from "@/components/ServicesHighlightSection";
import SpecialistsSection from "@/components/SpecialistsSection";
import StatsSection from "@/components/StatsSection";
import PatientTestimonialsSection from "@/components/PatientTestimonialsSection";
import RecentBlogsSection from "@/components/RecentBlogsSection";
import AppointmentHeroForm from "@/components/AppointmentHeroForm";
import { getAboutSettings, parseOpeningHoursRowsToItems } from "@/lib/aboutSettings";
import { cacheBustUrl } from "@/lib/cacheBustUrl";
import { getSiteContactSettings } from "@/lib/siteSettings";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const [siteSettings, aboutSettings] = await Promise.all([
    getSiteContactSettings(),
    getAboutSettings(),
  ]);
  const pmjayPatientsTreatedValue =
    siteSettings.pmjayPatientsTreatedValue.trim() || "0";
  const openingHours = parseOpeningHoursRowsToItems(aboutSettings.openingHoursRows);
  const heroBg = cacheBustUrl(siteSettings.heroBackgroundImage);
  const statsBg = cacheBustUrl(siteSettings.statsSectionBackgroundImage);

  return (
    <div className="min-h-screen relative">
      {/* Background with overlay */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroBg})`,
          // no zoom out, use default cover (no backgroundSize override)
        }}
      />
      <div
        className="fixed inset-0 -z-10 hero-overlay"
        style={{ mixBlendMode: "multiply" }}
      />

      {/* Hero Content — top padding + start alignment on small screens so copy is not flush to the top; translate only on lg */}
      <main className="relative z-10 min-h-screen flex items-start justify-center pt-6 pb-12 sm:pt-8 sm:pb-14 lg:items-center lg:py-0">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
          {/* lg: gap + column max widths must fit inside max-w-7xl or columns overlap */}
          <div className="flex flex-col lg:flex-row lg:items-start items-center gap-12 lg:gap-8 xl:gap-10">
            {/* Left: Hero text — flex-1 min-w-0 keeps copy in its column (no bleed under the form) */}
            <div className="w-full min-w-0 flex-1 max-w-2xl lg:max-w-none lg:-translate-y-16">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white leading-[1.1] mb-6 wrap-anywhere">
                <span className="block sm:whitespace-nowrap">{siteSettings.heroTitleLine1}</span>
                <span className="block text-primary sm:whitespace-nowrap">{siteSettings.heroTitleLine2}</span>
              </h1>

              <p className="text-white/85 text-base sm:text-lg mb-8 leading-relaxed">
                {siteSettings.heroDescription}
              </p>

              <Link
                href={siteSettings.heroCtaHref || "/contact"}
                className="inline-flex items-center justify-center px-12 py-4 bg-white text-gray-600 font-semibold rounded-full hover:bg-gray-100 transition"
              >
                {siteSettings.heroCtaLabel || "Contact Us"}
              </Link>
            </div>

            {/* Right: fixed max width on lg so it cannot crowd the headline */}
            <div className="w-full shrink-0 max-w-88 sm:max-w-md lg:max-w-[360px] xl:max-w-[400px] mx-auto lg:mx-0 lg:-translate-y-16">
              <div className="rounded-[30px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 sm:p-10 lg:p-8 xl:p-10">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Make An Appointment
                </h2>
                <div className="h-px w-12 bg-white/40 mb-6" />

                <AppointmentHeroForm />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Section below hero - enables scrolling */}
      <PmjayPatientsTreatedSection
        pmjayPatientsTreatedValue={pmjayPatientsTreatedValue}
        pmjayPrimaryLogoUrl={siteSettings.pmjayPrimaryLogoUrl}
        pmjaySecondaryLogoUrl={siteSettings.pmjaySecondaryLogoUrl}
      />
      <DepartmentsSection
        openingHours={openingHours}
        openingHoursTitle={aboutSettings.openingHoursTitle}
      />
      <ServicesHighlightSection
        sectionTitle={siteSettings.servicesHighlightTitle}
        items={siteSettings.servicesHighlightItems}
      />
      <SpecialistsSection />
      <StatsSection backgroundImageUrl={statsBg} />
      <PatientTestimonialsSection />
      <RecentBlogsSection />
    </div>
  );
}
