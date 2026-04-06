"use client";

import { apiFetch } from "@/lib/apiFetch";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/lib/uploadthing";
import { optimizeImagesForUpload } from "@/lib/imageUploadOptimization";
import FaServiceIconPicker from "@/components/admin/FaServiceIconPicker";
import { StatisticIcon } from "@/lib/statisticIcon";

const FALLBACK_STATS_BG = "/7.jpg";

interface Stat {
  id: string;
  label: string;
  value: string;
  icon: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function StatsManager() {
  const router = useRouter();
  const [stats, setStats] = useState<Stat[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [statsBackgroundUrl, setStatsBackgroundUrl] = useState("");
  const [savingBackground, setSavingBackground] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    value: "",
    icon: "FaChartLine",
    category: "general",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const statsRes = await apiFetch("/api/statistics");
        if (!statsRes.ok) throw new Error("Failed to fetch statistics");
        const data = await statsRes.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
        alert("Failed to load statistics");
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchSettings = async () => {
      try {
        setSettingsLoading(true);
        const settingsRes = await apiFetch("/api/site-settings");
        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          setStatsBackgroundUrl(
            settings?.statsSectionBackgroundImage?.trim() || FALLBACK_STATS_BG
          );
        } else {
          setStatsBackgroundUrl(FALLBACK_STATS_BG);
        }
      } catch (error) {
        console.error("Error fetching site settings:", error);
        setStatsBackgroundUrl(FALLBACK_STATS_BG);
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchStats();
    fetchSettings();
  }, []);

  const handleSaveBackground = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingBackground(true);
      const response = await apiFetch("/api/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statsSectionBackgroundImage: statsBackgroundUrl }),
      });
      if (!response.ok) throw new Error("Failed to save background");
      const updated = await response.json();
      setStatsBackgroundUrl(
        updated?.statsSectionBackgroundImage?.trim() || FALLBACK_STATS_BG
      );
      router.refresh();
      alert("Statistics section background updated successfully!");
    } catch (error) {
      console.error("Error saving statistics background:", error);
      alert("Failed to save statistics section background");
    } finally {
      setSavingBackground(false);
    }
  };

  const handleStatsImageUpload = (res: Array<{ url: string }>) => {
    if (res?.[0]?.url) {
      setStatsBackgroundUrl(res[0].url);
    }
  };

  const categories = [
    "general",
    "patients",
    "doctors",
    "departments",
    "medical",
    "achievements",
    "pmjay",
  ];

  const handleAdd = () => {
    setEditingStat(null);
    setFormData({ label: "", value: "", icon: "FaChartLine", category: "general" });
    setIsModalOpen(true);
  };

  const handleEdit = (stat: Stat) => {
    setEditingStat(stat);
    setFormData({
      label: stat.label,
      value: stat.value,
      icon: stat.icon,
      category: stat.category,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this statistic?")) {
      return;
    }
    
    try {
      const response = await apiFetch(`/api/statistics/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete statistic");
      
      setStats(stats.filter((s) => s.id !== id));
      router.refresh();
      alert("Statistic deleted successfully!");
    } catch (error) {
      console.error("Error deleting statistic:", error);
      alert("Failed to delete statistic");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingStat) {
        const response = await apiFetch(`/api/statistics/${editingStat.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to update statistic");
        
        const updatedStat = await response.json();
        setStats(stats.map((s) => (s.id === editingStat.id ? updatedStat : s)));
        router.refresh();
        alert("Statistic updated successfully!");
      } else {
        const response = await apiFetch("/api/statistics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to create statistic");
        
        const newStat = await response.json();
        setStats([newStat, ...stats]);
        router.refresh();
        alert("Statistic created successfully!");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving statistic:", error);
      alert("Failed to save statistic");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Statistics section (homepage)
            </h2>
            <p className="text-gray-600 mt-1">
              Change the background photo behind the numbers on the home page.
            </p>
          </div>

          <form
            onSubmit={handleSaveBackground}
            className="bg-white rounded-lg shadow-md p-6 space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background image URL
              </label>
              <input
                type="text"
                value={statsBackgroundUrl}
                onChange={(e) => setStatsBackgroundUrl(e.target.value)}
                disabled={settingsLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
                placeholder={settingsLoading ? "Loading..." : "https://... or /7.jpg"}
                required={!settingsLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or upload image
              </label>
              <UploadButton
                className="ut-primary-upload"
                endpoint="heroSectionImage"
                onBeforeUploadBegin={(files) =>
                  optimizeImagesForUpload(files, { maxDimension: 2200, quality: 0.82 })
                }
                onClientUploadComplete={handleStatsImageUpload}
                onUploadError={(error: Error) => {
                  alert(`Upload Error: ${error.message}`);
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative flex items-center justify-center">
                {settingsLoading ? (
                  <span className="text-gray-500 text-sm">Loading...</span>
                ) : statsBackgroundUrl.trim() ? (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${statsBackgroundUrl})`,
                      }}
                    />
                    <div className="absolute inset-0 bg-white/30" />
                  </>
                ) : (
                  <span className="text-gray-500 text-sm relative z-10">
                    No image URL
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between gap-3">
              <button
                type="button"
                onClick={() => setStatsBackgroundUrl(FALLBACK_STATS_BG)}
                disabled={settingsLoading}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset to default
              </button>
              <button
                type="submit"
                disabled={savingBackground || settingsLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingBackground ? "Saving..." : "Save background"}
              </button>
            </div>
          </form>

          <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Statistics Management</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          Add Statistic
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Statistics Display</h3>
        {statsLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center gap-3 text-gray-500">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
              <span className="text-sm">Loading...</span>
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center [&_svg]:text-white [&_i]:text-white">
                  <StatisticIcon icon={stat.icon} className="text-white text-xl w-7 h-7" />
                </div>
                <span className="px-2 py-1 bg-white text-blue-600 text-xs rounded-full font-medium">
                  {stat.category}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</p>
              <p className="text-gray-600 font-medium">{stat.label}</p>
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-blue-200">
                <button
                  onClick={() => handleEdit(stat)}
                  className="text-blue-600 hover:text-blue-800 px-2"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => handleDelete(stat.id)}
                  className="text-red-600 hover:text-red-800 px-2"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics by Category</h3>
        {statsLoading ? (
          <div className="flex justify-center py-10 text-gray-500 text-sm">Loading...</div>
        ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const count = stats.filter((s) => s.category === category).length;
            return (
              <div key={category} className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{count}</p>
                <p className="text-sm text-gray-600 capitalize">{category}</p>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                {editingStat ? "Edit Statistic" : "Add New Statistic"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Total Patients"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 10,000+"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon (Font Awesome via react-icons)
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Existing entries that use classic classes like{" "}
                  <code className="bg-gray-100 px-1 rounded">fas fa-users</code> still work on
                  the site.
                </p>
                <FaServiceIconPicker
                  value={formData.icon}
                  onChange={(icon) => setFormData({ ...formData, icon })}
                />
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Preview:</p>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center [&_svg]:text-white [&_i]:text-white">
                      <StatisticIcon
                        icon={formData.icon}
                        className="text-white text-xl w-7 h-7"
                      />
                    </div>
                    <span className="px-2 py-1 bg-white text-blue-600 text-xs rounded-full font-medium">
                      {formData.category}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-800 mb-2">{formData.value || "Value"}</p>
                  <p className="text-gray-600 font-medium">{formData.label || "Label"}</p>
                </div>
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
                  {submitting ? "Saving..." : editingStat ? "Update" : "Add"} Statistic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
