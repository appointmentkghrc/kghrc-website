import { DEFAULT_PMJAY_PRIMARY_LOGO } from "@/lib/pmjayDefaults";

type PmjayPatientsTreatedSectionProps = {
  pmjayPatientsTreatedValue?: string | null;
  pmjayPrimaryLogoUrl?: string | null;
  pmjaySecondaryLogoUrl?: string | null;
};

export default function PmjayPatientsTreatedSection({
  pmjayPatientsTreatedValue,
  pmjayPrimaryLogoUrl,
  pmjaySecondaryLogoUrl,
}: PmjayPatientsTreatedSectionProps) {
  const value = (pmjayPatientsTreatedValue ?? "").trim() || "0";
  const primaryLogoUrl = (pmjayPrimaryLogoUrl ?? "").trim();
  const secondaryLogoUrl = (pmjaySecondaryLogoUrl ?? "").trim();
  const resolvedPrimaryLogo = primaryLogoUrl || DEFAULT_PMJAY_PRIMARY_LOGO;

  return (
    <section className="bg-white py-12">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="rounded-3xl border border-slate-200 bg-linear-to-r from-[#f8fbff] via-white to-[#f3f9ff] px-6 py-7 md:px-10 md:py-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-7">
            <div className="flex items-center gap-4 md:gap-5">
              <div className="h-16 w-16 shrink-0 md:h-20 md:w-20 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-2">
                <img
                  src={resolvedPrimaryLogo}
                  alt="Ayushman Bharat PMJAY"
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <p className="inline-flex items-center rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1">
                  Ayushman Bharat
                </p>
                <p className="text-base md:text-lg font-semibold text-slate-800 mt-3">
                  Patients treated under Ayushman Bharat Yojana
                </p>
                <p className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-none mt-3">
                  {value}
                </p>
              </div>
            </div>

            {secondaryLogoUrl ? (
              <div className="flex items-center justify-center md:justify-end">
                <div className="rounded-2xl bg-white border border-slate-200 shadow-sm px-4 py-3">
                  <img
                    src={secondaryLogoUrl}
                    alt="Additional PMJAY logo"
                    className="h-14 md:h-16 w-auto object-contain"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

