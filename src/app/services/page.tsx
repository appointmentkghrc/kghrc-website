import PageHeroHeader from "@/components/PageHeroHeader";
import DepartmentsSection from "@/components/DepartmentsSection";
import PatientTestimonialsSection from "@/components/PatientTestimonialsSection";
import ServicesPageCardsSection from "@/components/ServicesPageCardsSection";
import { cacheBustUrl } from "@/lib/cacheBustUrl";
import { getActiveServicePageItems } from "@/lib/servicePageItems";
import { getSiteContactSettings } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ServicesPage() {
  const [serviceCards, site] = await Promise.all([
    getActiveServicePageItems(),
    getSiteContactSettings(),
  ]);
  const raw = site.servicesPageHeroImage.trim();
  const hero = raw ? cacheBustUrl(raw) : "";

  return (
    <div>
      <PageHeroHeader
        imageUrl={hero}
        className="h-[420px]"
        fixedHeightClass="h-[420px]"
        overlayClassName="bg-black/60"
      >
        <div className="text-center">
          <h1 className="text-5xl font-semibold mb-6">Our Services</h1>
          <div className="bg-black/40 px-6 py-3 rounded-md text-sm inline-block">
            HOME › SERVICES
          </div>
        </div>
      </PageHeroHeader>


      <ServicesPageCardsSection items={serviceCards} />
      <DepartmentsSection showOpeningHours={false} compactDiagnosticImage />

      <PatientTestimonialsSection />
    </div>
  );
}
