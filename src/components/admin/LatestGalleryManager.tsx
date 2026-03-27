"use client";

import { useEffect, useState } from "react";
import { UploadButton } from "@/lib/uploadthing";

const DEFAULT_TITLE = "Latest Gallery";
const DEFAULT_BANNER =
  "https://validthemes.net/site-template/medihub/assets/img/banner/5.jpg";

interface GalleryImage {
  id: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
}

interface GalleryResponse {
  title: string;
  bannerImage: string;
  images: GalleryImage[];
}

export default function LatestGalleryManager() {
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [submittingImage, setSubmittingImage] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [bannerImage, setBannerImage] = useState(DEFAULT_BANNER);
  const [images, setImages] = useState<GalleryImage[]>([]);

  const [newImageUrl, setNewImageUrl] = useState("");
  const [newSortOrder, setNewSortOrder] = useState(0);
  const [newIsActive, setNewIsActive] = useState(true);

  const fetchGallery = async (includeInactive = showInactive) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/gallery?includeInactive=${includeInactive ? "true" : "false"}`
      );
      if (!response.ok) throw new Error("Failed to fetch gallery");
      const data: GalleryResponse = await response.json();
      setTitle(data.title || DEFAULT_TITLE);
      setBannerImage(data.bannerImage || DEFAULT_BANNER);
      setImages(data.images || []);
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
      const response = await fetch("/api/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, bannerImage }),
      });
      if (!response.ok) throw new Error("Failed to save gallery settings");
      const updated = await response.json();
      setTitle(updated.title || DEFAULT_TITLE);
      setBannerImage(updated.bannerImage || DEFAULT_BANNER);
      alert("Gallery title and banner updated successfully!");
    } catch (error) {
      console.error("Error saving gallery section:", error);
      alert("Failed to save gallery title/banner");
    } finally {
      setSavingSection(false);
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmittingImage(true);
      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: newImageUrl,
          sortOrder: newSortOrder,
          isActive: newIsActive,
        }),
      });
      if (!response.ok) throw new Error("Failed to add image");
      setNewImageUrl("");
      setNewSortOrder(0);
      setNewIsActive(true);
      await fetchGallery();
      alert("Gallery image added successfully!");
    } catch (error) {
      console.error("Error adding gallery image:", error);
      alert("Failed to add gallery image");
    } finally {
      setSubmittingImage(false);
    }
  };

  const handleImageUpload = (res: Array<{ url: string }>) => {
    if (res && res[0]) {
      setNewImageUrl(res[0].url);
    }
  };

  const handleUpdateImage = async (
    id: string,
    updates: Partial<Pick<GalleryImage, "sortOrder" | "isActive" | "imageUrl">>
  ) => {
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update image");
      await fetchGallery();
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
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete image");
      await fetchGallery();
      alert("Gallery image deleted successfully!");
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      alert("Failed to delete image");
    }
  };

  const visibleImages = showInactive
    ? images
    : images.filter((image) => image.isActive);

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
            <div className="h-52 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={bannerImage || DEFAULT_BANNER}
                alt="Gallery banner preview"
                className="w-full h-full object-cover"
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
                onClientUploadComplete={handleImageUpload}
                onUploadError={(error: Error) => alert(`Upload Error: ${error.message}`)}
              />
            </div>
            {newImageUrl && (
              <div className="h-40 rounded-lg overflow-hidden border border-gray-200">
                <img src={newImageUrl} alt="New gallery image preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="inline-flex items-center gap-2 text-sm text-gray-700 mt-8">
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
                {submittingImage ? "Adding..." : "Add Image"}
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
                {visibleImages.map((image) => (
                  <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <img src={image.imageUrl} alt="Gallery item" className="w-full h-40 object-cover" />
                    <div className="p-4 space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Sort order</label>
                        <input
                          type="number"
                          min={0}
                          value={image.sortOrder}
                          onChange={(e) =>
                            setImages((prev) =>
                              prev.map((item) =>
                                item.id === image.id
                                  ? { ...item, sortOrder: Number(e.target.value || 0) }
                                  : item
                              )
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={image.isActive}
                          onChange={(e) =>
                            setImages((prev) =>
                              prev.map((item) =>
                                item.id === image.id ? { ...item, isActive: e.target.checked } : item
                              )
                            )
                          }
                        />
                        Active
                      </label>
                      <div className="flex justify-between gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateImage(image.id, {
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
                          onClick={() => handleDeleteImage(image.id)}
                          className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
