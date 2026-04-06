import { ServicePageIcon } from "@/lib/servicePageIcons";

/** True for Font Awesome class strings from the admin (e.g. `fas fa-users`, `fa-solid fa-heart`). */
export function isFontAwesomeIconClass(icon: string): boolean {
  const s = icon.trim();
  if (!s) return false;
  if (/^(fas|far|fab|fal|fad|fa-solid|fa-regular|fa-brands)\s+/i.test(s)) {
    return true;
  }
  return /^fa\s+/i.test(s);
}

/**
 * Renders a statistic icon from the DB: Font Awesome classes (`fas fa-*`) or
 * react-icons/fa names (`FaUsers`) / legacy Lucide keys via {@link ServicePageIcon}.
 */
export function StatisticIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  const trimmed = icon.trim();
  if (!trimmed) {
    return <ServicePageIcon name="Stethoscope" className={className} />;
  }
  if (isFontAwesomeIconClass(trimmed)) {
    return (
      <i className={[trimmed, className].filter(Boolean).join(" ")} aria-hidden />
    );
  }
  return <ServicePageIcon name={trimmed} className={className} />;
}
