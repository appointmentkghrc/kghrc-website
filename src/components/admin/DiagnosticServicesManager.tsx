"use client";

import { useEffect, useState } from "react";
import { UploadButton } from "@/lib/uploadthing";

interface DiagnosticService {
  id: string;
  name: string;
  title: string;
  description: string;
  details: string;
  image: string;
  headerBackgroundImage?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const emptyForm = {
  name: "",
  title: "",
  description: "",
  details: "",
  image: "",
  headerBackgroundImage: "",
  sortOrder: 0,
  isActive: true,
};

export default function DiagnosticServicesManager() {
  const [services, setServices] = useState<DiagnosticService[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<DiagnosticService | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const handleImageUpload = (res: Array<{ url: string }>) => {
    if (res && res[0]) {
      setFormData((prev) => ({ ...prev, image: res[0].url }));
    }
  };

  const handleHeaderImageUpload = (res: Array<{ url: string }>) => {
    if (res && res[0]) {
      setFormData((prev) => ({ ...prev, headerBackgroundImage: res[0].url }));
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/diagnostic-services?includeInactive=true");
      if (!response.ok) throw new Error("Failed to fetch diagnostic services");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching diagnostic services:", error);
      alert("Failed to load diagnostic services");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingService(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const handleEdit = (service: DiagnosticService) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      title: service.title,
      description: service.description,
      details: service.details,
      image: service.image,
      headerBackgroundImage: service.headerBackgroundImage || "",
      sortOrder: service.sortOrder,
      isActive: service.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this diagnostic service?")) {
      return;
    }

    try {
      const response = await fetch(`/api/diagnostic-services/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete diagnostic service");
      setServices((prev) => prev.filter((service) => service.id !== id));
      alert("Diagnostic service deleted successfully!");
    } catch (error) {
      console.error("Error deleting diagnostic service:", error);
      alert("Failed to delete diagnostic service");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingService) {
        const response = await fetch(`/api/diagnostic-services/${editingService.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Failed to update diagnostic service");
      } else {
        const response = await fetch("/api/diagnostic-services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Failed to create diagnostic service");
      }

      setIsModalOpen(false);
      await fetchServices();
      alert(
        editingService
          ? "Diagnostic service updated successfully!"
          : "Diagnostic service added successfully!"
      );
    } catch (error) {
      console.error("Error saving diagnostic service:", error);
      alert("Failed to save diagnostic service");
    } finally {
      setSubmitting(false);
    }
  };

  const visibleServices = showInactive
    ? services
    : services.filter((service) => service.isActive);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Diagnostic Services Management</h2>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                />
                Show inactive
              </label>
              <button
                onClick={handleAdd}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <i className="fas fa-plus"></i>
                Add Service
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {visibleServices.map((service) => (
                <div
                  key={service.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <img src={service.image} alt={service.name} className="w-full h-40 object-cover" />
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">{service.name}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        #{service.sortOrder}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">{service.title}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          service.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="text-blue-600 hover:text-blue-800 px-2"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="text-red-600 hover:text-red-800 px-2"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {visibleServices.length === 0 && (
              <p className="text-gray-500 text-center py-10">No diagnostic services found.</p>
            )}
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                {editingService ? "Edit Diagnostic Service" : "Add Diagnostic Service"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., CT Scan"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, sortOrder: Number(e.target.value || 0) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={0}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., CT Scan Imaging"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Or Upload Image</label>
                <UploadButton
                  className="ut-primary-upload"
                  endpoint="diagnosticServiceImage"
                  onClientUploadComplete={handleImageUpload}
                  onUploadError={(error: Error) => {
                    alert(`Upload Error: ${error.message}`);
                  }}
                />
                {formData.image && (
                  <div className="mt-2 h-40 bg-gray-100 rounded-lg overflow-hidden">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Header Background Image URL
                </label>
                <input
                  type="url"
                  value={formData.headerBackgroundImage}
                  onChange={(e) =>
                    setFormData({ ...formData, headerBackgroundImage: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://... (used in Home › Diagnostic Services header)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or Upload Header Background Image
                </label>
                <UploadButton
                  className="ut-primary-upload"
                  endpoint="diagnosticServiceImage"
                  onClientUploadComplete={handleHeaderImageUpload}
                  onUploadError={(error: Error) => {
                    alert(`Upload Error: ${error.message}`);
                  }}
                />
                {formData.headerBackgroundImage && (
                  <div className="mt-2 h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={formData.headerBackgroundImage}
                      alt="Header preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Details</label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                Active
              </label>

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
                  {submitting ? "Saving..." : editingService ? "Update" : "Add"} Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
