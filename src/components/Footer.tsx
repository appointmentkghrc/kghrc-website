// components/Footer.tsx

export default function Footer() {
    return (
      <footer className="bg-[#214d80] text-white pt-20 pb-8">
  
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
  
          {/* Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
  
            {/* About */}
            <div>
              <h3 className="text-xl font-semibold mb-6 relative">
                About
                <span className="block w-10 h-[2px] bg-primary mt-3"></span>
              </h3>
  
              <p className="text-white/80 leading-relaxed mb-6">
                Excellence decisively nay man yet impression for contrasted
                remarkably. There spoke happy for you are out.
              </p>
  
              <h4 className="font-semibold mb-4">OPENING HOURS</h4>
  
              <div className="space-y-3 text-white/80 text-sm">
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span>Mon – Tues :</span>
                  <span>6.00 am – 10.00 pm</span>
                </div>
  
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span>Wednes – Thurs :</span>
                  <span>8.00 am – 6.00 pm</span>
                </div>
  
                <div className="flex justify-between items-center">
                  <span>Sun :</span>
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-xs">
                    Closed
                  </span>
                </div>
              </div>
            </div>
  
          {/* Our Department */}
          <div>
            <h3 className="text-xl font-semibold mb-6 relative">
              Our Department
              <span className="block w-10 h-[2px] bg-primary mt-3"></span>
            </h3>

            <ul className="space-y-3 text-white/80">
              {[
                "Medecine and Health",
                "Dental Care and Surgery",
                "Eye Treatment",
                "Children Chare",
                "Nuclear magnetic",
                "Traumatology",
                "X-ray",
              ].map((item) => (
                <li
                  key={item}
                  className="hover:text-primary transition cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Location Map */}
          <div>
            <h3 className="text-xl font-semibold mb-6 relative">
              Our Location
              <span className="block w-10 h-[2px] bg-primary mt-3"></span>
            </h3>

            <div className="rounded-lg overflow-hidden border border-white/10 shadow-md h-40">
              <iframe
                title="Office location map"
                src="https://www.google.com/maps?q=Kanke%20General%20Hospital%2C%20Arsande%20Road%2C%20Near%20Kanke%20Block%20Chowk%2C%20Kanke%2C%20Jharkhand%20834006&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              />
            </div>
          </div>
  
            {/* Contact */}
            <div>
            <h3 className="text-xl font-semibold mb-6 relative">
              Contact
              <span className="block w-10 h-[2px] bg-primary mt-3"></span>
            </h3>
  
              <div className="space-y-6 text-white/80 text-sm">
  
                <div>
                  <p className="text-white font-semibold mb-1">PHONE</p>
                  <p>+91-6206803663</p>
                  <p>No. 06512450844</p>
                </div>
  
                <div>
                  <p className="text-white font-semibold mb-1">EMAIL</p>
                  <p>appointment.kghrc@gmail.com</p>
                  <p>Kankegeneralhospital@gmail.com</p>
                </div>
  
                <div>
                  <p className="text-white font-semibold mb-1">OFFICE</p>
                  <p>
                    Kanke General Hospital, Arsande Road, Near Kanke Block Chowk,
                    Kanke, Jharkhand 834006
                  </p>
                </div>
  
              </div>
            </div>
  
          </div>
  
          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-white/70">
  
              <p>
                © Copyright 2025. All Rights Reserved by{" "}
                <span className="text-primary">KGH</span>
              </p>
  
            <div className="flex gap-6 mt-4 md:mt-0">
              <span className="hover:text-primary cursor-pointer">
                Terms of user
              </span>
              <span className="hover:text-primary cursor-pointer">
                License
              </span>
              <span className="hover:text-primary cursor-pointer">
                Support
              </span>
            </div>
  
          </div>
  
        </div>
      </footer>
    );
  }