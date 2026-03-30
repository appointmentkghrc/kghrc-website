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

const emptyContactSettings: SiteContactSettings = {
  officeAddress: "",
  primaryPhone: "",
  secondaryPhone: "",
  primaryEmail: "",
  secondaryEmail: "",
  mapEmbedUrl: "",
  facebookUrl: "",
  instagramUrl: "",
  twitterUrl: "",
  youtubeUrl: "",
  linkedinUrl: "",
  heroOpeningHoursRows: [],
};

type OpeningHoursRow = {
  day: string;
  time: string;
};

const parseOpeningHoursRows = (rows: unknown): OpeningHoursRow[] => {
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

const formatOpeningHoursDay = (day: string) => day.replace(/\s-\s/g, " – ");

const formatOpeningHoursTime = (time: string) => {
  const normalized = time.trim();
  if (normalized.toLowerCase() === "closed") return "Closed";

  return normalized
    .replace(/\s-\s/g, " – ")
    .replace(/\bAM\b/g, "am")
    .replace(/\bPM\b/g, "pm");
};

function LoadingText({ className = "" }: { className?: string }) {
  return (
    <p className={`text-white/70 text-sm animate-pulse ${className}`.trim()}>
      Loading…
    </p>
  );
}

export default function Footer() {
  const [contactSettings, setContactSettings] =
    useState<SiteContactSettings>(emptyContactSettings);
  const [openingHoursRows, setOpeningHoursRows] = useState<OpeningHoursRow[]>(
    []
  );
  const [departmentItems, setDepartmentItems] = useState<
    DiagnosticServiceFooterItem[]
  >([]);
  const [isContactLoading, setIsContactLoading] = useState(true);
  const [isDepartmentsLoading, setIsDepartmentsLoading] = useState(true);

  useEffect(() => {
    const fetchContactSettings = async () => {
      try {
        const response = await fetch("/api/site-settings");
        if (!response.ok) return;
        const data = await response.json();
        setContactSettings({
          officeAddress:
            typeof data?.officeAddress === "string" ? data.officeAddress : "",
          primaryPhone:
            typeof data?.primaryPhone === "string" ? data.primaryPhone : "",
          secondaryPhone:
            typeof data?.secondaryPhone === "string"
              ? data.secondaryPhone
              : "",
          primaryEmail:
            typeof data?.primaryEmail === "string" ? data.primaryEmail : "",
          secondaryEmail:
            typeof data?.secondaryEmail === "string"
              ? data.secondaryEmail
              : "",
          mapEmbedUrl:
            typeof data?.mapEmbedUrl === "string" ? data.mapEmbedUrl : "",
          facebookUrl:
            typeof data?.facebookUrl === "string" ? data.facebookUrl : "",
          instagramUrl:
            typeof data?.instagramUrl === "string" ? data.instagramUrl : "",
          twitterUrl:
            typeof data?.twitterUrl === "string" ? data.twitterUrl : "",
          youtubeUrl:
            typeof data?.youtubeUrl === "string" ? data.youtubeUrl : "",
          linkedinUrl:
            typeof data?.linkedinUrl === "string" ? data.linkedinUrl : "",
          heroOpeningHoursRows: Array.isArray(data?.heroOpeningHoursRows)
            ? (data.heroOpeningHoursRows as string[])
            : [],
        });
        setOpeningHoursRows(parseOpeningHoursRows(data?.heroOpeningHoursRows));
      } catch (error) {
        console.error("Failed to fetch contact settings for footer:", error);
      } finally {
        setIsContactLoading(false);
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
          .filter(
            (item) =>
              typeof item?.id === "string" && typeof item?.title === "string"
          )
          .map((item) => ({
            id: item.id,
            title: item.title,
          }));

        setDepartmentItems(mapped);
      } catch (error) {
        console.error("Failed to fetch diagnostic services for footer:", error);
      } finally {
        setIsDepartmentsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <footer className="bg-primary text-white pt-20 pb-8">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Opening Hours */}
          <div>
            <h4 className="font-semibold mb-4">OPENING HOURS</h4>

            <div className="space-y-3 text-white/80 text-sm">
              {isContactLoading ? (
                <LoadingText />
              ) : (
                openingHoursRows.map((row, idx) => {
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
                        <span className="bg-secondary text-white px-4 py-1 rounded-full text-xs">
                          Closed
                        </span>
                      ) : (
                        <span>{time}</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Our Department */}
          <div>
            <h3 className="text-xl font-semibold mb-6 relative">
              Our Department
              <span className="block w-10 h-[2px] bg-secondary mt-3"></span>
            </h3>

            <ul className="space-y-3 text-white/80">
              {isDepartmentsLoading ? (
                <li>
                  <LoadingText />
                </li>
              ) : (
                departmentItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/diagnostic-services/${item.id}`}
                      className="hover:text-black transition"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Location Map */}
          <div>
            <h3 className="text-xl font-semibold mb-6 relative">
              Our Location
              <span className="block w-10 h-[2px] bg-secondary mt-3"></span>
            </h3>

            <div className="relative rounded-lg overflow-hidden border border-white/10 shadow-md h-40 bg-white/5">
              {isContactLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoadingText />
                </div>
              ) : contactSettings.mapEmbedUrl.trim() ? (
                <iframe
                  title="Office location map"
                  src={contactSettings.mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0"
                />
              ) : null}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-6 relative">
              Contact
              <span className="block w-10 h-[2px] bg-secondary mt-3"></span>
            </h3>

            {isContactLoading ? (
              <LoadingText />
            ) : (
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
                  <p className="text-white font-semibold mb-1">Address</p>
                  <p>{contactSettings.officeAddress}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-white/70 gap-4">
          <p>
            © Copyright 2026. All Rights Reserved by{" "}
            <span className="text-primary">KGH</span>
          </p>

          <div className="flex gap-6 md:mt-0 flex-wrap items-center justify-center">
            <span className="hover:text-black cursor-pointer">
              Terms of user
            </span>
            <span className="hover:text-black cursor-pointer">License</span>
            <span className="hover:text-black cursor-pointer">Support</span>
          </div>

          <div className="flex gap-3 min-h-9 items-center">
            {isContactLoading ? (
              <LoadingText />
            ) : (
              [
                {
                  key: "facebook",
                  href: contactSettings.facebookUrl,
                  icon: "fab fa-facebook-f",
                  label: "Facebook",
                },
                {
                  key: "instagram",
                  href: contactSettings.instagramUrl,
                  icon: "fab fa-instagram",
                  label: "Instagram",
                },
                {
                  key: "twitter",
                  href: contactSettings.twitterUrl,
                  icon: "fab fa-x-twitter",
                  label: "X",
                },
                {
                  key: "youtube",
                  href: contactSettings.youtubeUrl,
                  icon: "fab fa-youtube",
                  label: "YouTube",
                },
                {
                  key: "linkedin",
                  href: contactSettings.linkedinUrl,
                  icon: "fab fa-linkedin-in",
                  label: "LinkedIn",
                },
              ]
                .filter(
                  (item) =>
                    typeof item.href === "string" && item.href.trim().length > 0
                )
                .map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="w-9 h-9 rounded-full bg-secondary text-white flex items-center justify-center hover:bg-secondary/90 transition"
                  >
                    <i className={item.icon}></i>
                  </a>
                ))
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
