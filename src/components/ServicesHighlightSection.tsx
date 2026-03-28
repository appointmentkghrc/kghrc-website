"use client";

import Link from "next/link";

import type { ServicesHighlightItem } from "@/lib/servicesHighlightDefaults";
import { resolveServicesHighlightIcon } from "@/lib/servicesHighlightIcons";

type ServicesHighlightSectionProps = {
  sectionTitle: string;
  items: ServicesHighlightItem[];
};

export default function ServicesHighlightSection({
  sectionTitle,
  items,
}: ServicesHighlightSectionProps) {
  return (
    <section className="relative py-28 bg-gradient-to-r from-[#021B2F] via-[#052A46] to-[#021B2F] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {sectionTitle.trim().length > 0 && (
          <h2 className="text-center text-white text-2xl md:text-3xl font-semibold tracking-wide mb-12">
            {sectionTitle}
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((service, index) => {
            const Icon = resolveServicesHighlightIcon(service.iconKey);

            return (
              <Link
                key={`${service.title}-${index}`}
                href={service.href}
                className="relative group rounded-2xl p-10 text-center cursor-pointer transition-all duration-500 overflow-hidden bg-[#0c2236] text-white block no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#021B2F]"
              >
                <div className="absolute inset-0 bg-primary translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 flex items-center justify-center rounded-full mb-6 border-2 border-primary text-primary bg-transparent transition-all duration-300 group-hover:bg-white group-hover:text-primary">
                    <Icon size={32} />
                  </div>

                  <h3 className="tracking-wider font-semibold text-lg">{service.title}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
