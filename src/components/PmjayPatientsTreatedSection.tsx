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
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="rounded-3xl border border-slate-200 bg-emerald-50 px-6 py-7 shadow-sm md:px-10 md:py-8">
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="flex items-stretch gap-5 md:gap-7">
              <div className="h-10 w-10 shrink-0 self-center sm:h-32 sm:w-32 md:h-32 md:w-32 lg:h-32 lg:w-32 xl:h-32 xl:w-32">
                <img
                  src={resolvedPrimaryLogo}
                  alt="Ayushman Bharat PMJAY"
                  className="block h-full w-full object-contain"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 text-left md:gap-4">
                <p className="text-base font-semibold leading-snug text-emerald-950 md:text-lg">
                  Patients treated under Ayushman Bharat Yojana
                </p>
                <p className="text-left text-4xl font-extrabold leading-none tracking-tight text-slate-900 md:text-5xl">
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

