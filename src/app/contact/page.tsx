import Link from "next/link";
import PageHeroHeader from "@/components/PageHeroHeader";
import ContactForm from "@/components/ContactForm";
import { cacheBustUrl } from "@/lib/cacheBustUrl";
import { getSiteContactSettings } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ContactPage() {
  const contactSettings = await getSiteContactSettings();
  const raw = contactSettings.contactPageHeroImage.trim();
  const hero = raw ? cacheBustUrl(raw) : "";

  return (
    <div>
      <PageHeroHeader
        imageUrl={hero}
        className="h-[420px]"
        overlayClassName="bg-black/60"
      >
        <div className="text-center">
          <h1 className="text-5xl font-semibold mb-6">Contact Us</h1>
          <div className="bg-black/40 px-6 py-3 rounded-md text-sm inline-block">
            <Link href="/" className="hover:text-primary transition-colors">
              HOME
            </Link>{" "}
            ›{" "}
            <span className="text-white/90">CONTACT</span>
          </div>
        </div>
      </PageHeroHeader>

      {/* ================= WHITE SLIDING SECTION ================= */}
      <section className="relative z-20 bg-white -mt-24 pt-24 pb-16">

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3">

          {/* Location */}
          <div className="p-16 text-center border-r border-gray-200">
            <div className="text-primary text-4xl mb-6">📍</div>
            <h3 className="text-xl font-semibold mb-4">ADDRESS</h3>
            <div className="w-10 h-[2px] bg-secondary mx-auto mb-6"></div>
            <p className="text-gray-600 leading-relaxed">
              <a
                href={
                  contactSettings.mapEmbedUrl.trim() ||
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    contactSettings.officeAddress
                  )}`
                }
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition"
              >
                {contactSettings.officeAddress}
              </a>
            </p>
          </div>

          {/* Emergency */}
          <div className="p-16 text-center bg-primary text-white">
            <div className="text-4xl mb-6">📞</div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <div className="w-10 h-[2px] bg-white mx-auto mb-6"></div>
            <p className="text-2xl font-bold mb-2">
              <a
                href={`tel:${contactSettings.primaryPhone.replace(/[^\d+]/g, "")}`}
                className="hover:text-white/90 transition"
              >
                {contactSettings.primaryPhone}
              </a>
            </p>
            <p className="text-lg">
              <a
                href={`tel:${contactSettings.secondaryPhone.replace(/[^\d+]/g, "")}`}
                className="hover:text-white/90 transition"
              >
                {contactSettings.secondaryPhone}
              </a>
            </p>
          </div>

          {/* Email */}
          <div className="p-16 text-center border-l border-gray-200">
            <div className="text-primary text-4xl mb-6">✉️</div>
            <h3 className="text-xl font-semibold mb-4">EMAIL</h3>
            <div className="w-10 h-[2px] bg-secondary mx-auto mb-6"></div>
            <p className="text-gray-600">
              <a
                href={`mailto:${contactSettings.primaryEmail.trim()}`}
                className="hover:text-primary transition"
              >
                {contactSettings.primaryEmail}
              </a>
            </p>
            <p className="text-gray-600">
              <a
                href={`mailto:${contactSettings.secondaryEmail.trim()}`}
                className="hover:text-primary transition"
              >
                {contactSettings.secondaryEmail}
              </a>
            </p>
          </div>

        </div>
      </section>

      {/* ================= CONTACT FORM SECTION ================= */}
      <section className="bg-primary text-white py-28">
        <div className="max-w-[1000px] mx-auto px-6 text-center">

          <h2 className="text-4xl font-semibold mb-6">Get in touch</h2>

          <p className="text-white/80 max-w-2xl mx-auto mb-12">
          We would love to hear from you. Please share your valuable feedback.
          </p>

          <ContactForm />

        </div>
      </section>

      {/* ================= MAP ================= */}
      <section className="w-full h-[450px]">
        <iframe
          src={contactSettings.mapEmbedUrl}
          className="w-full h-full"
          loading="lazy"
        ></iframe>
      </section>

    </div>
  );
}
