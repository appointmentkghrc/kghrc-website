"use client";

import { apiFetch } from "@/lib/apiFetch";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/lib/uploadthing";
import { optimizeImagesForUpload } from "@/lib/imageUploadOptimization";
import { DEFAULT_SITE_CONTACT_SETTINGS } from "@/lib/siteSettings";

type ContactSettingsForm = {
  officeAddress: string;
  primaryPhone: string;
  secondaryPhone: string;
  primaryEmail: string;
  secondaryEmail: string;
  mapEmbedUrl: string;
};

const emptyForm: ContactSettingsForm = {
  officeAddress: "",
  primaryPhone: "",
  secondaryPhone: "",
  primaryEmail: "",
  secondaryEmail: "",
  mapEmbedUrl: "",
};

export default function ContactSettingsManager() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ContactSettingsForm>(emptyForm);
  const [contactPageHeroImage, setContactPageHeroImage] = useState(
    DEFAULT_SITE_CONTACT_SETTINGS.contactPageHeroImage
  );
  const [heroSettingsLoading, setHeroSettingsLoading] = useState(true);
  const [savingContactHero, setSavingContactHero] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await apiFetch("/api/site-settings");
        if (!response.ok) throw new Error("Failed to fetch contact settings");
        const data = await response.json();
        setFormData({
          officeAddress: data.officeAddress ?? emptyForm.officeAddress,
          primaryPhone: data.primaryPhone ?? emptyForm.primaryPhone,
          secondaryPhone: data.secondaryPhone ?? emptyForm.secondaryPhone,
          primaryEmail: data.primaryEmail ?? emptyForm.primaryEmail,
          secondaryEmail: data.secondaryEmail ?? emptyForm.secondaryEmail,
          mapEmbedUrl: data.mapEmbedUrl ?? emptyForm.mapEmbedUrl,
        });
        if (typeof data.contactPageHeroImage === "string" && data.contactPageHeroImage.trim()) {
          setContactPageHeroImage(data.contactPageHeroImage.trim());
        } else {
          setContactPageHeroImage(DEFAULT_SITE_CONTACT_SETTINGS.contactPageHeroImage);
        }
      } catch (error) {
        console.error("Error fetching contact settings:", error);
        alert("Failed to load contact settings");
      } finally {
        setLoading(false);
        setHeroSettingsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await apiFetch("/api/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save contact settings");
      const updated = await response.json();
      setFormData({
        officeAddress: updated.officeAddress ?? formData.officeAddress,
        primaryPhone: updated.primaryPhone ?? formData.primaryPhone,
        secondaryPhone: updated.secondaryPhone ?? formData.secondaryPhone,
        primaryEmail: updated.primaryEmail ?? formData.primaryEmail,
        secondaryEmail: updated.secondaryEmail ?? formData.secondaryEmail,
        mapEmbedUrl: updated.mapEmbedUrl ?? formData.mapEmbedUrl,
      });
      router.refresh();
      alert("Contact details updated successfully!");
    } catch (error) {
      console.error("Error saving contact settings:", error);
      alert("Failed to save contact settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContactPageHero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingContactHero(true);
      const response = await apiFetch("/api/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactPageHeroImage }),
      });
      if (!response.ok) throw new Error("Failed to save");
      const updated = await response.json();
      if (typeof updated.contactPageHeroImage === "string") {
        setContactPageHeroImage(
          updated.contactPageHeroImage.trim() ||
            DEFAULT_SITE_CONTACT_SETTINGS.contactPageHeroImage
        );
      }
      router.refresh();
      alert("Contact page header image saved!");
    } catch (error) {
      console.error("Error saving contact page hero:", error);
      alert("Failed to save contact page header image");
    } finally {
      setSavingContactHero(false);
    }
  };

  const handleContactHeroUpload = (res: Array<{ url: string }>) => {
    if (res?.[0]?.url) setContactPageHeroImage(res[0].url);
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
        <h2 className="text-2xl font-bold text-gray-800">Contact Settings</h2>
        <p className="text-gray-600 mt-1">
          These values are used on the Contact page and in the Footer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 space-y-5"
        >
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-3">
            Contact details &amp; map
          </h3>
          <p className="text-sm text-gray-600 -mt-2">
            Shown on the Contact page and in the site footer.
          </p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Office Address
          </label>
          <textarea
            name="officeAddress"
            value={formData.officeAddress}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Phone
            </label>
            <input
              type="text"
              name="primaryPhone"
              value={formData.primaryPhone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Phone
            </label>
            <input
              type="text"
              name="secondaryPhone"
              value={formData.secondaryPhone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Email
            </label>
            <input
              type="email"
              name="primaryEmail"
              value={formData.primaryEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Email
            </label>
            <input
              type="email"
              name="secondaryEmail"
              value={formData.secondaryEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Map Embed URL
          </label>
          <input
            type="url"
            name="mapEmbedUrl"
            value={formData.mapEmbedUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save contact details"}
          </button>
        </div>
      </form>

        <form
          onSubmit={handleSaveContactPageHero}
          className="bg-white rounded-lg shadow-md p-6 space-y-4 lg:sticky lg:top-4"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Contact page header image</h3>
            <p className="text-sm text-gray-600 mt-1">
              Top banner on the public <strong>/contact</strong> page.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="text"
              value={contactPageHeroImage}
              onChange={(e) => setContactPageHeroImage(e.target.value)}
              disabled={heroSettingsLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              placeholder={heroSettingsLoading ? "Loading..." : "https://... or /path.jpg"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Or upload image</label>
            <UploadButton
              className="ut-primary-upload"
              endpoint="heroSectionImage"
              onBeforeUploadBegin={(files) =>
                optimizeImagesForUpload(files, { maxDimension: 2200, quality: 0.82 })
              }
              onClientUploadComplete={handleContactHeroUpload}
              onUploadError={(error: Error) => alert(`Upload Error: ${error.message}`)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
            <div className="h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative flex items-center justify-center">
              {heroSettingsLoading ? (
                <span className="text-gray-500 text-sm">Loading...</span>
              ) : contactPageHeroImage.trim() ? (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${contactPageHeroImage})` }}
                  />
                  <div className="absolute inset-0 bg-black/35" />
                </>
              ) : (
                <span className="text-gray-500 text-sm relative z-10">No image URL</span>
              )}
            </div>
          </div>
          <div className="flex justify-between gap-3 flex-wrap">
            <button
              type="button"
              onClick={() =>
                setContactPageHeroImage(DEFAULT_SITE_CONTACT_SETTINGS.contactPageHeroImage)
              }
              disabled={heroSettingsLoading}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Reset to default
            </button>
            <button
              type="submit"
              disabled={savingContactHero || heroSettingsLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {savingContactHero ? "Saving..." : "Save header image"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
