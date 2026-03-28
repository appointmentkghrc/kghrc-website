"use client";

import { useState, useEffect } from "react";

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
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    value: "",
    icon: "fas fa-chart-line",
    category: "general",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/statistics");
      if (!response.ok) throw new Error("Failed to fetch statistics");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      alert("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const iconOptions = [
    "fas fa-users",
    "fas fa-user-doctor",
    "fas fa-hospital",
    "fas fa-calendar-check",
    "fas fa-heartbeat",
    "fas fa-trophy",
    "fas fa-chart-line",
    "fas fa-star",
    "fas fa-check-circle",
    "fas fa-ambulance",
    "fas fa-stethoscope",
    "fas fa-pills",
  ];

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
    setFormData({ label: "", value: "", icon: "fas fa-chart-line", category: "general" });
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
      const response = await fetch(`/api/statistics/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete statistic");
      
      setStats(stats.filter((s) => s.id !== id));
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
        const response = await fetch(`/api/statistics/${editingStat.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to update statistic");
        
        const updatedStat = await response.json();
        setStats(stats.map((s) => (s.id === editingStat.id ? updatedStat : s)));
        alert("Statistic updated successfully!");
      } else {
        const response = await fetch("/api/statistics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to create statistic");
        
        const newStat = await response.json();
        setStats([newStat, ...stats]);
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
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <i className={`${stat.icon} text-white text-xl`}></i>
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
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics by Category</h3>
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
      </div>
        </>
      )}

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
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`p-3 rounded-lg border transition-colors ${
                        formData.icon === icon
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <i className={`${icon} text-xl`}></i>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Preview:</p>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <i className={`${formData.icon} text-white text-xl`}></i>
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
