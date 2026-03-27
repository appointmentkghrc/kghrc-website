"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface Testimonial {
  id: string;
  name: string;
  designation: string;
  content: string;
  rating: number;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase() || "U";
}

export default function PatientTestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/testimonials");
        if (!res.ok) throw new Error("Failed to fetch testimonials");
        const data: Testimonial[] = await res.json();
        setTestimonials(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error loading testimonials:", e);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const items = useMemo(() => testimonials, [testimonials]);
  const shouldCarousel = items.length > 2;

  const scrollCarouselBy = (direction: "prev" | "next") => {
    const el = carouselRef.current;
    if (!el) return;
    const delta = direction === "next" ? el.clientWidth : -el.clientWidth;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  useEffect(() => {
    if (loading || items.length === 0) return;
    if (!shouldCarousel || isPaused) return;

    const el = carouselRef.current;
    if (!el) return;

    const interval = window.setInterval(() => {
      const current = carouselRef.current;
      if (!current) return;

      const maxScrollLeft = current.scrollWidth - current.clientWidth;
      const nearEnd = current.scrollLeft >= maxScrollLeft - 8;

      if (nearEnd) {
        current.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }

      current.scrollBy({ left: current.clientWidth, behavior: "smooth" });
    }, 4500);

    return () => window.clearInterval(interval);
  }, [shouldCarousel, isPaused, loading, items.length]);

  if (loading || items.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">
            Patient <span className="text-primary">Testimonials</span>
          </h2>

          <p className="text-gray-500 max-w-2xl mx-auto mt-4">
            Real experiences shared by our patients.
          </p>
        </div>

        {shouldCarousel ? (
          <div className="relative md:px-6">
            <button
              type="button"
              onClick={() => scrollCarouselBy("prev")}
              className="hidden md:flex absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg items-center justify-center text-gray-700 hover:text-primary transition z-20 text-3xl leading-none"
              aria-label="Previous testimonials"
            >
              <span aria-hidden>‹</span>
            </button>

            <button
              type="button"
              onClick={() => scrollCarouselBy("next")}
              className="hidden md:flex absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg items-center justify-center text-gray-700 hover:text-primary transition z-20 text-3xl leading-none"
              aria-label="Next testimonials"
            >
              <span aria-hidden>›</span>
            </button>

            <div
              ref={carouselRef}
              className="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pr-2 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] relative z-10"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {items.map((t) => {
                const designation = (t.designation ?? "").trim();
                const showPatientOf =
                  designation.length > 0 && !designation.toLowerCase().includes("patient");

                return (
                  <div
                    key={t.id}
                    className="snap-start shrink-0 w-full md:w-[calc(50%-16px)] bg-white rounded-xl border border-gray-200 p-10 shadow-sm relative"
                  >
                    <div className="text-primary text-5xl mb-4">“</div>

                    <p className="text-gray-600 leading-relaxed mb-8">{t.content}</p>

                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-semibold"
                        aria-hidden
                      >
                        {initials(t.name)}
                      </div>

                      <div>
                        <p className="font-semibold">{t.name}</p>
                        {designation ? (
                          <p className="text-sm text-gray-500">
                            {showPatientOf ? "Patient of " : ""}
                            <span className="text-primary font-medium">{designation}</span>
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {items.map((t) => {
              const designation = (t.designation ?? "").trim();
              const showPatientOf =
                designation.length > 0 && !designation.toLowerCase().includes("patient");

              return (
                <div
                  key={t.id}
                  className="bg-white rounded-xl border border-gray-200 p-10 shadow-sm relative"
                >
                  <div className="text-primary text-5xl mb-4">“</div>

                  <p className="text-gray-600 leading-relaxed mb-8">{t.content}</p>

                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-semibold"
                      aria-hidden
                    >
                      {initials(t.name)}
                    </div>

                    <div>
                      <p className="font-semibold">{t.name}</p>
                      {designation ? (
                        <p className="text-sm text-gray-500">
                          {showPatientOf ? "Patient of " : ""}
                          <span className="text-primary font-medium">{designation}</span>
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

