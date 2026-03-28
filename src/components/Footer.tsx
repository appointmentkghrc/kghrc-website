// components/Footer.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SiteContactSettings = {
  officeAddress: string;
  primaryPhone: string;
  secondaryPhone: string;
  primaryEmail: string;
  secondaryEmail: string;
  mapEmbedUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  heroOpeningHoursRows: string[];
};

type DiagnosticServiceFooterItem = {
  id: string;
  title: string;
};

const defaultContactSettings: SiteContactSettings = {
  officeAddress:
    "Kanke General Hospital, Arsande Road, Near Kanke Block Chowk, Kanke, Jharkhand 834006",
  primaryPhone: "+91-6206803663",
  secondaryPhone: "06512450844",
  primaryEmail: "appointment.kghrc@gmail.com",
  secondaryEmail: "Kankegeneralhospital@gmail.com",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Kanke%20General%20Hospital%2C%20Arsande%20Road%2C%20Near%20Kanke%20Block%20Chowk%2C%20Kanke%2C%20Jharkhand%20834006&output=embed",
  facebookUrl: "",
  instagramUrl: "",
  twitterUrl: "",
  youtubeUrl: "",
  linkedinUrl: "",
  heroOpeningHoursRows: [],
};

const fallbackDepartmentTitles = [
  "Medecine and Health",
  "Dental Care and Surgery",
  "Eye Treatment",
  "Children Chare",
  "Nuclear magnetic",
  "Traumatology",
  "X-ray",
];

type OpeningHoursRow = {
  day: string;
  time: string;
};

const parseOpeningHoursRows = (
  rows: unknown
): OpeningHoursRow[] => {
  if (!Array.isArray(rows)) return [];

  return rows
    .filter((row): row is string => typeof row === "string")
    .map((row) => row.split("|"))
    .map(([day, time]) => ({
      day: (day ?? "").trim(),
      time: (time ?? "").trim(),
    }))
    .filter((row) => row.day.length > 0);
};

const formatOpeningHoursDay = (day: string) =>
  day.replace(/\s-\s/g, " – ");

const formatOpeningHoursTime = (time: string) => {
  const normalized = time.trim();
  if (normalized.toLowerCase() === "closed") return "Closed";

  return normalized
    .replace(/\s-\s/g, " – ")
    .replace(/\bAM\b/g, "am")
    .replace(/\bPM\b/g, "pm");
};

