"use client";

import { useEffect, useMemo, useState } from "react";

type DiagnosticService = {
  id: string;
  name: string;
  title: string;
  image: string;
  description: string;
  details: string;
  sortOrder?: number;
  isActive?: boolean;
};

type OpeningHoursItem = {
  day: string;
  time: string;
};

const truncateWords = (text: string, maxWords: number) => {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(" ")}...`;
};

export default function DepartmentsSection({
  openingHours,
}: {
  openingHours: OpeningHoursItem[];
}) {
  const [diagnosticServices, setDiagnosticServices] = useState<DiagnosticService[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const response = await fetch("/api/diagnostic-services");
        if (!response.ok) throw new Error("Failed to fetch diagnostic services");
        const services: DiagnosticService[] = await response.json();
        setDiagnosticServices(services);
        setSelectedServiceId(services[0]?.id ?? null);
      } catch (error) {
        console.error("Error fetching diagnostic services:", error);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  const selectedService = useMemo(() => {
    if (diagnosticServices.length === 0) return null;
    return (
      diagnosticServices.find((service) => service.id === selectedServiceId) ??
      diagnosticServices[0]
    );
  }, [diagnosticServices, selectedServiceId]);

  return (
    <section className="bg-[#f7f7f7] py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* LEFT - Departments */}
          <div className="lg:col-span-3">
            <h3 className="text-xl font-semibold mb-6">
            Diagnostic Services
            </h3>

            <div className="space-y-4">
              {loadingServices && diagnosticServices.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-sm text-gray-500">
                  Loading diagnostic services...
                </div>
              ) : (
                diagnosticServices.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`w-full text-left px-6 py-4 rounded-lg border transition-all ${
                    selectedService?.id === service.id
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-200 hover:border-primary"
                  }`}
                >
                  {service.name}
                </button>
                ))
              )}
            </div>
          </div>

          {/* MIDDLE - Image + Content */}
          <div className="lg:col-span-5">
            {loadingServices && !selectedService ? (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-gray-500">
                Loading service details...
              </div>
            ) : selectedService ? (
              <>
                <img
                  src={selectedService.image}
                  alt={selectedService.name}
                  className="rounded-xl w-full object-cover mb-6"
                />

                <h2 className="text-3xl font-semibold mb-4">
                  {selectedService.title}
                </h2>

                <p className="text-gray-600 leading-relaxed mb-6 wrap-break-word">
                  {truncateWords(selectedService.description, 45)}
                </p>

                <p className="text-gray-600 leading-relaxed wrap-break-word">
                  {truncateWords(selectedService.details, 35)}
                </p>
              </>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-gray-500">
                No diagnostic services available. Add services from Admin Dashboard.
              </div>
            )}
          </div>

          {/* RIGHT - Opening Hours */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">
                Opening Hours
              </h3>

              <div className="w-10 h-[3px] bg-primary mb-6" />

              <div className="space-y-3">
                {openingHours.length === 0 ? (
                  <div className="px-4 py-3 rounded-lg text-sm bg-gray-100 text-gray-500">
                    Opening hours are not configured yet.
                  </div>
                ) : (
                  openingHours.map((item, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center px-4 py-3 rounded-lg text-sm ${
                        item.day.toLowerCase() === "monday"
                          ? "bg-gray-200"
                          : "bg-gray-100"
                      }`}
                    >
                      <span className="uppercase text-gray-600">
                        {item.day}
                      </span>

                      {item.time.trim().toUpperCase() === "CLOSED" ? (
                        <span className="bg-primary text-white px-4 py-1 rounded-full text-xs">
                          CLOSED
                        </span>
                      ) : (
                        <span className="text-gray-700">
                          {item.time}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}