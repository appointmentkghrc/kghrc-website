/** Server layout so /gallery is not statically prerendered; page remains a client component. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
