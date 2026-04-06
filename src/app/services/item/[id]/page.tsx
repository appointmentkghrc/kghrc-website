import Link from "next/link";
import { notFound } from "next/navigation";
import { cacheBustUrl } from "@/lib/cacheBustUrl";
import { getSiteContactSettings } from "@/lib/siteSettings";
import { getActiveServicePageItemForDetail } from "@/lib/servicePageItems";
import { servicePageItemHasDetailPage } from "@/lib/servicePageItemDetail";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ServicePageItemDetailProps {
  params: Promise<{ id: string }>;
}

export default async function ServicePageItemDetailPage({
  params,
}: ServicePageItemDetailProps) {
  const { id } = await params;
  const item = await getActiveServicePageItemForDetail(id);
  const siteSettings = await getSiteContactSettings();

  if (!item || !servicePageItemHasDetailPage(item)) {
    notFound();
  }

  const headerBg = cacheBustUrl(
    item.detailPageHeaderImage?.trim() ||
      siteSettings.servicesPageHeroImage.trim() ||
      "https://validthemes.net/site-template/medihub/assets/img/banner/4.jpg"
  );
  const bodyImage = item.detailPageImage?.trim()
    ? cacheBustUrl(item.detailPageImage.trim())
    : null;

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <section className="relative h-[320px] flex items-center justify-center text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${headerBg})`,
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">{item.heading}</h1>
          <div className="bg-black/40 px-5 py-2 rounded-md text-sm uppercase tracking-wide">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>{" "}
            {"›"}{" "}
            <Link href="/services" className="hover:text-primary transition-colors">
              Services
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 -mt-20 relative z-10">
        <article className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {bodyImage ? (
            <img
              src={bodyImage}
              alt={item.heading}
              className="w-full h-[320px] md:h-[420px] object-cover"
            />
          ) : null}

          <div className="p-8 md:p-10">
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">
              Our Services
            </p>

            <div className="h-px bg-gray-200 my-6" />

            <div className="space-y-5 text-gray-700 leading-relaxed">
              <p className="whitespace-pre-line">{item.description}</p>
              <p className="whitespace-pre-line">{item.detailPageContent}</p>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition"
              >
                Back to Services
              </Link>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
