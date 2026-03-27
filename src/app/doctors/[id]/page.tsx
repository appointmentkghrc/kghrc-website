import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

interface DoctorPageProps {
  params: Promise<{ id: string }>;
}

export default async function DoctorDetailsPage({ params }: DoctorPageProps) {
  const { id } = await params;

  const doctor = await prisma.doctor.findUnique({
    where: { id },
  });

  if (!doctor) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <section className="relative h-[340px] flex items-center justify-center text-white">
        <div
          className="fixed top-0 left-0 w-full h-[340px] bg-cover bg-center -z-10"
          style={{
            backgroundImage:
              "url(https://validthemes.net/site-template/medihub/assets/img/banner/5.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">{doctor.name}</h1>
          <div className="bg-black/40 px-5 py-2 rounded-md text-sm uppercase tracking-wide">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>{" "}
            {"›"}{" "}
            <Link href="/doctors" className="hover:text-primary transition-colors">
              Doctors
            </Link>{" "}
            {"›"} {doctor.designation}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 -mt-20 relative z-10">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-1">
              <img
                src={doctor.image ?? "/placeholder-doctor.jpg"}
                alt={doctor.name}
                className="w-full h-full min-h-[360px] object-cover"
              />
            </div>

            <div className="md:col-span-2 p-8 md:p-10">
              <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">
                Speciality
              </p>
              <h2 className="text-3xl font-semibold mt-1">{doctor.name}</h2>
              <p className="text-lg text-gray-600 mt-2">{doctor.designation}</p>

              <div className="h-px bg-gray-200 my-6" />

              <div className="space-y-4 text-gray-700">
                <p>
                  <span className="font-semibold text-gray-900">Speciality:</span>{" "}
                  {doctor.designation || "Not added yet."}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Education:</span>{" "}
                  {doctor.qualification || "Not added yet."}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Experience:</span>{" "}
                  {doctor.experience || "Not added yet."}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Timings:</span>{" "}
                  {doctor.timings || "Not added yet."}
                </p>
                <p>
                  <span className="font-semibold text-gray-900">About:</span> Dr.{" "}
                  {doctor.bio ||
                    `${doctor.name}`}
                </p>
              </div>

              <div className="h-px bg-gray-200 my-6" />

              {(doctor.email || doctor.phone) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {doctor.email ? (
                    <p className="text-gray-700">
                      <span className="font-semibold text-gray-900">Email:</span>{" "}
                      {doctor.email}
                    </p>
                  ) : null}
                  {doctor.phone ? (
                    <p className="text-gray-700">
                      <span className="font-semibold text-gray-900">Phone:</span>{" "}
                      {doctor.phone}
                    </p>
                  ) : null}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-7">
                {doctor.appointmentLink ? (
                  <a
                    href={doctor.appointmentLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition"
                  >
                    Make Appointment
                  </a>
                ) : null}
                <Link
                  href="/doctors"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:border-primary hover:text-primary transition"
                >
                  Back to Doctors
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
