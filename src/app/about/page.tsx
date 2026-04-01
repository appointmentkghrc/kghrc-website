"use client";

import { apiFetch } from "@/lib/apiFetch";
import { useEffect, useState } from "react";
import PatientTestimonialsSection from "@/components/PatientTestimonialsSection";
import Link from "next/link";
import type { AboutSettings } from "@/lib/aboutSettings";

type OpeningHoursRow = {
  day: string;
  time: string;
};

const parseOpeningHoursRows = (rows: string[] | undefined | null): OpeningHoursRow[] => {
  if (!rows || rows.length === 0) return [];

  return rows
    .filter((row) => typeof row === "string" && row.includes("|"))
    .map((row) => row.split("|"))
    .map(([day, time]) => ({
      day: (day ?? "").trim(),
      time: (time ?? "").trim(),
    }))
    .filter((row) => row.day.length > 0);
};

const formatOpeningHoursTime = (time: string) => {
  const normalized = time.trim();
  if (normalized.toLowerCase() === "closed") return "Closed";

  return normalized
    .replace(/\s-\s/g, " - ")
    .replace(/\bAM\b/gi, "AM")
    .replace(/\bPM\b/gi, "PM");
};

interface Doctor {
  id: string;
  name: string;
  designation: string;
  appointmentLink?: string;
  email?: string;
  phone?: string;
  facebook?: string;
  linkedin?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

type TpaInsurancePartnerRow = {
  id: string;
  name: string;
  logoUrl: string;
};

export default function AboutPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [aboutSettings, setAboutSettings] = useState<AboutSettings | null>(null);
  const [loadingAboutSettings, setLoadingAboutSettings] = useState(true);
  const [insurancePartners, setInsurancePartners] = useState<TpaInsurancePartnerRow[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(true);

  useEffect(() => {
    fetchAboutSettings();
    fetchDoctors();
  }, []);

  useEffect(() => {
    const loadPartners = async () => {
      try {
        const response = await apiFetch("/api/tpa-insurance-partners");
        if (!response.ok) throw new Error("Failed to fetch TPA partners");
        const data: unknown = await response.json();
        setInsurancePartners(Array.isArray(data) ? (data as TpaInsurancePartnerRow[]) : []);
      } catch (error) {
        console.error("Error fetching TPA partners:", error);
        setInsurancePartners([]);
      } finally {
        setLoadingPartners(false);
      }
    };
    loadPartners();
  }, []);

  const fetchAboutSettings = async () => {
    try {
      setLoadingAboutSettings(true);
      const response = await apiFetch("/api/about-settings");
      if (!response.ok) throw new Error("Failed to fetch about settings");
      const data: AboutSettings = await response.json();

      const preloadImage = (src: string) =>
        new Promise<void>((resolve) => {
          if (!src) {
            resolve();
            return;
          }
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        });

      await Promise.all([
        preloadImage(data.heroBackgroundImage),
        preloadImage(data.profileImagePrimary),
        preloadImage(data.profileImageSecondary),
      ]);

      setAboutSettings(data);
    } catch (error) {
      console.error("Error fetching about settings:", error);
      setAboutSettings(null);
    } finally {
      setLoadingAboutSettings(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const response = await apiFetch("/api/doctors");
      if (!response.ok) throw new Error("Failed to fetch doctors");
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoadingDoctors(false);
    }
  };

  if (loadingAboutSettings || !aboutSettings) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-primary"></div>
      </div>
    );
  }

  const openingHoursRowsToRender = parseOpeningHoursRows(aboutSettings.openingHoursRows);

