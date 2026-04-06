import type { ComponentType } from "react";
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
import * as FaIcons from "react-icons/fa";

/** Legacy Lucide keys saved before Font Awesome picker (react-icons/fa). */
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

type FaIconComponent = ComponentType<{ className?: string }>;

function getFaIconComponent(name: string): FaIconComponent | undefined {
  const Cmp = (FaIcons as Record<string, FaIconComponent | undefined>)[name];
  return typeof Cmp === "function" ? Cmp : undefined;
}

export function isValidServicePageIcon(
  icon: string
): icon is ServicePageIconKey | string {
  if (!icon || typeof icon !== "string") return false;
  if (icon in SERVICE_PAGE_ICONS) return true;
  return getFaIconComponent(icon) !== undefined;
}

export function ServicePageIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  if (name in SERVICE_PAGE_ICONS) {
    const Cmp = SERVICE_PAGE_ICONS[name as ServicePageIconKey];
    return <Cmp className={className} />;
  }
  const FaCmp = getFaIconComponent(name);
  if (FaCmp) {
    return <FaCmp className={className} />;
  }
  return <SERVICE_PAGE_ICONS.Stethoscope className={className} />;
}
