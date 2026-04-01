"use client";

import { apiFetch } from "@/lib/apiFetch";
import { memo, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/lib/uploadthing";
import { optimizeImagesForUpload } from "@/lib/imageUploadOptimization";

const DEFAULT_TITLE = "Latest Gallery";
const DEFAULT_BANNER =
  "https://validthemes.net/site-template/medihub/assets/img/banner/5.jpg";
const IMAGES_BATCH_SIZE = 18;

interface GalleryImage {
  id: string;
  imageUrl: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

interface GalleryResponse {
  title: string;
  bannerImage: string;
  images: GalleryImage[];
  sections?: string[];
}

interface GalleryImageCardProps {
  image: GalleryImage;
  sections: string[];
  onLocalUpdate: (id: string, updates: Partial<GalleryImage>) => void;
  onSave: (id: string, updates: Partial<Pick<GalleryImage, "sortOrder" | "isActive" | "imageUrl" | "category">>) => void;
  onDelete: (id: string) => void;
}

const GalleryImageCard = memo(function GalleryImageCard({
  image,
  sections,
  onLocalUpdate,
  onSave,
  onDelete,
}: GalleryImageCardProps) {
  const sectionOptions = useMemo(
    () =>
      Array.from(new Set([...(sections || []), image.category || "General"]))
        .filter((s) => typeof s === "string" && s.trim().length > 0)
        .sort((a, b) => a.localeCompare(b)),
    [sections, image.category]
  );

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden [content-visibility:auto] [contain-intrinsic-size:300px]">
      <img
        src={image.imageUrl}
        alt="Gallery item"
        className="w-full h-40 object-cover"
        loading="lazy"
        decoding="async"
      />
      <div className="p-4 space-y-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Section</label>
          <select
            value={image.category || "General"}
            onChange={(e) => onLocalUpdate(image.id, { category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {sectionOptions.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Sort order</label>
          <input
            type="number"
            min={0}
            value={image.sortOrder}
            onChange={(e) => onLocalUpdate(image.id, { sortOrder: Number(e.target.value || 0) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={image.isActive}
            onChange={(e) => onLocalUpdate(image.id, { isActive: e.target.checked })}
          />
          Active
        </label>
        <div className="flex justify-between gap-3">
          <button
            type="button"
            onClick={() =>
              onSave(image.id, {
                category: image.category,
                sortOrder: image.sortOrder,
                isActive: image.isActive,
              })
            }
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => onDelete(image.id)}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
});

export default function LatestGalleryManager() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [savingCategories, setSavingCategories] = useState(false);
  const [submittingImage, setSubmittingImage] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [bannerImage, setBannerImage] = useState(DEFAULT_BANNER);
  const [images, setImages] = useState<GalleryImage[]>([]);

  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageUrls, setNewImageUrls] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [newSortOrder, setNewSortOrder] = useState(0);
  const [newIsActive, setNewIsActive] = useState(true);
  const [sections, setSections] = useState<string[]>([]);
  const [newSectionName, setNewSectionName] = useState("");
  const [visibleCount, setVisibleCount] = useState(IMAGES_BATCH_SIZE);

  const fetchGallery = async (includeInactive = showInactive) => {
    try {
      setLoading(true);
      const response = await apiFetch(
        `/api/gallery?includeInactive=${includeInactive ? "true" : "false"}`
      );
      if (!response.ok) throw new Error("Failed to fetch gallery");
      const data: GalleryResponse = await response.json();
      setTitle(data.title || DEFAULT_TITLE);
      setBannerImage(data.bannerImage || DEFAULT_BANNER);
      setImages(data.images || []);
      const normalizedSections = Array.from(new Set(data.sections || []))
        .map((s) => (typeof s === "string" ? s.trim() : ""))
        .filter((s) => s.length > 0)
        .sort((a, b) => a.localeCompare(b));
      setSections(normalizedSections);
      setNewCategory((prev) => {
        if (prev && normalizedSections.includes(prev)) return prev;
        return normalizedSections[0] || "";
      });
    } catch (error) {
      console.error("Error fetching gallery:", error);
      alert("Failed to load gallery data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery(true);
    // Initial load only; this avoids re-fetch loops from function identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingSection(true);
      const response = await apiFetch("/api/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, bannerImage }),
      });
      if (!response.ok) throw new Error("Failed to save gallery settings");
      const updated = await response.json();
      setTitle(updated.title || DEFAULT_TITLE);
      setBannerImage(updated.bannerImage || DEFAULT_BANNER);
      router.refresh();
      alert("Gallery title and banner updated successfully!");
    } catch (error) {
      console.error("Error saving gallery section:", error);
      alert("Failed to save gallery title/banner");
    } finally {
      setSavingSection(false);
    }
  };

  const handleAddSection = () => {
    const next = newSectionName.trim();
    if (!next) return;
    setSections((prev) =>
      Array.from(new Set([...prev, next])).sort((a, b) => a.localeCompare(b))
    );
    setNewCategory(next);
    setNewSectionName("");
  };

  const handleRemoveSection = (section: string) => {
    setSections((prev) => prev.filter((s) => s !== section));
    setNewCategory((prev) => (prev === section ? "" : prev));
  };

  const handleSaveCategories = async () => {
    try {
      setSavingCategories(true);
      const response = await apiFetch("/api/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, bannerImage, sections }),
      });
      if (!response.ok) throw new Error("Failed to save categories");
      await fetchGallery(true);
      router.refresh();
      alert("Gallery categories updated successfully!");
    } catch (error) {
      console.error("Error saving gallery categories:", error);
      alert("Failed to save gallery categories");
    } finally {
      setSavingCategories(false);
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmittingImage(true);
      const cleanedUploadedUrls = Array.from(
        new Set(newImageUrls.map((url) => url.trim()).filter((url) => url.length > 0))
      );
      const response = await apiFetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: newImageUrl,
          imageUrls: cleanedUploadedUrls,
          category: newCategory.trim(),
          sortOrder: newSortOrder,
          isActive: newIsActive,
        }),
      });
      if (!response.ok) throw new Error("Failed to add image");
      setNewImageUrl("");
      setNewImageUrls([]);
      setNewCategory(sections[0] || "");
      setNewSortOrder(0);
      setNewIsActive(true);
      await fetchGallery();
      router.refresh();
      alert(
        cleanedUploadedUrls.length > 1
          ? `${cleanedUploadedUrls.length} gallery images added successfully!`
          : "Gallery image added successfully!"
      );
    } catch (error) {
      console.error("Error adding gallery image:", error);
      alert("Failed to add gallery image");
    } finally {
      setSubmittingImage(false);
    }
  };

  const handleImageUpload = (res: Array<{ url: string }>) => {
    const uploadedUrls =
      res?.map((item) => item?.url?.trim()).filter((url): url is string => Boolean(url)) || [];

    if (uploadedUrls.length === 0) return;

    setNewImageUrls(uploadedUrls);
    // Keep first uploaded URL in the manual field for backward compatibility.
    setNewImageUrl(uploadedUrls[0]);
  };

  const handleBannerUpload = (res: Array<{ url: string }>) => {
    if (res && res[0]) {
      setBannerImage(res[0].url);
    }
  };

  const handleUpdateImage = async (
    id: string,
    updates: Partial<Pick<GalleryImage, "sortOrder" | "isActive" | "imageUrl" | "category">>
  ) => {
    try {
      const response = await apiFetch(`/api/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update image");
      await fetchGallery();
      router.refresh();
    } catch (error) {
      console.error("Error updating gallery image:", error);
      alert("Failed to update image");
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery image?")) {
      return;
    }

    try {
      const response = await apiFetch(`/api/gallery/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete image");
      await fetchGallery();
      router.refresh();
      alert("Gallery image deleted successfully!");
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      alert("Failed to delete image");
    }
  };

  const handleLocalImageUpdate = (id: string, updates: Partial<GalleryImage>) => {
    setImages((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const visibleImages = useMemo(
    () => (showInactive ? images : images.filter((image) => image.isActive)),
    [images, showInactive]
  );
  const displayedImages = useMemo(
    () => visibleImages.slice(0, visibleCount),
    [visibleImages, visibleCount]
  );
  const hasMoreImages = displayedImages.length < visibleImages.length;

  useEffect(() => {
    setVisibleCount(IMAGES_BATCH_SIZE);
  }, [showInactive, images.length]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Latest Gallery Management</h2>
        <p className="text-gray-600 mt-1">
          Customize gallery page title and manage gallery images.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <form onSubmit={handleSaveSection} className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Gallery Header Settings</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image URL</label>
              <input
                type="url"
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or Upload Banner Image
              </label>
              <UploadButton
                className="ut-primary-upload"
                endpoint="galleryImage"
                onBeforeUploadBegin={(files) =>
                  optimizeImagesForUpload(files, { maxDimension: 1920, quality: 0.82 })
                }
                onClientUploadComplete={handleBannerUpload}
                onUploadError={(error: Error) => alert(`Upload Error: ${error.message}`)}
              />
            </div>
            <div className="h-52 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={bannerImage || DEFAULT_BANNER}
                alt="Gallery banner preview"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingSection}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingSection ? "Saving..." : "Save Header Settings"}
              </button>
            </div>
          </form>

          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Gallery Categories</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Add custom categories to use in the gallery.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveCategories}
                disabled={savingCategories}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingCategories ? "Saving..." : "Save Categories"}
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. Events, Facilities, Camp 2026..."
              />
              <button
                type="button"
                onClick={handleAddSection}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Add category
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {sections.map((section) => (
                <span
                  key={section}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-sm text-gray-800"
                >
                  {section}
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(section)}
                    className="text-gray-500 hover:text-red-600"
                    aria-label={`Remove ${section}`}
                    title="Remove"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddImage} className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Add Gallery Image</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Or Upload Image</label>
              <UploadButton
                className="ut-primary-upload"
                endpoint="galleryImage"
                appearance={{
                  button:
                    "ut-uploading:cursor-not-allowed ut-uploading:bg-blue-700 after:ut-readying:content-['Upload_Image(s)']",
                }}
                onBeforeUploadBegin={(files) =>
                  optimizeImagesForUpload(files, { maxDimension: 1920, quality: 0.82 })
                }
                onClientUploadComplete={handleImageUpload}
                onUploadError={(error: Error) => alert(`Upload Error: ${error.message}`)}
              />
              <p className="mt-1 text-xs text-gray-500">
                You can select multiple files to upload and add them together under one category.
              </p>
            </div>
            {(newImageUrls.length > 0 || newImageUrl) && (
              <div className="h-40 rounded-lg overflow-hidden border border-gray-200">
                {newImageUrls.length > 1 ? (
                  <div className="h-full p-3 overflow-auto">
                    <p className="text-sm text-gray-700 mb-2">
                      {newImageUrls.length} files ready to add
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {newImageUrls.map((url) => (
                        <img
                          key={url}
                          src={url}
                          alt="New gallery image preview"
                          className="w-full h-20 object-cover rounded-md border border-gray-200"
                          loading="lazy"
                          decoding="async"
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <img
                    src={newImageUrls[0] || newImageUrl}
                    alt="New gallery image preview"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                <input
                  list="gallery-sections"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Select or type a category"
                  required
                />
                <datalist id="gallery-sections">
                  {sections.map((section) => (
                    <option key={section} value={section} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                <input
                  type="number"
                  min={0}
                  value={newSortOrder}
                  onChange={(e) => setNewSortOrder(Number(e.target.value || 0))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700 mt-8 md:mt-0">
                <input
                  type="checkbox"
                  checked={newIsActive}
                  onChange={(e) => setNewIsActive(e.target.checked)}
                />
                Active
              </label>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingImage}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingImage
                  ? "Adding..."
                  : `Add ${newImageUrls.length > 1 ? `${newImageUrls.length} Images` : "Image"}`}
              </button>
            </div>
          </form>

          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Gallery Images</h3>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={(e) => {
                    setShowInactive(e.target.checked);
                    fetchGallery(e.target.checked);
                  }}
                />
                Show inactive
              </label>
            </div>

            {visibleImages.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No gallery images found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedImages.map((image) => (
                  <GalleryImageCard
                    key={image.id}
                    image={image}
                    sections={sections}
                    onLocalUpdate={handleLocalImageUpdate}
                    onSave={handleUpdateImage}
                    onDelete={handleDeleteImage}
                  />
                ))}
              </div>
            )}
            {hasMoreImages && (
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + IMAGES_BATCH_SIZE)}
                  className="px-5 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800"
                >
                  Load more images ({visibleImages.length - displayedImages.length} remaining)
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
