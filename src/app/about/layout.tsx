/** Server layout so /about is not statically prerendered; page remains a client component. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
