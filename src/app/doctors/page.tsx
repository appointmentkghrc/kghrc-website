import SpecialistsSection from "@/components/SpecialistsSection";
import { cacheBustUrl } from "@/lib/cacheBustUrl";
import { getSiteContactSettings } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DoctorsPage() {
  const site = await getSiteContactSettings();
  const hero = cacheBustUrl(site.doctorsPageHeroImage);

  return (
    <div>
      <section className="relative h-[420px] flex items-center justify-center text-white">
        <div
          className="fixed top-0 left-0 w-full h-[420px] bg-cover bg-center -z-10"
          style={{
            backgroundImage: `url(${hero})`,
          }}
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-semibold mb-6">Our Doctors</h1>
          <div className="bg-black/40 px-6 py-3 rounded-md text-sm">
            HOME › DOCTORS
          </div>
        </div>
      </section>

      <SpecialistsSection />
    </div>
  );
}
