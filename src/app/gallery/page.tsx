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
};

const DEFAULT_TITLE = "Latest Gallery";
const DEFAULT_BANNER =
  "https://validthemes.net/site-template/medihub/assets/img/banner/5.jpg";
const DEFAULT_IMAGES = [
  "https://validthemes.net/site-template/medihub/assets/img/gallery/1.jpg",
  "https://validthemes.net/site-template/medihub/assets/img/gallery/2.jpg",
  "https://validthemes.net/site-template/medihub/assets/img/gallery/3.jpg",
  "https://validthemes.net/site-template/medihub/assets/img/gallery/4.jpg",
  "https://validthemes.net/site-template/medihub/assets/img/gallery/5.jpg",
  "https://validthemes.net/site-template/medihub/assets/img/gallery/6.jpg",
];

function GalleryHeader({ title, bannerImage }: { title: string; bannerImage: string }) {
  return (
    <section className="relative h-[420px] flex items-center justify-center text-white">
      <div
        className="fixed top-0 left-0 w-full h-[420px] bg-cover bg-center -z-10"
        style={{
          backgroundImage: `url(${bannerImage || DEFAULT_BANNER})`,
        }}
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-semibold mb-6">{title}</h1>
        <div className="bg-black/40 px-6 py-3 rounded-md text-sm">
          HOME › GALLERY
        </div>
      </div>
    </section>
  );
}

function GalleryGrid({
  images,
  sections,
  activeSection,
  onChangeSection,
}: {
  images: string[];
  sections: string[];
  activeSection: string;
  onChangeSection: (section: string) => void;
}) {
  return (
    <section className="bg-white -mt-24 pt-24 pb-28">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex justify-center mt-12 mb-12">
          <div className="inline-flex items-center gap-6 border border-gray-200 px-8 py-3 bg-white shadow-sm">
            {["All", ...sections].map((label, index) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => onChangeSection(label)}
                  className={`text-xs md:text-sm font-medium tracking-wide uppercase ${
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {images.map((src, index) => (
            <div
              key={src}
              className="group relative overflow-hidden rounded-2xl shadow-md bg-gray-100"
            >
              <img
                src={src}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-sm font-medium tracking-wide">
                  View Photo
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function GalleryPage() {
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [bannerImage, setBannerImage] = useState(DEFAULT_BANNER);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState("All");

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch("/api/gallery");
        if (!response.ok) throw new Error("Failed to fetch gallery");
        const data: GalleryApiResponse = await response.json();
        setTitle(data?.title || DEFAULT_TITLE);
        setBannerImage(data?.bannerImage || DEFAULT_BANNER);
        setImages(Array.isArray(data?.images) ? data.images : []);
        const sectionList = Array.from(
          new Set(
            (Array.isArray(data?.images) ? data.images : []).map((item: GalleryImage) =>
              item.category?.trim() || "General"
            )
          )
        ).filter((section): section is string => typeof section === "string");
        setSections(sectionList);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      }
    };

    fetchGallery();
  }, []);

  const filteredImages = useMemo(() => {
    if (images.length === 0) return DEFAULT_IMAGES;
    return images
      .filter(
        (item) =>
          item.isActive && (activeSection === "All" || item.category === activeSection)
      )
      .map((item) => item.imageUrl);
  }, [activeSection, images]);

  const imageSources = filteredImages.length > 0 ? filteredImages : DEFAULT_IMAGES;

  return (
    <div>
      <GalleryHeader title={title} bannerImage={bannerImage} />
      <GalleryGrid
        images={imageSources}
        sections={sections}
        activeSection={activeSection}
        onChangeSection={setActiveSection}
      />
    </div>
  );
}

