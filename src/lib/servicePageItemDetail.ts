import type { ServicePageItem } from "@prisma/client";

/** When set, the public card navigates to the custom detail page instead of `link`. */
export function servicePageItemHasDetailPage(item: ServicePageItem): boolean {
  return item.detailPageContent.trim().length > 0;
}

export function getServicePageItemCardHref(item: ServicePageItem): string {
  if (servicePageItemHasDetailPage(item)) {
    return `/services/item/${item.id}`;
  }
  return item.link.trim();
}
