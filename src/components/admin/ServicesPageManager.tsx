"use client";

import { apiFetch } from "@/lib/apiFetch";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FaServiceIconPicker from "@/components/admin/FaServiceIconPicker";
import { ServicePageIcon } from "@/lib/servicePageIcons";
import { UploadButton } from "@/lib/uploadthing";
import { optimizeImagesForUpload } from "@/lib/imageUploadOptimization";
import { DEFAULT_SITE_CONTACT_SETTINGS } from "@/lib/siteSettings";

interface ServicePageItemRow {
  id: string;
  icon: string;
  heading: string;
  description: string;
  link: string;
  detailPageContent: string;
  detailPageImage: string | null;
  detailPageHeaderImage: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const defaultForm = {
  icon: "FaStethoscope" as string,
  heading: "",
  description: "",
  link: "",
  detailPageContent: "",
  detailPageImage: "",
  detailPageHeaderImage: "",
  sortOrder: 0,
  isActive: true,
};

export default function ServicesPageManager() {
  const router = useRouter();
  const [items, setItems] = useState<ServicePageItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [servicesPageHeroImage, setServicesPageHeroImage] = useState(
    DEFAULT_SITE_CONTACT_SETTINGS.servicesPageHeroImage
  );
  const [heroSettingsLoading, setHeroSettingsLoading] = useState(true);
  const [savingServicesHero, setSavingServicesHero] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<ServicePageItemRow | null>(null);
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setHeroSettingsLoading(true);
      try {
        const [itemsRes, settingsRes] = await Promise.all([
          apiFetch("/api/service-page-items"),
          apiFetch("/api/site-settings"),
        ]);
        if (itemsRes.ok) {
          const data = (await itemsRes.json()) as ServicePageItemRow[];
          setItems(data);
        } else {
          alert("Failed to load services");
        }
        if (settingsRes.ok) {
          const s = await settingsRes.json();
          if (typeof s.servicesPageHeroImage === "string" && s.servicesPageHeroImage.trim()) {
            setServicesPageHeroImage(s.servicesPageHeroImage.trim());
          } else {
            setServicesPageHeroImage(DEFAULT_SITE_CONTACT_SETTINGS.servicesPageHeroImage);
          }
        }
      } catch (error) {
        console.error("Error fetching services page:", error);
        alert("Failed to load services");
      } finally {
        setLoading(false);
        setHeroSettingsLoading(false);
      }
    };
    load();
  }, []);

  const handleServicesHeroUpload = (res: Array<{ url: string }>) => {
    if (res?.[0]?.url) setServicesPageHeroImage(res[0].url);
  };

  const handleSaveServicesPageHero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingServicesHero(true);
      const res = await apiFetch("/api/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ servicesPageHeroImage }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      if (typeof data.servicesPageHeroImage === "string") {
        setServicesPageHeroImage(
          data.servicesPageHeroImage.trim() ||
            DEFAULT_SITE_CONTACT_SETTINGS.servicesPageHeroImage
        );
      }
      router.refresh();
      alert("Services page header image saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save services page header image");
    } finally {
      setSavingServicesHero(false);
    }
  };

  const handleAdd = () => {
    setEditing(null);
    setFormData({ ...defaultForm });
    setIsModalOpen(true);
  };

  const handleEdit = (row: ServicePageItemRow) => {
    setEditing(row);
    setFormData({
      icon: row.icon,
      heading: row.heading,
      description: row.description,
      link: row.link,
      detailPageContent: row.detailPageContent ?? "",
      detailPageImage: row.detailPageImage ?? "",
      detailPageHeaderImage: row.detailPageHeaderImage ?? "",
      sortOrder: row.sortOrder,
      isActive: row.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDetailPageImageUpload = (res: Array<{ url: string }>) => {
    if (res?.[0]?.url) {
      setFormData((f) => ({ ...f, detailPageImage: res[0].url }));
    }
  };

  const handleDetailPageHeaderUpload = (res: Array<{ url: string }>) => {
    if (res?.[0]?.url) {
      setFormData((f) => ({ ...f, detailPageHeaderImage: res[0].url }));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service card?")) return;
    try {
      const response = await apiFetch(`/api/service-page-items/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setItems((prev) => prev.filter((i) => i.id !== id));
      router.refresh();
      alert("Deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to delete");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.heading.trim() || !formData.description.trim()) {
      alert("Heading and description are required.");
      return;
    }
    if (!formData.link.trim() && !formData.detailPageContent.trim()) {
      alert(
        "Add either a link (for a simple redirect) or detail page content (for a full page like Diagnostic Services)."
      );
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        detailPageImage: formData.detailPageImage.trim() || null,
        detailPageHeaderImage: formData.detailPageHeaderImage.trim() || null,
      };
      if (editing) {
        const response = await apiFetch(`/api/service-page-items/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Failed to update");
        const updated = (await response.json()) as ServicePageItemRow;
        setItems((prev) =>
          prev.map((i) => (i.id === updated.id ? updated : i))
        );
        router.refresh();
        alert("Updated successfully");
      } else {
        const response = await apiFetch("/api/service-page-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Failed to create");
        const created = (await response.json()) as ServicePageItemRow;
        setItems((prev) => [...prev, created].sort((a, b) => a.sortOrder - b.sortOrder));
        router.refresh();
        alert("Created successfully");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Services page</h2>
          <p className="text-gray-600 mt-1">
            Cards on <strong>/services</strong>: icon, title, description, and either a
            link or optional <strong>detail page</strong> (same style as Diagnostic
            Services). No statistics—content only.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shrink-0"
        >
          <i className="fas fa-plus" />
          Add card
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100 space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Services page cards</h3>
          <p className="text-sm text-gray-600">
            Each card appears on <strong>/services</strong> below the page header. Use{" "}
            <strong>Add card</strong> to create entries, or edit cards in the grid below.
          </p>
        </div>

        <form
          onSubmit={handleSaveServicesPageHero}
          className="bg-white rounded-lg shadow-md p-5 space-y-4 border border-gray-100"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Services page header image</h3>
            <p className="text-sm text-gray-600 mt-1">
              Top banner on the public <strong>/services</strong> page.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="text"
              value={servicesPageHeroImage}
              onChange={(e) => setServicesPageHeroImage(e.target.value)}
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
              onClientUploadComplete={handleServicesHeroUpload}
              onUploadError={(error: Error) => alert(`Upload Error: ${error.message}`)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
            <div className="h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative flex items-center justify-center">
              {heroSettingsLoading ? (
                <span className="text-gray-500 text-sm">Loading...</span>
              ) : servicesPageHeroImage.trim() ? (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${servicesPageHeroImage})` }}
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
                setServicesPageHeroImage(DEFAULT_SITE_CONTACT_SETTINGS.servicesPageHeroImage)
              }
              disabled={heroSettingsLoading}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Reset to default
            </button>
            <button
              type="submit"
              disabled={savingServicesHero || heroSettingsLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {savingServicesHero ? "Saving..." : "Save header image"}
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : (
        <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center shrink-0 text-blue-700">
                <ServicePageIcon name={item.icon} className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-lg">
                  {item.heading}
                </h3>
                <p className="text-sm text-gray-500 mt-1 break-all">
                  {item.detailPageContent?.trim() ? (
                    <span className="text-blue-700">
                      → /services/item/{item.id} (detail page)
                    </span>
                  ) : (
                    <>→ {item.link || "(no link)"}</>
                  )}
                </p>
                {!item.isActive && (
                  <span className="inline-block mt-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                    Hidden on site
                  </span>
                )}
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-3 line-clamp-3">
              {item.description}
            </p>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                Sort: {item.sortOrder}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-800 px-3 py-1"
                >
                  <i className="fas fa-edit" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-800 px-3 py-1"
                >
                  <i className="fas fa-trash" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No cards yet. Add one to show on the Services page.
        </p>
      )}
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                {editing ? "Edit card" : "Add card"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times text-xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon (Font Awesome)
                </label>
                <FaServiceIconPicker
                  value={formData.icon}
                  onChange={(icon) => setFormData({ ...formData, icon })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heading
                </label>
                <input
                  type="text"
                  value={formData.heading}
                  onChange={(e) =>
                    setFormData({ ...formData, heading: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link (when no detail page below)
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="/contact or https://... (optional if detail page is filled)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  If you add detail page content, the card opens that page instead of this
                  link.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <p className="text-sm font-medium text-gray-800">
                  Optional: full detail page (like Diagnostic Services)
                </p>
                <p className="text-xs text-gray-600">
                  When the detail text box is not empty, the card links to a dedicated page
                  with the layout Home › Services, hero banner, and your content below the
                  card description.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detail page — main content
                </label>
                <textarea
                  value={formData.detailPageContent}
                  onChange={(e) =>
                    setFormData({ ...formData, detailPageContent: e.target.value })
                  }
                  rows={8}
                  placeholder="Longer description, lists, or extra information shown only on the detail page..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detail page — banner image URL (optional)
                </label>
                <input
                  type="text"
                  value={formData.detailPageHeaderImage}
                  onChange={(e) =>
                    setFormData({ ...formData, detailPageHeaderImage: e.target.value })
                  }
                  placeholder="Top strip behind the title; defaults to Services page hero if empty"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-3">
                  Or upload banner
                </label>
                <UploadButton
                  className="ut-primary-upload"
                  endpoint="heroSectionImage"
                  onBeforeUploadBegin={(files) =>
                    optimizeImagesForUpload(files, { maxDimension: 2200, quality: 0.82 })
                  }
                  onClientUploadComplete={handleDetailPageHeaderUpload}
                  onUploadError={(error: Error) => alert(`Upload Error: ${error.message}`)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detail page — body image URL (optional)
                </label>
                <input
                  type="text"
                  value={formData.detailPageImage}
                  onChange={(e) =>
                    setFormData({ ...formData, detailPageImage: e.target.value })
                  }
                  placeholder="Large image under the title block"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-3">
                  Or upload image
                </label>
                <UploadButton
                  className="ut-primary-upload"
                  endpoint="diagnosticServiceImage"
                  onBeforeUploadBegin={(files) =>
                    optimizeImagesForUpload(files, { maxDimension: 2200, quality: 0.82 })
                  }
                  onClientUploadComplete={handleDetailPageImageUpload}
                  onUploadError={(error: Error) => alert(`Upload Error: ${error.message}`)}
                />
                {formData.detailPageImage.trim() ? (
                  <div className="mt-2 h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={formData.detailPageImage.trim()}
                      alt="Detail preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort order
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sortOrder: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="rounded border-gray-300"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Visible on Services page
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Saving…" : editing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
