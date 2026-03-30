import DepartmentsSection from "@/components/DepartmentsSection";
import PatientTestimonialsSection from "@/components/PatientTestimonialsSection";
import ServicesPageCardsSection from "@/components/ServicesPageCardsSection";
import { getActiveServicePageItems } from "@/lib/servicePageItems";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const serviceCards = await getActiveServicePageItems();

  return (
    <div>
      <section className="relative h-[420px] flex items-center justify-center text-white">
        <div
          className="fixed top-0 left-0 w-full h-[420px] bg-cover bg-center -z-10"
          style={{
            backgroundImage:
              "url(https://validthemes.net/site-template/medihub/assets/img/banner/5.jpg)",
          }}
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-semibold mb-6">Our Services</h1>
          <div className="bg-black/40 px-6 py-3 rounded-md text-sm">
            HOME › SERVICES
          </div>
        </div>
      </section>


      <ServicesPageCardsSection items={serviceCards} />
      <DepartmentsSection showOpeningHours={false} compactDiagnosticImage />

      <PatientTestimonialsSection />
    </div>
  );
}
