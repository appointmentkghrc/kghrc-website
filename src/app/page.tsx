import DepartmentsSection from "@/components/DepartmentsSection";
import ServicesHighlightSection from "@/components/ServicesHighlightSection";
import SpecialistsSection from "@/components/SpecialistsSection";
import StatsSection from "@/components/StatsSection";
import PatientTestimonialsSection from "@/components/PatientTestimonialsSection";
import RecentBlogsSection from "@/components/RecentBlogsSection";
import AppointmentMobileInput from "@/components/AppointmentMobileInput";
import { getSiteContactSettings } from "@/lib/siteSettings";
import Link from "next/link";

export default async function Home() {
  const siteSettings = await getSiteContactSettings();
  const openingHours = siteSettings.heroOpeningHoursRows
    .map((row) => row.split("|"))
    .map(([day, time]) => ({
      day: (day ?? "").trim(),
      time: (time ?? "").trim(),
    }))
    .filter((row) => row.day.length > 0);

  return (
    <div className="min-h-screen relative">
      {/* Background with overlay */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `url(${siteSettings.heroBackgroundImage})`,
          // no zoom out, use default cover (no backgroundSize override)
        }}
      />
      <div
        className="fixed inset-0 -z-10 hero-overlay"
        style={{ mixBlendMode: "multiply" }}
      />

      {/* Hero Content */}
      <main className="relative z-10 min-h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-10 xl:px-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
            {/* Left: Hero text */}
            <div className="max-w-2xl -translate-y-16">
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

            {/* Right: Appointment box */}
            <div className="w-full max-w-[520px] lg:ml-auto lg:-translate-y-16">
              <div className="rounded-[30px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-10 lg:p-12">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Make An Appointment
                </h2>
                <div className="h-px w-12 bg-white/40 mb-6" />

                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                  <AppointmentMobileInput />

                  <textarea
                    name="query"
                    placeholder="Write your query/problem"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    required
                  />

                  <button
                    type="submit"
                    className="w-full py-3 mt-2 rounded-full bg-primary text-white font-semibold hover:bg-[#00c2c0] transition"
                  >
                    Submit Query
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Section below hero - enables scrolling */}
      <DepartmentsSection openingHours={openingHours} />
      <ServicesHighlightSection />
      <SpecialistsSection />
      <StatsSection />
      <PatientTestimonialsSection />
      <RecentBlogsSection />
    </div>
  );
}
