import Link from "next/link";
import type { ServicePageItem } from "@prisma/client";
import { ServicePageIcon } from "@/lib/servicePageIcons";
import { getServicePageItemCardHref } from "@/lib/servicePageItemDetail";

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

export default function ServicesPageCardsSection({
  items,
}: {
  items: ServicePageItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="relative py-16 bg-gray-100">
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => {
            const href = getServicePageItemCardHref(item);
            const cardInner = (
              <>
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center group-hover:bg-[#00c2c0] transition-colors">
                    <ServicePageIcon
                      name={item.icon}
                      className="text-white w-10 h-10"
                    />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.heading}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </>
            );

            const cardClass =
              "group bg-white rounded-xl shadow-lg p-10 text-center hover:scale-105 transition-transform block h-full";

            if (!href) {
              return (
                <div key={item.id} className={cardClass}>
                  {cardInner}
                </div>
              );
            }

            if (isExternalHref(href)) {
              return (
                <a
                  key={item.id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClass}
                >
                  {cardInner}
                </a>
              );
            }

            return (
              <Link key={item.id} href={href} className={cardClass}>
                {cardInner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
