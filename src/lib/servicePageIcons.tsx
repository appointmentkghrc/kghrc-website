import {
  Activity,
  Ambulance,
  BedDouble,
  Building2,
  ClipboardList,
  HeartPulse,
  Hospital,
  Microscope,
  Pill,
  Sparkles,
  Stethoscope,
  Syringe,
  UserRound,
} from "lucide-react";

export const SERVICE_PAGE_ICONS = {
  Stethoscope,
  Building2,
  Pill,
  HeartPulse,
  Activity,
  Microscope,
  Ambulance,
  Hospital,
  Syringe,
  UserRound,
  ClipboardList,
  BedDouble,
  Sparkles,
} as const;

export type ServicePageIconKey = keyof typeof SERVICE_PAGE_ICONS;

export const SERVICE_PAGE_ICON_KEYS = Object.keys(
  SERVICE_PAGE_ICONS
) as ServicePageIconKey[];

export function isValidServicePageIcon(icon: string): icon is ServicePageIconKey {
  return icon in SERVICE_PAGE_ICONS;
}

export function ServicePageIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp =
    SERVICE_PAGE_ICONS[name as ServicePageIconKey] ?? SERVICE_PAGE_ICONS.Stethoscope;
  return <Cmp className={className} />;
}
