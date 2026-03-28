import prisma from "@/lib/prisma";

/**
 * Homepage PMJAY count: prefer a Statistic row with category `pmjay` (managed in
 * Admin → Statistics), else fall back to Site Settings (Admin → PMJAY Section).
 */
export async function resolvePmjayPatientsTreatedValue(
  siteSettingsFallback: string
): Promise<string> {
  const stat = await prisma.statistic.findFirst({
    where: { category: "pmjay" },
    orderBy: { updatedAt: "desc" },
  });

  const fromDb = stat?.value?.trim();
  if (fromDb) return fromDb;

  const fromSettings = siteSettingsFallback.trim();
  return fromSettings.length > 0 ? fromSettings : "0";
}
