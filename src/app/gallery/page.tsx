"use client";

import { useEffect, useMemo, useState } from "react";

type GalleryImage = {
  id: string;
  imageUrl: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
};

type GalleryApiResponse = {
  title?: string;
  bannerImage?: string;
  images?: GalleryImage[];
  sections?: string[];
};

const DEFAULT_TITLE = "Latest Gallery";

function GalleryHeader({
  title,
  bannerImage,
  isFetching,
}: {
  title: string;
  bannerImage: string | null;
  isFetching: boolean;
}) {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [bgFailed, setBgFailed] = useState(false);

  useEffect(() => {
    setBgLoaded(false);
    setBgFailed(false);
  }, [bannerImage]);

  const showBannerLoading =
    !isFetching && Boolean(bannerImage) && !bgLoaded && !bgFailed;
  const showHeroLoading = isFetching || showBannerLoading;
  const bannerVisible = Boolean(bannerImage) && bgLoaded && !bgFailed;

  return (
    <section className="relative h-[420px] flex items-center justify-center text-white overflow-hidden bg-slate-800">
      {bannerImage && !bgFailed ? (
        <img
          src={bannerImage}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover z-0 transition-opacity duration-300 ${
            bgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setBgLoaded(true)}
          onError={() => setBgFailed(true)}
          aria-hidden
        />
      ) : null}

      <div
        className={`absolute inset-0 z-1 ${
          bannerVisible ? "bg-black/60" : "bg-black/45"
        }`}
      />

      {showHeroLoading ? (
        <div
          className="absolute bottom-10 left-0 right-0 z-3 flex justify-center pointer-events-none"
          aria-live="polite"
        >
          <span className="text-white/80 text-sm font-medium">Loading…</span>
        </div>
      ) : null}

      <div className="relative z-20 text-center px-4">
        <h1 className="text-5xl font-semibold mb-6">{title}</h1>
        <div className="bg-black/40 px-6 py-3 rounded-md text-sm inline-block">
          HOME › GALLERY
        </div>
      </div>
    </section>
  );
}

function GalleryGridItem({
  src,
  index,
  onSelectImage,
}: {
  src: string;
  index: number;
  onSelectImage: (src: string) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onSelectImage(src)}
      className="group relative overflow-hidden rounded-2xl shadow-md bg-gray-100 text-left"
      aria-label={`View gallery image ${index + 1}`}
    >
      <div className="relative w-full min-h-72">
        {!failed && !loaded && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100 text-gray-500 text-sm"
            aria-hidden
          >
            Loading…
          </div>
        )}
        {failed && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100 text-gray-500 text-sm px-4 text-center">
            Image unavailable
          </div>
        )}
        <img
          src={src}
          alt={`Gallery image ${index + 1}`}
          className={`w-full h-72 object-cover transition-all duration-300 group-hover:scale-105 ${
            loaded && !failed ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setFailed(true);
            setLoaded(true);
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white text-sm font-medium tracking-wide">
            View Photo
          </span>
        </div>
      </div>
    </button>
  );
}

function GalleryGrid({
  images,
  sections,
  activeSection,
  onChangeSection,
  onSelectImage,
  isLoading,
}: {
  images: string[];
  sections: string[];
  activeSection: string;
  onChangeSection: (section: string) => void;
  onSelectImage: (src: string) => void;
  isLoading: boolean;
}) {
  return (
    <section className="bg-white -mt-24 pt-24 pb-28">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex justify-center mt-12 mb-12">
          <div className="inline-flex items-center gap-6 border border-gray-200 px-8 py-3 bg-white shadow-sm">
            {["All", ...sections].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => onChangeSection(label)}
                  disabled={isLoading}
                  className={`text-xs md:text-sm font-medium tracking-wide uppercase disabled:opacity-50 ${
                    activeSection === label
                      ? "text-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  {label}
                </button>
              ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[280px] items-center justify-center text-gray-500 text-sm">
            Loading…
          </div>
        ) : images.length === 0 ? (
          <div className="flex min-h-[280px] items-center justify-center text-gray-500 text-sm">
            No gallery images yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {images.map((src, index) => (
              <GalleryGridItem
                key={`${src}-${index}`}
                src={src}
                index={index}
                onSelectImage={onSelectImage}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PhotoViewer({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-100 bg-black/80 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/90 hover:text-white text-sm font-semibold"
          aria-label="Close photo viewer"
        >
          Close ✕
        </button>
        <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl min-h-[200px] flex items-center justify-center">
          {!failed && !loaded && (
            <div className="absolute inset-0 z-10 flex items-center justify-center text-white/80 text-sm">
              Loading…
            </div>
          )}
          {failed && (
            <div className="p-8 text-white/80 text-sm text-center">
              Could not load image.
            </div>
          )}
          <img
            src={src}
            alt={alt}
            className={`w-full max-h-[80vh] object-contain bg-black ${
              loaded && !failed ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setLoaded(true)}
            onError={() => {
              setFailed(true);
              setLoaded(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState("All");
  const [viewerSrc, setViewerSrc] = useState<string | null>(null);
  const [galleryLoading, setGalleryLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      setGalleryLoading(true);
      try {
        const response = await fetch("/api/gallery");
        if (!response.ok) throw new Error("Failed to fetch gallery");
        const data: GalleryApiResponse = await response.json();
        setTitle(data?.title || DEFAULT_TITLE);
        const rawBanner =
          typeof data?.bannerImage === "string" ? data.bannerImage.trim() : "";
        setBannerImage(rawBanner || null);
        setImages(Array.isArray(data?.images) ? data.images : []);
        const fromApi =
          Array.isArray(data?.sections) && data.sections.length > 0
            ? data.sections
            : (Array.isArray(data?.images) ? data.images : []).map((item: GalleryImage) =>
                item.category?.trim() || "General"
              );
        const sectionList = Array.from(
          new Set(fromApi.map((s) => (typeof s === "string" ? s.trim() : "")).filter(Boolean))
        );
        setSections(sectionList);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setGalleryLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filteredImages = useMemo(() => {
    return images
      .filter(
        (item) =>
          item.isActive && (activeSection === "All" || item.category === activeSection)
      )
      .map((item) => item.imageUrl);
  }, [activeSection, images]);

  return (
    <div>
      <GalleryHeader
        title={title}
        bannerImage={bannerImage}
        isFetching={galleryLoading}
      />
      <GalleryGrid
        images={filteredImages}
        sections={sections}
        activeSection={activeSection}
        onChangeSection={setActiveSection}
        onSelectImage={(src) => setViewerSrc(src)}
        isLoading={galleryLoading}
      />
      {viewerSrc ? (
        <PhotoViewer
          src={viewerSrc}
          alt="Expanded gallery image"
          onClose={() => setViewerSrc(null)}
        />
      ) : null}
    </div>
  );
}

