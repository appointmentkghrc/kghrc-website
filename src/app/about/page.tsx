"use client";

import { useEffect, useState } from "react";
import PatientTestimonialsSection from "@/components/PatientTestimonialsSection";

interface Doctor {
  id: string;
  name: string;
  designation: string;
  email?: string;
  phone?: string;
  facebook?: string;
  linkedin?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AboutPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const response = await fetch("/api/doctors");
      if (!response.ok) throw new Error("Failed to fetch doctors");
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const insurancePartners = [
    { name: "ICICI Lombard", logoSrc: "/ICICI-Lombard.jpeg" },
    { name: "Mediassist TPA", logoSrc: "/medi-assist.jpg" },
    { name: "Raksha TPA", logoSrc: "/rakshatpa-logo.png" },
    { name: "Reliance Health Insurance", logoSrc: "/Reliance Health insurance company.png" },
    { name: "Bajaj Allianz", logoSrc: "/bajaj-allianz.svg" },
    { name: "MD India", logoSrc: "/md-india.svg" },
    { name: "Universal Sompo", logoSrc: "/universal-sompo.svg" },
    { name: "Religare", logoSrc: "/religare.svg" },
    { name: "Apollo Munich", logoSrc: null },
    { name: "FHPL", logoSrc: "/fhpl.png" },
    { name: "Tata AIG", logoSrc: "/tata-aig.svg" },
    { name: "Kotak Mahindra", logoSrc: "/kotak.svg" },
    { name: "Medsafe Health Insurance", logoSrc: "/medsave.jpeg" },
    { name: "Safeway", logoSrc: "/safeway.jpg" },
    { name: "Medicare Health Insurance", logoSrc: "/medicare.svg" },
    { name: "E-Meditek", logoSrc: "/e-meditek.jpeg" },
    { name: "Max Bupa", logoSrc: "/niva-bupa.svg" },
    { name: "Vipul Medcorp", logoSrc: "/VipulMedcorp.jpeg" },
    { name: "Paramount TPA", logoSrc: "/paramount-tpa.png" },
    { name: "United India Insurance", logoSrc: "/united-india.png" },
    { name: "Iffco Tokio", logoSrc: "/iffco-tokio.jpg" },
    { name: "Bharti AXA General Insurance", logoSrc: "/bharti-axa.svg" },
    { name: "Heritage Health TPA", logoSrc: "/heritage-health.jpeg" },
    { name: "Ericson TPA", logoSrc: "/ericson.jpg" },
    { name: "HDFC Ergo Health Insurance", logoSrc: "/hdfc-ergo.png" },
    { name: "ACKO General Insurance", logoSrc: "/acko.svg" },
    { name: "Health India Insurance TPA", logoSrc: "/health-india.jpg" },
  ] as const;

  return (
    <div>

      {/* ================= HERO ================= */}
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
          <h1 className="text-5xl font-semibold mb-6">About Us</h1>
          <div className="bg-black/40 px-6 py-3 rounded-md text-sm">
            HOME › ABOUT
          </div>
        </div>
      </section>

      {/* ================= ABOUT CONTENT (ORIGINAL UI) ================= */}
      <section className="relative z-20 bg-white -mt-24 pt-24 pb-28">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 px-6">
          {/* Left Images */}
          <div className="relative">
            <img
              src="https://validthemes.net/site-template/medihub/assets/img/about/1.jpg"
              className="rounded-md"
              alt="About hospital"
            />
            <img
              src="https://validthemes.net/site-template/medihub/assets/img/about/2.jpg"
              className="absolute bottom-[-60px] right-[-40px] w-[220px] rounded-md shadow-xl"
              alt="Hospital team"
            />
          </div>

          {/* Right Text */}
          <div>
            <p className="text-primary mb-3 font-medium uppercase tracking-wide">
              KANKE GENERAL HOSPITAL &amp; RESEARCH CENTRE
            </p>

            <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Hospital Profile
            </h2>

            <p className="text-gray-700 leading-relaxed mb-8">
              Kanke General Hospital &amp; Research Centre is a 100 bedded multi-speciality hospital
              located in Ranchi. The hospital started as a small OPD in 1990 by Dr. Shambhu Prasad
              Singh and later developed into a modern healthcare institution. It was registered
              under the Clinical Establishment Act on 9 March 2009. The hospital is committed to
              providing high quality and affordable healthcare services with experienced doctors,
              trained staff and modern medical equipment.
            </p>

            <div className="bg-white rounded-xl p-8 flex items-center gap-6 shadow-lg">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl">
                ▶
              </div>
              <div>
                <h4 className="font-semibold text-lg">LET’S SEE OUR INTRO VIDEO</h4>
                <p className="text-gray-500 text-sm">
                  If your smile is not becoming to you, then you should be coming to me!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES STRIP (ORIGINAL UI) ================= */}
      <section className="grid grid-cols-1 md:grid-cols-3">
        <div className="p-16 text-center bg-white shadow-md">
          <h3 className="text-xl font-semibold mb-4">EMERGENCY CASE</h3>
          <p className="text-gray-600 mb-6">
            Moment he at on wonder at season little. Six garden result summer set family esteem nay
            estate. End admiration mrs unreserved.
          </p>
          <button className="bg-secondary hover:bg-secondary/90 transition text-white px-6 py-3 rounded-md">
            READ MORE
          </button>
        </div>

