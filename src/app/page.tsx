import DepartmentsSection from "@/components/DepartmentsSection";
import ServicesHighlightSection from "@/components/ServicesHighlightSection";
import SpecialistsSection from "@/components/SpecialistsSection";
import StatsSection from "@/components/StatsSection";
import PatientTestimonialsSection from "@/components/PatientTestimonialsSection";
import RecentBlogsSection from "@/components/RecentBlogsSection";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Background with overlay */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `url(/image7.jpeg)`,
          // no zoom out, use default cover (no backgroundSize override)
        }}
      />
      <div
        className="fixed inset-0 -z-10 hero-overlay"
        style={{ mixBlendMode: "multiply" }}
      />

      {/* Hero Content */}
      <main className="relative z-10 min-h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-10 xl:px-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
            {/* Left: Hero text */}
            <div className="max-w-2xl -translate-y-16">
              <h1 className="text-5xl lg:text-7xl font-semibold text-white leading-[1.1] mb-6">
                <span className="block whitespace-nowrap">Best care for your</span>
                <span className="block text-primary whitespace-nowrap">Good health</span>
              </h1>

              <p className="text-white/85 text-lg mb-8 leading-relaxed">
                The ourselves suffering the sincerity. Inhabit her manners
                adapted age certain. Debating offended at branched striking be
                subjects.
              </p>

              <button className="px-12 py-4 bg-white text-gray-600 font-semibold rounded-full hover:bg-gray-100 transition">
                Contact Us
              </button>
            </div>

            {/* Right: Appointment box */}
            <div className="w-full max-w-[520px] lg:ml-auto lg:-translate-y-16">
              <div className="rounded-[30px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-10 lg:p-12">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Make An Appointment
                </h2>
                <div className="h-px w-12 bg-white/40 mb-6" />

                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                  <select className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary">
                    <option className="text-black">Male</option>
                    <option className="text-black">Female</option>
                  </select>

                  <select className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary">
                    <option className="text-black">Department</option>
                    <option className="text-black">Cardiology</option>
                    <option className="text-black">Neurology</option>
                    <option className="text-black">Orthopedics</option>
                    <option className="text-black">General</option>
                  </select>

                  <button
                    type="submit"
                    className="w-full py-3 mt-2 rounded-full bg-primary text-white font-semibold hover:bg-[#00c2c0] transition"
                  >
                    Submit Query
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Section below hero - enables scrolling */}
      <DepartmentsSection />
      <ServicesHighlightSection />
      <SpecialistsSection />
      <StatsSection />
      <PatientTestimonialsSection />
      <RecentBlogsSection />
    </div>
  );
}
