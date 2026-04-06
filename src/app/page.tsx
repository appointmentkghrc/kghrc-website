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
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 xl:px-16 [padding-left:max(1.25rem,env(safe-area-inset-left,0px))] [padding-right:max(1.25rem,env(safe-area-inset-right,0px))]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
            {/* Left: Hero text */}
            <div className="max-w-2xl lg:-translate-y-16">
              <h1 className="text-5xl lg:text-7xl font-semibold text-white leading-[1.1] mb-6">
                <span className="block whitespace-nowrap">{siteSettings.heroTitleLine1}</span>
                <span className="block text-primary whitespace-nowrap">{siteSettings.heroTitleLine2}</span>
              </h1>

              <p className="text-white/85 text-lg mb-8 leading-relaxed">
                {siteSettings.heroDescription}
              </p>

              <Link
                href={siteSettings.heroCtaHref || "/contact"}
                className="inline-flex items-center justify-center px-12 py-4 bg-white text-gray-600 font-semibold rounded-full hover:bg-gray-100 transition"
              >
                {siteSettings.heroCtaLabel || "Contact Us"}
              </Link>
            </div>

            {/* Right: Appointment box — narrower on mobile so it does not span full width */}
            <div className="w-full max-w-88 sm:max-w-md lg:max-w-[520px] mx-auto lg:mx-0 lg:ml-auto lg:-translate-y-16">
              <div className="rounded-[30px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 sm:p-10 lg:p-12">
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
