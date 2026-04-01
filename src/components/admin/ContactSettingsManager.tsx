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
  contactPageHeroImage: string;
};

const emptyForm: ContactSettingsForm = {
  officeAddress: "",
  primaryPhone: "",
  secondaryPhone: "",
  primaryEmail: "",
  secondaryEmail: "",
  mapEmbedUrl: "",
  contactPageHeroImage: DEFAULT_SITE_CONTACT_SETTINGS.contactPageHeroImage,
};

export default function ContactSettingsManager() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ContactSettingsForm>(emptyForm);

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
          contactPageHeroImage:
            typeof data.contactPageHeroImage === "string" && data.contactPageHeroImage.trim()
              ? data.contactPageHeroImage.trim()
              : DEFAULT_SITE_CONTACT_SETTINGS.contactPageHeroImage,
        });
      } catch (error) {
        console.error("Error fetching contact settings:", error);
        alert("Failed to load contact settings");
      } finally {
        setLoading(false);
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
        contactPageHeroImage:
          typeof updated.contactPageHeroImage === "string" && updated.contactPageHeroImage.trim()
            ? updated.contactPageHeroImage.trim()
            : DEFAULT_SITE_CONTACT_SETTINGS.contactPageHeroImage,
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

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact page hero (header banner)
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Background image at the top of the public Contact page.
          </p>
          <input
            type="text"
            name="contactPageHeroImage"
            value={formData.contactPageHeroImage}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Image URL"
          />
          <div className="mt-2">
            <label className="block text-sm text-gray-600 mb-1">Or upload</label>
            <UploadButton
              className="ut-primary-upload"
              endpoint="heroSectionImage"
              onBeforeUploadBegin={(files) =>
                optimizeImagesForUpload(files, { maxDimension: 2200, quality: 0.82 })
              }
              onClientUploadComplete={(res) => {
                if (res?.[0]?.url) {
                  setFormData((prev) => ({ ...prev, contactPageHeroImage: res[0].url }));
                }
              }}
              onUploadError={(error: Error) => alert(`Upload Error: ${error.message}`)}
            />
          </div>
          <div className="mt-3 h-36 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={formData.contactPageHeroImage}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                contactPageHeroImage: DEFAULT_SITE_CONTACT_SETTINGS.contactPageHeroImage,
              }))
            }
            className="mt-2 text-sm text-gray-600 underline hover:text-gray-900"
          >
            Reset hero to default
          </button>
        </div>

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
            {saving ? "Saving..." : "Save Contact Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
