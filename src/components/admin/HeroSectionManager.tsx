"use client";

import { useEffect, useState } from "react";
import { UploadButton } from "@/lib/uploadthing";

const FALLBACK_HERO_IMAGE = "/image7.jpeg";

export default function HeroSectionManager() {
  const [heroBackgroundImage, setHeroBackgroundImage] = useState(FALLBACK_HERO_IMAGE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/site-settings");
        if (!response.ok) throw new Error("Failed to fetch hero settings");
        const data = await response.json();
        setHeroBackgroundImage(data?.heroBackgroundImage || FALLBACK_HERO_IMAGE);
      } catch (error) {
        console.error("Error fetching hero settings:", error);
        alert("Failed to load hero section image settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await fetch("/api/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroBackgroundImage }),
      });

      if (!response.ok) throw new Error("Failed to save hero image");
      const updated = await response.json();
      setHeroBackgroundImage(updated?.heroBackgroundImage || FALLBACK_HERO_IMAGE);
      alert("Hero section image updated successfully!");
    } catch (error) {
      console.error("Error saving hero section image:", error);
      alert("Failed to save hero section image");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (res: Array<{ url: string }>) => {
    if (res && res[0]) {
      setHeroBackgroundImage(res[0].url);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Hero Section Image</h2>
        <p className="text-gray-600 mt-1">
          Update the homepage hero background image from admin.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-lg shadow-md p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <input
            type="text"
            value={heroBackgroundImage}
            onChange={(e) => setHeroBackgroundImage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://... or /image7.jpeg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or Upload Hero Image
          </label>
          <UploadButton
            className="ut-primary-upload"
            endpoint="heroSectionImage"
            onClientUploadComplete={handleImageUpload}
            onUploadError={(error: Error) => {
              alert(`Upload Error: ${error.message}`);
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
          <div className="h-56 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={heroBackgroundImage || FALLBACK_HERO_IMAGE}
              alt="Hero background preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex justify-between gap-3">
          <button
            type="button"
            onClick={() => setHeroBackgroundImage(FALLBACK_HERO_IMAGE)}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset to Default
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Hero Image"}
          </button>
        </div>
      </form>
    </div>
  );
}
