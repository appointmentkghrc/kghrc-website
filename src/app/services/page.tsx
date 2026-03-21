"use client";

import PatientTestimonialsSection from "@/components/PatientTestimonialsSection";

function ServicesGrid() {
  return (
    <section className="bg-gray-50 -mt-24 pt-24 pb-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-semibold mb-4 mt-10">
            Our <span className="text-primary">Key Services</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From routine checkups to advanced diagnostics and surgical care, we
            offer comprehensive services to support patients at every stage of
            their treatment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Outdoor Checkup */}
          <div className="bg-white rounded-3xl shadow-md p-10 flex flex-col gap-4">
            <div className="text-4xl text-primary mb-2">🏥</div>
            <h3 className="text-xl font-semibold">Outdoor Checkup</h3>
            <div className="w-12 h-[2px] bg-gray-200 mb-2" />
            <ul className="space-y-3 text-sm text-gray-700">
              {[
                "Height / weight check",
                "Blood pressure check",
                "Cholesterol level check",
                "Blood sugar test",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 leading-relaxed">
                  <span className="mt-1.5 h-3 w-3 rounded-full border-2 border-secondary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Operation Theatre */}
          <div className="bg-white rounded-3xl shadow-md p-10 flex flex-col gap-4">
            <div className="text-4xl text-primary mb-2">🩻</div>
            <h3 className="text-xl font-semibold">Operation Theatre</h3>
            <div className="w-12 h-[2px] bg-gray-200 mb-2" />
            <ul className="space-y-3 text-sm text-gray-700">
              {[
                "Modern modular operation theatres",
                "Surgical and exam lights",
                "Stretchers and accessories",
                "Cushions and mattresses",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 leading-relaxed">
                  <span className="mt-1.5 h-3 w-3 rounded-full border-2 border-secondary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pharmacy */}
          <div className="bg-white rounded-3xl shadow-md p-10 flex flex-col gap-4">
            <div className="text-4xl text-primary mb-2">💊</div>
            <h3 className="text-xl font-semibold">Pharmacy</h3>
            <div className="w-12 h-[2px] bg-gray-200 mb-2" />
            <ul className="space-y-3 text-sm text-gray-700">
              {[
                "Drug side effects counselling",
                "Treatment and dosage guidance",
                "Branded and generic medicines",
                "24×7 in‑house pharmacy support",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 leading-relaxed">
                  <span className="mt-1.5 h-3 w-3 rounded-full border-2 border-secondary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <div>
      <section className="relative h-[420px] flex items-center justify-center text-white">
        <div
          className="fixed top-0 left-0 w-full h-[420px] bg-cover bg-center -z-10"
          style={{
            backgroundImage:
              "url(https://validthemes.net/site-template/medihub/assets/img/banner/5.jpg)",
          }}
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-semibold mb-6">Our Services</h1>
          <div className="bg-black/40 px-6 py-3 rounded-md text-sm">
            HOME › SERVICES
          </div>
        </div>
      </section>

      <ServicesGrid />
      <PatientTestimonialsSection />
    </div>
  );
}

