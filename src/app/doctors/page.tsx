import PageHeroHeader from "@/components/PageHeroHeader";
import SpecialistsSection from "@/components/SpecialistsSection";
import { cacheBustUrl } from "@/lib/cacheBustUrl";
import { getSiteContactSettings } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DoctorsPage() {
  const site = await getSiteContactSettings();
  const raw = site.doctorsPageHeroImage.trim();
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
          <h1 className="text-5xl font-semibold mb-6">Our Doctors</h1>
          <div className="bg-black/40 px-6 py-3 rounded-md text-sm inline-block">
            HOME › DOCTORS
          </div>
        </div>
      </PageHeroHeader>

      <SpecialistsSection />
    </div>
  );
}
