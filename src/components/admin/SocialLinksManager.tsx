"use client";

import { useEffect, useState } from "react";

type SocialLinksForm = {
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
};

const emptyForm: SocialLinksForm = {
  facebookUrl: "",
  instagramUrl: "",
  twitterUrl: "",
  youtubeUrl: "",
  linkedinUrl: "",
};

export default function SocialLinksManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<SocialLinksForm>(emptyForm);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/site-settings");
        if (!response.ok) throw new Error("Failed to fetch social links");
        const data = await response.json();
        setFormData({
          facebookUrl: data?.facebookUrl ?? "",
          instagramUrl: data?.instagramUrl ?? "",
          twitterUrl: data?.twitterUrl ?? "",
          youtubeUrl: data?.youtubeUrl ?? "",
          linkedinUrl: data?.linkedinUrl ?? "",
        });
      } catch (error) {
        console.error("Error fetching social links:", error);
        alert("Failed to load social links");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await fetch("/api/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to save social links");
      const updated = await response.json();
      setFormData({
        facebookUrl: updated?.facebookUrl ?? "",
        instagramUrl: updated?.instagramUrl ?? "",
        twitterUrl: updated?.twitterUrl ?? "",
        youtubeUrl: updated?.youtubeUrl ?? "",
        linkedinUrl: updated?.linkedinUrl ?? "",
      });
      alert("Social links updated successfully!");
    } catch (error) {
      console.error("Error saving social links:", error);
      alert("Failed to save social links");
    } finally {
      setSaving(false);
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
        <h2 className="text-2xl font-bold text-gray-800">Social Links</h2>
        <p className="text-gray-600 mt-1">
          These links are used for the social icons in the Footer.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-5">
        {(
          [
            { key: "facebookUrl", label: "Facebook URL", placeholder: "https://facebook.com/..." },
            { key: "instagramUrl", label: "Instagram URL", placeholder: "https://instagram.com/..." },
            { key: "twitterUrl", label: "X (Twitter) URL", placeholder: "https://x.com/..." },
            { key: "youtubeUrl", label: "YouTube URL", placeholder: "https://youtube.com/..." },
            { key: "linkedinUrl", label: "LinkedIn URL", placeholder: "https://linkedin.com/company/..." },
          ] as const
        ).map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <input
              type="url"
              name={field.key}
              value={formData[field.key]}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={field.placeholder}
            />
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Social Links"}
          </button>
        </div>
      </form>
    </div>
  );
}