        <div className="p-16 text-center bg-primary text-white">
          <h3 className="text-xl font-semibold mb-4">OPENING HOURS</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Mon - Tues :</span>
              <span>6.00 AM - 10.00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Wednes - Thurs :</span>
              <span>8.00 AM - 6.00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Sun :</span>
              <span>Closed</span>
            </div>
          </div>
        </div>

        <div className="p-16 text-center bg-white shadow-md">
          <h3 className="text-xl font-semibold mb-4">CANCER CARE</h3>
          <p className="text-gray-600 mb-6">
            Moment he at on wonder at season little. Six garden result summer set family esteem nay
            estate. End admiration mrs unreserved.
          </p>
          <button className="bg-secondary hover:bg-secondary/90 transition text-white px-6 py-3 rounded-md">
            READ MORE
          </button>
        </div>
      </section>

      {/* ================= HOSPITAL DETAILS, SERVICES & DOCTORS ================= */}
      <section className="bg-white pt-24 pb-28">
        <div className="max-w-[1200px] mx-auto px-6 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-gray-50 rounded-2xl p-8 lg:p-10">
              <h3 className="text-2xl font-semibold mb-4 text-[#214d80]">Mission</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• To provide the best quality healthcare services at an affordable cost.</li>
                <li>• To deliver ethical and patient-centered treatment.</li>
                <li>• To ensure accurate diagnosis using modern technology.</li>
                <li>• To continuously improve healthcare quality.</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 lg:p-10">
              <h3 className="text-2xl font-semibold mb-4 text-[#214d80]">Vision</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• To become one of the leading healthcare institutions.</li>
                <li>• To provide world-class healthcare facilities.</li>
                <li>• To promote medical education and research.</li>
                <li>• To ensure accessible healthcare for all.</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-[#214d80]">Diagnostic Services</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Laboratory</li>
                <li>• CT Scan</li>
                <li>• X-Ray</li>
                <li>• Ultrasound</li>
                <li>• MRI</li>
                <li>• 3D Vasculography</li>
                <li>• TMT</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-[#214d80]">Hospital Facilities</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Operation Theatre</li>
                <li>• Electronic Fetal Monitoring</li>
                <li>• Endoscopy</li>
                <li>• EECP</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-[#214d80]">Hospital Services</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Ayushman Bharat Help Desk</li>
                <li>• 15000+ Ayushman Bharat cases treated</li>
                <li>• Cashless TPA treatment</li>
                <li>• Emergency services</li>
                <li>• 24×7 patient care</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-6 text-[#214d80] text-center">
              List of TPA / Insurance Partners
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {insurancePartners.map((partner) => (
                <div
                  key={partner.name}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col items-center justify-center gap-3 hover:shadow-md transition"
                >
                  <div className="w-full h-16 flex items-center justify-center">
                    {partner.logoSrc ? (
                      <img
                        src={partner.logoSrc}
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
                    {doctor.image ? (
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-primary to-[#00c2c0] flex items-center justify-center">
                        <span className="text-white text-6xl font-bold">
                          {doctor.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="p-6 flex flex-col items-center text-center gap-3">
                      <h4 className="font-semibold text-lg">{doctor.name}</h4>
                      <p className="text-primary text-sm font-medium">
                        {doctor.designation}
                      </p>

                      <button className="mt-4 text-xs font-semibold text-primary border border-primary px-6 py-2 rounded-full hover:bg-primary hover:text-white transition">
                        MAKE APPOINTMENT
                      </button>
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