export default function Footer() {
    const [contactSettings, setContactSettings] = useState<SiteContactSettings>(
      defaultContactSettings
    );
  const [openingHoursRows, setOpeningHoursRows] = useState<OpeningHoursRow[]>([]);
    const [departmentItems, setDepartmentItems] = useState<
      DiagnosticServiceFooterItem[]
    >([]);

  const fallbackOpeningHoursRows: OpeningHoursRow[] = [
    { day: "Mon – Tues :", time: "6.00 am – 10.00 pm" },
    { day: "Wednes – Thurs :", time: "8.00 am – 6.00 pm" },
    { day: "Sun :", time: "Closed" },
  ];

    useEffect(() => {
      const fetchContactSettings = async () => {
        try {
          const response = await fetch("/api/site-settings");
          if (!response.ok) return;
          const data = await response.json();
          setContactSettings({
            officeAddress: data?.officeAddress || defaultContactSettings.officeAddress,
            primaryPhone: data?.primaryPhone || defaultContactSettings.primaryPhone,
            secondaryPhone: data?.secondaryPhone || defaultContactSettings.secondaryPhone,
            primaryEmail: data?.primaryEmail || defaultContactSettings.primaryEmail,
            secondaryEmail: data?.secondaryEmail || defaultContactSettings.secondaryEmail,
            mapEmbedUrl: data?.mapEmbedUrl || defaultContactSettings.mapEmbedUrl,
            facebookUrl: data?.facebookUrl || defaultContactSettings.facebookUrl,
            instagramUrl: data?.instagramUrl || defaultContactSettings.instagramUrl,
            twitterUrl: data?.twitterUrl || defaultContactSettings.twitterUrl,
            youtubeUrl: data?.youtubeUrl || defaultContactSettings.youtubeUrl,
            linkedinUrl: data?.linkedinUrl || defaultContactSettings.linkedinUrl,
          heroOpeningHoursRows: Array.isArray(data?.heroOpeningHoursRows)
            ? (data.heroOpeningHoursRows as string[])
            : defaultContactSettings.heroOpeningHoursRows,
          });
        setOpeningHoursRows(parseOpeningHoursRows(data?.heroOpeningHoursRows));
        } catch (error) {
          console.error("Failed to fetch contact settings for footer:", error);
        }
      };

      fetchContactSettings();
    }, []);

    useEffect(() => {
      const fetchDepartments = async () => {
        try {
          const response = await fetch("/api/diagnostic-services");
          if (!response.ok) return;
          const data = (await response.json()) as Array<{
            id: string;
            title: string;
          }>;

          const mapped = data
            .filter((item) => typeof item?.id === "string" && typeof item?.title === "string")
            .map((item) => ({
              id: item.id,
              title: item.title,
            }));

          setDepartmentItems(mapped);
        } catch (error) {
          console.error("Failed to fetch diagnostic services for footer:", error);
        }
      };

      fetchDepartments();
    }, []);

    return (
      <footer className="bg-[#214d80] text-white pt-20 pb-8">
  
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
  
          {/* Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

            {/* Opening Hours */}
            <div>
              <h4 className="font-semibold mb-4">OPENING HOURS</h4>
  
              <div className="space-y-3 text-white/80 text-sm">
                {(openingHoursRows.length > 0
                  ? openingHoursRows
                  : fallbackOpeningHoursRows
                ).map((row, idx) => {
                  const day = formatOpeningHoursDay(row.day);
                  const time = formatOpeningHoursTime(row.time);
                  const isClosed = time.toLowerCase() === "closed";

                  return (
                    <div
                      // eslint-disable-next-line react/no-array-index-key
                      key={`${day}-${time}-${idx}`}
                      className={
                        isClosed
                          ? "flex justify-between items-center"
                          : "flex justify-between border-b border-white/20 pb-2"
                      }
                    >
                      <span>{day}</span>
                      {isClosed ? (
                        <span className="bg-primary text-white px-4 py-1 rounded-full text-xs">
                          Closed
                        </span>
                      ) : (
                        <span>{time}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
  
          {/* Our Department */}
          <div>
            <h3 className="text-xl font-semibold mb-6 relative">
              Our Department
              <span className="block w-10 h-[2px] bg-primary mt-3"></span>
            </h3>

            <ul className="space-y-3 text-white/80">
              {departmentItems.length > 0
                ? departmentItems.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/diagnostic-services/${item.id}`}
                        className="hover:text-primary transition"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))
                : fallbackDepartmentTitles.map((item) => (
                    <li key={item} className="text-white/80">
                      {item}
                    </li>
                  ))}
            </ul>
          </div>

          {/* Location Map */}
          <div>
            <h3 className="text-xl font-semibold mb-6 relative">
              Our Location
              <span className="block w-10 h-[2px] bg-primary mt-3"></span>
            </h3>

            <div className="rounded-lg overflow-hidden border border-white/10 shadow-md h-40">
              <iframe
                title="Office location map"
                src={contactSettings.mapEmbedUrl}
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              />
            </div>
          </div>
  
            {/* Contact */}
            <div>
            <h3 className="text-xl font-semibold mb-6 relative">
              Contact
              <span className="block w-10 h-[2px] bg-primary mt-3"></span>
            </h3>
  
              <div className="space-y-6 text-white/80 text-sm">
  
                <div>
                  <p className="text-white font-semibold mb-1">PHONE</p>
                  <p>{contactSettings.primaryPhone}</p>
                  <p>{contactSettings.secondaryPhone}</p>
                </div>
  
                <div>
                  <p className="text-white font-semibold mb-1">EMAIL</p>
                  <p>{contactSettings.primaryEmail}</p>
                  <p>{contactSettings.secondaryEmail}</p>
                </div>
  
                <div>
                  <p className="text-white font-semibold mb-1">OFFICE</p>
                  <p>{contactSettings.officeAddress}</p>
                </div>
  
              </div>
            </div>
  
          </div>
  
          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-white/70 gap-4">
  
              <p>
                © Copyright 2026. All Rights Reserved by{" "}
                <span className="text-primary">KGH</span>
              </p>
  
            <div className="flex gap-6 md:mt-0 flex-wrap items-center justify-center">
              <span className="hover:text-primary cursor-pointer">
                Terms of user
              </span>
              <span className="hover:text-primary cursor-pointer">
                License
              </span>
              <span className="hover:text-primary cursor-pointer">
                Support
              </span>
            </div>

            <div className="flex gap-3">
              {[
                { key: "facebook", href: contactSettings.facebookUrl, icon: "fab fa-facebook-f", label: "Facebook" },
                { key: "instagram", href: contactSettings.instagramUrl, icon: "fab fa-instagram", label: "Instagram" },
                { key: "twitter", href: contactSettings.twitterUrl, icon: "fab fa-x-twitter", label: "X" },
                { key: "youtube", href: contactSettings.youtubeUrl, icon: "fab fa-youtube", label: "YouTube" },
                { key: "linkedin", href: contactSettings.linkedinUrl, icon: "fab fa-linkedin-in", label: "LinkedIn" },
              ]
                .filter((item) => typeof item.href === "string" && item.href.trim().length > 0)
                .map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center hover:border-primary hover:text-primary transition"
                  >
                    <i className={item.icon}></i>
                  </a>
                ))}
            </div>
  
          </div>
  
        </div>
      </footer>
    );
  }