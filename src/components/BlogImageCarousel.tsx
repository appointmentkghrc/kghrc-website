"use client";

import { useState } from "react";

type Variant = "default" | "listing";

export default function BlogImageCarousel({
  images,
  title,
  variant = "default",
}: {
  images: string[];
  title: string;
  /** `listing`: fixed height for /blog cards. */
  variant?: Variant;
}) {
  const [idx, setIdx] = useState(0);

  if (images.length === 0) return null;

  const listingImg =
    "w-full object-cover transition-opacity duration-300 group-hover:scale-110 group-hover:translate-x-4";
  const singleClass =
    variant === "listing"
      ? `${listingImg} h-[400px] w-full transition-transform duration-700 ease-out scale-105`
      : "w-full transition-all duration-700 scale-105 group-hover:scale-110 group-hover:-translate-x-4";

  if (images.length === 1) {
    return (
      <div
        className={
          variant === "listing"
            ? "mb-8 overflow-hidden rounded-lg group"
            : "overflow-hidden rounded-lg mb-8 group"
        }
      >
        <img src={images[0]} alt={title} className={singleClass} decoding="async" />
      </div>
    );
  }

  const go = (delta: number) => {
    setIdx((i) => (i + delta + images.length) % images.length);
  };

  const multiImgClass =
    variant === "listing"
      ? `${listingImg} h-[400px]`
      : "w-full max-h-[min(520px,70vh)] object-cover transition-opacity duration-300";

  return (
    <div
      className={
        variant === "listing"
          ? "mb-8 overflow-hidden rounded-lg bg-gray-100 group"
          : "mb-8 overflow-hidden rounded-lg bg-gray-100"
      }
    >
      <div className="relative">
        <div className="overflow-hidden">
          {/* key forces a fresh <img> per slide so only the active URL is requested (no eager load of other images). */}
          <img
            key={idx}
            src={images[idx]}
            alt={`${title} — image ${idx + 1} of ${images.length}`}
            className={multiImgClass}
            decoding="async"
          />
        </div>
        <button
          type="button"
          aria-label="Previous image"
          onClick={() => go(-1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white shadow hover:bg-black/70 transition"
        >
          <i className="fas fa-chevron-left text-sm" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Next image"
          onClick={() => go(1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white shadow hover:bg-black/70 transition"
        >
          <i className="fas fa-chevron-right text-sm" aria-hidden />
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-2 px-2 py-3 bg-white/90">
        {images.map((url, i) => (
          <button
            key={`${url}-${i}`}
            type="button"
            aria-label={`Show image ${i + 1}`}
            aria-current={i === idx ? "true" : undefined}
            onClick={() => setIdx(i)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              i === idx ? "bg-primary scale-125" : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
