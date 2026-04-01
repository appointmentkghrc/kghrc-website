"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import { UploadButton } from "@/lib/uploadthing";
import { optimizeImagesForUpload } from "@/lib/imageUploadOptimization";
import { DEFAULT_SITE_CONTACT_SETTINGS } from "@/lib/siteSettings";

type PageHeroKey =
  | "doctorsPageHeroImage"
  | "blogPageHeroImage"
  | "contactPageHeroImage"
  | "servicesPageHeroImage";

const PAGE_CONFIG: {
  key: PageHeroKey;
  title: string;
  route: string;
  blurb: string;
}[] = [
  {
    key: "doctorsPageHeroImage",
    title: "Doctors",
    route: "/doctors",
    blurb: "Doctors listing and each doctor profile header.",
  },
  {
    key: "blogPageHeroImage",
    title: "Blog listing",
    route: "/blog",
    blurb: "Top banner on the blog index page.",
  },
  {
    key: "contactPageHeroImage",
    title: "Contact",
    route: "/contact",
    blurb: "Top banner on the Contact page.",
  },
  {
    key: "servicesPageHeroImage",
    title: "Services",
    route: "/services",
    blurb: "Top banner on the Services page.",
  },
];

function initialImages(): Record<PageHeroKey, string> {
  return {
    doctorsPageHeroImage: DEFAULT_SITE_CONTACT_SETTINGS.doctorsPageHeroImage,
    blogPageHeroImage: DEFAULT_SITE_CONTACT_SETTINGS.blogPageHeroImage,
    contactPageHeroImage: DEFAULT_SITE_CONTACT_SETTINGS.contactPageHeroImage,
    servicesPageHeroImage: DEFAULT_SITE_CONTACT_SETTINGS.servicesPageHeroImage,
  };
}

export default function PageHeroImagesManager() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<Record<PageHeroKey, string>>(initialImages);
  const [savingKey, setSavingKey] = useState<PageHeroKey | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await apiFetch("/api/site-settings");
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setImages({
          doctorsPageHeroImage:
            typeof data.doctorsPageHeroImage === "string" && data.doctorsPageHeroImage.trim()
              ? data.doctorsPageHeroImage.trim()
              : DEFAULT_SITE_CONTACT_SETTINGS.doctorsPageHeroImage,
          blogPageHeroImage:
            typeof data.blogPageHeroImage === "string" && data.blogPageHeroImage.trim()
              ? data.blogPageHeroImage.trim()
              : DEFAULT_SITE_CONTACT_SETTINGS.blogPageHeroImage,
          contactPageHeroImage:
            typeof data.contactPageHeroImage === "string" && data.contactPageHeroImage.trim()
              ? data.contactPageHeroImage.trim()
              : DEFAULT_SITE_CONTACT_SETTINGS.contactPageHeroImage,
          servicesPageHeroImage:
            typeof data.servicesPageHeroImage === "string" && data.servicesPageHeroImage.trim()
              ? data.servicesPageHeroImage.trim()
              : DEFAULT_SITE_CONTACT_SETTINGS.servicesPageHeroImage,
        });
      } catch (e) {
        console.error(e);
        alert("Failed to load page hero settings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateUrl = (key: PageHeroKey, value: string) => {
    setImages((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: PageHeroKey) => {
    try {
      setSavingKey(key);
      const res = await apiFetch("/api/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: images[key] }),
      });
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      const saved = data[key];
      if (typeof saved === "string" && saved.trim()) {
        setImages((prev) => ({ ...prev, [key]: saved.trim() }));
      }
      router.refresh();
      alert("Saved.");
    } catch (e) {
      console.error(e);
      alert("Failed to save");
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 border-t border-gray-200 pt-10">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Inner page hero images</h2>
        <p className="text-gray-600 mt-1 max-w-3xl">
          Background banners for Doctors, Blog, Contact, and Services. Upload or paste a URL, then
          save each section. The homepage hero is configured above.
        </p>
      </div>

      <div className="grid gap-6">
        {PAGE_CONFIG.map(({ key, title, route, blurb }) => (
          <div
            key={key}
            className="bg-white rounded-lg shadow-md border border-gray-100 p-5 space-y-3"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {title}{" "}
                <span className="text-sm font-normal text-gray-500">({route})</span>
              </h3>
              <p className="text-sm text-gray-600">{blurb}</p>
            </div>
            <input
              type="text"
              value={images[key]}
              onChange={(e) => updateUrl(key, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Image URL"
            />
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-2">Upload image</span>
              <UploadButton
                className="ut-primary-upload"
                endpoint="heroSectionImage"
                onBeforeUploadBegin={(files) =>
                  optimizeImagesForUpload(files, { maxDimension: 2200, quality: 0.82 })
                }
                onClientUploadComplete={(res) => {
                  if (res?.[0]?.url) updateUrl(key, res[0].url);
                }}
                onUploadError={(error: Error) => alert(`Upload Error: ${error.message}`)}
              />
            </div>
            <div className="h-36 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
              <img src={images[key]} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <button
                type="button"
                onClick={() =>
                  updateUrl(key, DEFAULT_SITE_CONTACT_SETTINGS[key])
                }
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Reset to default
              </button>
              <button
                type="button"
                disabled={savingKey === key}
                onClick={() => handleSave(key)}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {savingKey === key ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
