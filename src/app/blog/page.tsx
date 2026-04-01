import { cacheBustUrl } from "@/lib/cacheBustUrl";
import { getSiteContactSettings } from "@/lib/siteSettings";
import BlogPageClient from "./BlogPageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogPage() {
  const site = await getSiteContactSettings();
  return (
    <BlogPageClient heroBackgroundImage={cacheBustUrl(site.blogPageHeroImage)} />
  );
}
