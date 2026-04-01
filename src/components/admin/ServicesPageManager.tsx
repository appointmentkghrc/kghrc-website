"use client";

import { apiFetch } from "@/lib/apiFetch";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SERVICE_PAGE_ICON_KEYS,
  ServicePageIcon,
} from "@/lib/servicePageIcons";
import { UploadButton } from "@/lib/uploadthing";
import { optimizeImagesForUpload } from "@/lib/imageUploadOptimization";
import { DEFAULT_SITE_CONTACT_SETTINGS } from "@/lib/siteSettings";

interface ServicePageItemRow {
  id: string;
  icon: string;
  heading: string;
  description: string;
  link: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const defaultForm = {
  icon: "Stethoscope" as string,
  heading: "",
  description: "",
  link: "",
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
  const [savingServicesHero, setSavingServicesHero] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<ServicePageItemRow | null>(null);
  const [formData, setFormData] = useState(defaultForm);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await apiFetch("/api/service-page-items");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = (await response.json()) as ServicePageItemRow[];
      setItems(data);
    } catch (error) {
      console.error("Error fetching service page items:", error);
      alert("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    const loadHero = async () => {
      try {
        const res = await apiFetch("/api/site-settings");
        if (!res.ok) return;
        const data = await res.json();
        if (typeof data.servicesPageHeroImage === "string" && data.servicesPageHeroImage.trim()) {
          setServicesPageHeroImage(data.servicesPageHeroImage.trim());
        }
      } catch (e) {
        console.error("Error loading services page hero:", e);
      }
    };
    loadHero();
  }, []);

  const handleSaveServicesHero = async (e: React.FormEvent) => {
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
        setServicesPageHeroImage(data.servicesPageHeroImage);
      }
      router.refresh();
      alert("Services page hero image saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save services page hero image");
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
      sortOrder: row.sortOrder,
      isActive: row.isActive,
    });
    setIsModalOpen(true);
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
    setSubmitting(true);
    try {
      if (editing) {
        const response = await apiFetch(`/api/service-page-items/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
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
          body: JSON.stringify(formData),
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSaveServicesHero}
        className="bg-white rounded-lg shadow-md p-5 space-y-3 border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-800">Services page hero</h3>
        <p className="text-sm text-gray-600">
          Header background on the public <code className="text-xs bg-gray-100 px-1 rounded">/services</code> page.
        </p>
        <input
          type="text"
          value={servicesPageHeroImage}
          onChange={(e) => setServicesPageHeroImage(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Image URL"
        />
        <div>
          <span className="block text-sm text-gray-600 mb-1">Or upload</span>
          <UploadButton
            className="ut-primary-upload"
            endpoint="heroSectionImage"
            onBeforeUploadBegin={(files) =>
              optimizeImagesForUpload(files, { maxDimension: 2200, quality: 0.82 })
            }
            onClientUploadComplete={(res) => {
              if (res?.[0]?.url) setServicesPageHeroImage(res[0].url);
            }}
            onUploadError={(error: Error) => alert(`Upload Error: ${error.message}`)}
          />
        </div>
        <div className="h-36 rounded-lg overflow-hidden border border-gray-200">
          <img src={servicesPageHeroImage} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex justify-between gap-2">
          <button
            type="button"
            onClick={() =>
              setServicesPageHeroImage(DEFAULT_SITE_CONTACT_SETTINGS.servicesPageHeroImage)
            }
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            Reset to default
          </button>
          <button
            type="submit"
            disabled={savingServicesHero}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {savingServicesHero ? "Saving..." : "Save hero image"}
          </button>
        </div>
      </form>

      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Services page</h2>
          <p className="text-gray-600 mt-1">
            Cards on the public Services page: icon, title, description, and
            link (internal path or full URL). No statistics—content only.
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
                  → {item.link || "(no link)"}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
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
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {SERVICE_PAGE_ICON_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
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
                  Link (redirect on click)
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="/contact or https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
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
