/** Ordered, de-duplicated URLs for the post hero: featured image first, then gallery. */
export function blogHeroSlides(blog: {
  image?: string | null;
  galleryImages?: string[] | null;
}): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const add = (u?: string | null) => {
    const s = (u ?? "").trim();
    if (!s || seen.has(s)) return;
    seen.add(s);
    out.push(s);
  };
  add(blog.image);
  for (const u of blog.galleryImages ?? []) add(u);
  return out;
}

/** Thumbnail for listings: featured image, or first carousel image if featured is unset. */
export function blogCardImage(blog: {
  image?: string | null;
  galleryImages?: string[] | null;
}): string {
  return blogHeroSlides(blog)[0] ?? "";
}
