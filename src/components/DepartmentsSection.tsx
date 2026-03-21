"use client";

export default function DepartmentsSection() {
  const departments = [
    "Laboratory",
    "CT Scan",
    "X-Ray",
    "Ultrasound",
    "MRI",
    "3D Vasculography",
    "TMT",
  ];

  const openingHours = [
    { day: "Sunday", time: "6.00 AM - 10.00 PM" },
    { day: "Monday", time: "8.00 AM - 4.00 PM", active: true },
    { day: "Tuesday", time: "9.00 AM - 6.00 PM" },
    { day: "Wednesday", time: "10.00 AM - 7.00 PM" },
    { day: "Thursday", time: "11.00 AM - 9.00 PM" },
    { day: "Friday", time: "12.00 AM - 12.00 PM" },
    { day: "Saturday", time: "Closed", closed: true },
  ];

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
              {departments.map((dept, index) => (
                <button
                  key={index}
                  className={`w-full text-left px-6 py-4 rounded-lg border transition-all ${
                    index === 0
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-200 hover:border-primary"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* MIDDLE - Image + Content */}
          <div className="lg:col-span-5">
            <img
              src="https://validthemes.net/site-template/medihub/assets/img/departments/1.jpg"
              alt="Department"
              className="rounded-xl w-full object-cover mb-6"
            />

            <h2 className="text-3xl font-semibold mb-4">
              Medecine And Health
            </h2>

            <p className="text-gray-600 leading-relaxed mb-6">
              Calling nothing end fertile for venture way boy. Esteem spirit
              temper too say adieus who direct esteem. It esteems luckily mr or
              picture placing drawing no. Apartments frequently or motionless
              on reasonable projecting expression.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Placing assured be if removed it besides on. Far shed each high
              read are men over day.
            </p>
          </div>

          {/* RIGHT - Opening Hours */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">
                Opening Hours
              </h3>

              <div className="w-10 h-[3px] bg-primary mb-6" />

              <div className="space-y-3">
                {openingHours.map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center px-4 py-3 rounded-lg text-sm ${
                      item.active
                        ? "bg-gray-200"
                        : "bg-gray-100"
                    }`}
                  >
                    <span className="uppercase text-gray-600">
                      {item.day}
                    </span>

                    {item.closed ? (
                      <span className="bg-primary text-white px-4 py-1 rounded-full text-xs">
                        CLOSED
                      </span>
                    ) : (
                      <span className="text-gray-700">
                        {item.time}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}