import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSiteContactSettings } from "@/lib/siteSettings";

interface DiagnosticServicePageProps {
  params: Promise<{ id: string }>;
}

type DiagnosticServiceRecord = {
  id: string;
  name: string;
  title: string;
  description: string;
  details: string;
  image: string;
  headerBackgroundImage?: string | null;
  isActive: boolean;
};

const getDiagnosticServiceDelegate = () => {
  const prismaClient = prisma as unknown as {
    diagnosticService?: {
      findUnique: (args: {
        where: { id: string };
      }) => Promise<DiagnosticServiceRecord | null>;
    };
  };

  return prismaClient.diagnosticService;
};

export default async function DiagnosticServicePage({
  params,
}: DiagnosticServicePageProps) {
  const { id } = await params;
  const diagnosticServiceDelegate = getDiagnosticServiceDelegate();
  const siteSettings = await getSiteContactSettings();

  if (!diagnosticServiceDelegate) {
    notFound();
  }

  const service = await diagnosticServiceDelegate.findUnique({
    where: { id },
  });

  if (!service || !service.isActive) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <section className="relative h-[320px] flex items-center justify-center text-white">
        <div
          className="fixed top-0 left-0 w-full h-[320px] bg-cover bg-center -z-10"
          style={{
            backgroundImage: `url(${
              service.headerBackgroundImage ||
              siteSettings.diagnosticServicesDefaultHeaderImage ||
              "https://validthemes.net/site-template/medihub/assets/img/banner/4.jpg"
            })`,
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">{service.name}</h1>
          <div className="bg-black/40 px-5 py-2 rounded-md text-sm uppercase tracking-wide">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>{" "}
            {"›"}{" "}
            <span className="text-white/90">Diagnostic Services</span>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 -mt-20 relative z-10">
        <article className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-[320px] md:h-[420px] object-cover"
          />

          <div className="p-8 md:p-10">
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">
              Diagnostic Department
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold mt-2">{service.title}</h2>

            <div className="h-px bg-gray-200 my-6" />

            <div className="space-y-5 text-gray-700 leading-relaxed">
              <p className="whitespace-pre-line">{service.description}</p>
              <p className="whitespace-pre-line">{service.details}</p>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
