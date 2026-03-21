"use client";

import { useState, useEffect } from "react";
import { UploadButton } from "@/lib/uploadthing";

interface Doctor {
  id: string;
  name: string;
  designation: string;
  email?: string;
  phone?: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export default function DoctorsManager() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    email: "",
    phone: "",
    image: "",
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/doctors");
      if (!response.ok) throw new Error("Failed to fetch doctors");
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      alert("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingDoctor(null);
    setFormData({
      name: "",
      designation: "",
      email: "",
      phone: "",
      image: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      designation: doctor.designation,
      email: doctor.email || "",
      phone: doctor.phone || "",
      image: doctor.image,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/doctors/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete doctor");
      
      setDoctors(doctors.filter((d) => d.id !== id));
      alert("Doctor deleted successfully!");
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Failed to delete doctor");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingDoctor) {
        const response = await fetch(`/api/doctors/${editingDoctor.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to update doctor");
        
        const updatedDoctor = await response.json();
        setDoctors(doctors.map((d) => (d.id === editingDoctor.id ? updatedDoctor : d)));
        alert("Doctor updated successfully!");
      } else {
        const response = await fetch("/api/doctors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to create doctor");
        
        const newDoctor = await response.json();
        setDoctors([newDoctor, ...doctors]);
        alert("Doctor created successfully!");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving doctor:", error);
      alert("Failed to save doctor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (res: any) => {
    if (res && res[0]) {
      setFormData({ ...formData, image: res[0].url });
    }
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Doctors Management</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          Add Doctor
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <input
          type="text"
          placeholder="Search doctors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-64 bg-gray-200 flex items-center justify-center">
              {doctor.image ? (
                <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
              ) : (
                <i className="fas fa-user-doctor text-gray-400 text-6xl"></i>
              )}
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-gray-800 text-xl mb-1">{doctor.name}</h3>
              <p className="text-blue-600 font-medium mb-4">{doctor.designation}</p>

              {(doctor.email || doctor.phone) && (
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  {doctor.email && (
                    <p className="flex items-center gap-2">
                      <i className="fas fa-envelope w-5 text-gray-400"></i>
                      <span className="truncate">{doctor.email}</span>
                    </p>
                  )}
                  {doctor.phone && (
                    <p className="flex items-center gap-2">
                      <i className="fas fa-phone w-5 text-gray-400"></i>
                      {doctor.phone}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(doctor)}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <i className="fas fa-edit mr-2"></i>Edit
                </button>
                <button
                  onClick={() => handleDelete(doctor.id)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <i className="fas fa-trash mr-2"></i>Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Jessica Jones"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation / Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Cardiologist"
                    required
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Contact Information (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="jessica@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
                <UploadButton
                  className="ut-primary-upload"
                  endpoint="doctorImage"
                  onClientUploadComplete={handleImageUpload}
                  onUploadError={(error: Error) => {
                    alert(`Upload Error: ${error.message}`);
                  }}
                />
                {formData.image && (
                  <div className="mt-2 h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
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
                  {submitting ? "Saving..." : editingDoctor ? "Update" : "Add"} Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ div>
  );
}
