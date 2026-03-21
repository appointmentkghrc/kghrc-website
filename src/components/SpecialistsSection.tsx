 "use client";

import { useEffect, useState } from "react";

interface Doctor {
  id: string;
  name: string;
  designation: string;
  email?: string | null;
  phone?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  image?: string | null;
}

export default function SpecialistsSection() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/doctors");
        if (!res.ok) throw new Error("Failed to fetch doctors");
        const data: Doctor[] = await res.json();
        setDoctors(data);
      } catch (err) {
        console.error("Error loading doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading || doctors.length === 0) {
    return null;
  }
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">
            Meet Our <span className="text-primary">Specialists</span>
          </h2>
          <div className="w-12 h-[3px] bg-primary mx-auto mt-4 mb-6" />
          <p className="text-gray-500 max-w-2xl mx-auto">
            While mirth large of on front. Ye he greater related adapted proceed entered
            an. Through it examine express promise no.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl shadow-md overflow-hidden transition"
            >
              <div className="relative overflow-hidden">
                <img
                  src={doc.image ?? "/placeholder-doctor.jpg"}
                  alt={doc.name}
                  className="w-full h-[320px] object-cover"
                />
              </div>

              <div className="relative">
                <div className="border-t border-primary" />
                <div className="absolute left-1/2 -translate-x-1/2 -top-5">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white text-xl shadow">
                    +
                  </div>
                </div>
              </div>

              <div className="text-center px-6 pb-8 pt-6">
                <h3 className="text-xl font-semibold">{doc.name}</h3>
                <p className="text-primary text-sm tracking-widest mt-1">
                  {doc.designation?.toUpperCase()}
                </p>

                <div className="mt-6 pt-4">
                  <div className="relative mb-4">
                    <div className="h-px bg-gray-200" />
                    <div className="absolute inset-0 flex justify-center">
                      <div className="w-16 h-[3px] bg-primary -translate-y-px" />
                    </div>
                  </div>
                  <div className="text-gray-600 text-sm tracking-wide cursor-pointer hover:text-primary">
                    MAKE APPOINTMENT
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

