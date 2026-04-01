"use client";

import { useEffect, useState } from "react";

type PageHeroHeaderProps = {
  imageUrl: string;
  /** Sets the hero block height, e.g. h-[420px]. Background layers use absolute inset-0 so the image always fills this box (no grey gap). */
  className?: string;
  overlayClassName?: string;
  children: React.ReactNode;
};

/**
 * Public page top banner: neutral base (no hardcoded photo), optional image from CMS,
 * and "Loading…" until the image finishes loading (or errors).
 *
 * Backgrounds are `absolute inset-0` inside the section — not `fixed` — so the image
 * aligns with the hero area below the navbar (viewport-fixed backgrounds caused bottom cut-off / grey band).
 */
export default function PageHeroHeader({
  imageUrl,
  className = "h-[420px]",
  overlayClassName = "bg-black/60",
  children,
}: PageHeroHeaderProps) {
  const [bgLoaded, setBgLoaded] = useState(false);
  const trimmed = imageUrl.trim();
  const hasUrl = trimmed.length > 0;

  useEffect(() => {
    setBgLoaded(false);
  }, [trimmed]);

  const showLoading = hasUrl && !bgLoaded;

  return (
    <section
      className={`relative flex min-h-0 items-center justify-center text-white overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0 z-0 bg-slate-800 bg-gradient-to-br from-slate-800 to-slate-900"
        aria-hidden
      />

      {hasUrl ? (
        <img
          src={trimmed}
          alt=""
          className={`absolute inset-0 z-0 h-full w-full object-cover object-center transition-opacity duration-300 ${
            bgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setBgLoaded(true)}
          onError={() => setBgLoaded(true)}
          aria-hidden
        />
      ) : null}

      <div className={`absolute inset-0 z-[1] ${overlayClassName}`} />

      {showLoading ? (
        <div
          className="absolute bottom-8 left-0 right-0 z-[2] flex justify-center pointer-events-none"
          aria-live="polite"
        >
          <span className="text-white/90 text-sm font-medium drop-shadow-md">Loading…</span>
        </div>
      ) : null}

      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
}
