export type ServicesHighlightItem = {
  title: string;
  href: string;
  iconKey: string;
};

export const DEFAULT_SERVICES_HIGHLIGHT_TITLE = "";

export const DEFAULT_SERVICES_HIGHLIGHT_ITEMS: ServicesHighlightItem[] = [
  { title: "ADVANCED CARE", href: "/contact", iconKey: "userRound" },
  { title: "RESPITE CARE", href: "/contact", iconKey: "pill" },
  { title: "DAILY CARE", href: "/contact", iconKey: "clock" },
  { title: "NEUROLOGY CARE", href: "/contact", iconKey: "brain" },
];

export { SERVICES_HIGHLIGHT_ICON_OPTIONS } from "./servicesHighlightIcons";