  return (
    <div>

      {/* ================= HERO ================= */}
      <section className="relative h-[420px] flex items-center justify-center text-white">

        <div
          className="fixed top-0 left-0 w-full h-[420px] bg-cover bg-center -z-10"
          style={{
            backgroundImage: `url(${aboutSettings.heroBackgroundImage})`,
          }}
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-semibold mb-6">{aboutSettings.heroTitle}</h1>
          <div className="bg-black/40 px-6 py-3 rounded-md text-sm">
            {aboutSettings.heroBreadcrumb}
          </div>
        </div>
      </section>

      {/* ================= ABOUT CONTENT (ORIGINAL UI) ================= */}
      <section className="relative z-20 bg-white -mt-24 pt-24 pb-28">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 px-6">
          {/* Left Images */}
          <div className="relative">
            <img
              src={aboutSettings.profileImagePrimary}
              className="rounded-md"
              alt="About hospital"
            />
            <img
              src={aboutSettings.profileImageSecondary}
              className="absolute bottom-[-60px] right-[-40px] w-[220px] rounded-md shadow-xl"
              alt="Hospital team"
            />
          </div>

          {/* Right Text */}
          <div>
            <p className="text-primary mb-3 font-medium uppercase tracking-wide">
              {aboutSettings.aboutTagline}
            </p>

            <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
              {aboutSettings.profileTitle}
            </h2>

            <p className="text-gray-700 leading-relaxed mb-8">
              {aboutSettings.profileDescription}
            </p>

          </div>
        </div>
      </section>

      {/* ================= FEATURES STRIP (ORIGINAL UI) ================= */}
      <section className="grid grid-cols-1 md:grid-cols-3">
        <div className="p-16 text-center bg-white shadow-md">
          <h3 className="text-xl font-semibold mb-4">{aboutSettings.contactTitle}</h3>
          <p className="text-gray-600 mb-6">
            {aboutSettings.contactDescription}
          </p>
          <a
            href={aboutSettings.contactButtonHref}
            className="inline-block bg-secondary hover:bg-secondary/90 transition text-white px-6 py-3 rounded-md"
          >
            {aboutSettings.contactButtonLabel}
          </a>
        </div>

        <div className="p-16 text-center bg-primary text-white">
          <h3 className="text-xl font-semibold mb-4">{aboutSettings.openingHoursTitle}</h3>
          <div className="space-y-3 text-sm">
            {openingHoursRowsToRender.map((row, index) => {
              const day = row.day;
              const timeFormatted = formatOpeningHoursTime(row.time);
              const isClosed = timeFormatted.toLowerCase() === "closed";

              return (
                <div
                  key={`${day}-${timeFormatted}-${index}`}
                  className="flex justify-between items-center"
                >
                  <span>{day}</span>
                  {isClosed ? (
                    <span className="bg-secondary text-white px-4 py-1 rounded-full text-xs">
                      Closed
                    </span>
                  ) : (
                    <span>{timeFormatted}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-16 text-center bg-white shadow-md">
          <h3 className="text-xl font-semibold mb-4">{aboutSettings.cancerTitle}</h3>
          <p className="text-gray-600 mb-6">
            {aboutSettings.cancerDescription}
          </p>
          <a
            href={aboutSettings.cancerButtonHref}
            className="inline-block bg-secondary hover:bg-secondary/90 transition text-white px-6 py-3 rounded-md"
          >
            {aboutSettings.cancerButtonLabel}
          </a>
        </div>
      </section>

      {/* ================= HOSPITAL DETAILS, SERVICES & DOCTORS ================= */}
      <section className="bg-white pt-24 pb-28">
        <div className="max-w-[1200px] mx-auto px-6 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-gray-50 rounded-2xl p-8 lg:p-10">
              <h3 className="text-2xl font-semibold mb-4 text-[#214d80]">{aboutSettings.missionTitle}</h3>
              <ul className="space-y-3 text-gray-700">
                {aboutSettings.missionPoints.map((point, index) => (
                  <li key={`${point}-${index}`}>• {point}</li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 lg:p-10">
              <h3 className="text-2xl font-semibold mb-4 text-[#214d80]">{aboutSettings.visionTitle}</h3>
              <ul className="space-y-3 text-gray-700">
                {aboutSettings.visionPoints.map((point, index) => (
                  <li key={`${point}-${index}`}>• {point}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-[#214d80]">{aboutSettings.diagnosticTitle}</h3>
              <ul className="space-y-2 text-gray-700">
                {aboutSettings.diagnosticItems.map((item, index) => (
                  <li key={`${item}-${index}`}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-[#214d80]">{aboutSettings.facilitiesTitle}</h3>
              <ul className="space-y-2 text-gray-700">
                {aboutSettings.facilitiesItems.map((item, index) => (
                  <li key={`${item}-${index}`}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-[#214d80]">{aboutSettings.servicesTitle}</h3>
              <ul className="space-y-2 text-gray-700">
                {aboutSettings.servicesItems.map((item, index) => (
                  <li key={`${item}-${index}`}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-6 text-[#214d80] text-center">
              List of TPA / Insurance Partners
            </h3>
            {loadingPartners ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#214d80]" />
              </div>
            ) : insurancePartners.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No partners listed yet. Add them in Admin → TPA / Insurance Partners.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {insurancePartners.map((partner) => (
                  <div
                    key={partner.id}
                    className="bg-[#FAF699] rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col items-center justify-center gap-3 hover:shadow-md transition"
                  >
                    <div className="w-full h-16 flex items-center justify-center">
                      {partner.logoUrl ? (
                        <img
                          src={partner.logoUrl}
                          alt={`${partner.name} logo`}
                          className="max-h-14 max-w-[160px] object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center">
                          <i className="fa-regular fa-image text-secondary" aria-hidden />
                        </div>
                      )}
                    </div>
                    <div className="text-center text-xs sm:text-sm text-gray-700 font-medium leading-snug">
                      {partner.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
          </div>

          <PatientTestimonialsSection />

          <div>
            <h2 className="text-4xl font-semibold text-center mb-12">
              Meet Our <span className="text-primary">Specialists</span>
            </h2>

            {loadingDoctors ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
              </div>
            ) : doctors.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-xl">No doctors available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300"
                  >
                    <Link
                      href={`/doctors/${doctor.id}`}
                      className="block focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label={`View profile of ${doctor.name}`}
                    >
                      {doctor.image ? (
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-full h-64 object-cover"
                        />
                      ) : (
                        <div className="w-full h-64 bg-linear-to-br from-primary to-[#00c2c0] flex items-center justify-center">
                          <span className="text-white text-6xl font-bold">
                            {doctor.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </Link>
                    <div className="p-6 flex flex-col items-center text-center gap-3">
                      <Link
                        href={`/doctors/${doctor.id}`}
                        className="font-semibold text-lg hover:text-primary transition-colors"
                      >
                        {doctor.name}
                      </Link>
                      <p className="text-primary text-sm font-medium">
                        {doctor.designation}
                      </p>

                      {doctor.appointmentLink ? (
                        <a
                          href={doctor.appointmentLink}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 text-xs font-semibold text-primary border border-primary px-6 py-2 rounded-full hover:bg-primary hover:text-white transition"
                        >
                          MAKE APPOINTMENT
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="mt-4 text-xs font-semibold text-gray-400 border border-gray-300 px-6 py-2 rounded-full cursor-not-allowed"
                        >
                          MAKE APPOINTMENT
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}