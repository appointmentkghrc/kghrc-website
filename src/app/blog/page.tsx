import { cacheBustUrl } from "@/lib/cacheBustUrl";
import { getSiteContactSettings } from "@/lib/siteSettings";
import BlogPageClient from "./BlogPageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogPage() {
  const site = await getSiteContactSettings();
  const raw = site.blogPageHeroImage.trim();
  const hero = raw ? cacheBustUrl(raw) : "";
  return <BlogPageClient heroBackgroundImage={hero} />;
}
