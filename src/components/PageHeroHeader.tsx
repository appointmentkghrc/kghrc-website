"use client";

import { useEffect, useState } from "react";

type PageHeroHeaderProps = {
  imageUrl: string;
  /** Section + content area height, e.g. h-[420px] */
  className?: string;
  /** Must match fixed layers (doctors list 420, doctor detail 340, blog 500) */
  fixedHeightClass?: string;
  overlayClassName?: string;
  children: React.ReactNode;
};

/**
 * Public page top banner: neutral base (no hardcoded photo), optional image from CMS,
 * and "Loading…" until the image finishes loading (or errors).
 */
export default function PageHeroHeader({
  imageUrl,
  className = "h-[420px]",
  fixedHeightClass = "h-[420px]",
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
      className={`relative flex items-center justify-center text-white overflow-hidden ${className}`}
    >
      <div
        className={`fixed top-0 left-0 w-full ${fixedHeightClass} -z-10 bg-slate-800 bg-gradient-to-br from-slate-800 to-slate-900`}
        aria-hidden
      />

      {hasUrl ? (
        <img
          src={trimmed}
          alt=""
          className={`fixed top-0 left-0 w-full ${fixedHeightClass} object-cover object-center -z-10 transition-opacity duration-300 ${
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
