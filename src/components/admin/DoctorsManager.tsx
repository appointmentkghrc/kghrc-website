"use client";

import { apiFetch } from "@/lib/apiFetch";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/lib/uploadthing";
import { optimizeImagesForUpload } from "@/lib/imageUploadOptimization";
import DoctorPortraitUpload from "@/components/admin/DoctorPortraitUpload";
import { DEFAULT_SITE_CONTACT_SETTINGS } from "@/lib/siteSettings";

interface Doctor {
  id: string;
  name: string;
  designation: string;
  qualification?: string | null;
  experience?: string | null;
  timings?: string | null;
  bio?: string | null;
  appointmentLink?: string;
  email?: string;
  phone?: string;
  image: string;
  sortOrder?: number | null;
  createdAt: string;
  updatedAt: string;
}

export default function DoctorsManager() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);
  const [doctorsSectionDescription, setDoctorsSectionDescription] = useState("");
  const [savingSectionDescription, setSavingSectionDescription] = useState(false);
  const [doctorsPageHeroImage, setDoctorsPageHeroImage] = useState(
    DEFAULT_SITE_CONTACT_SETTINGS.doctorsPageHeroImage
  );
  const [heroSettingsLoading, setHeroSettingsLoading] = useState(true);
  const [savingDoctorsHero, setSavingDoctorsHero] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    qualification: "",
    experience: "",
    timings: "",
    bio: "",
    appointmentLink: "",
    email: "",
    phone: "",
    image: "",
    sortOrder: "",
  });

  useEffect(() => {
    fetchDoctors();
    fetchDoctorsSectionDescription();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await apiFetch("/api/doctors");
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

  const fetchDoctorsSectionDescription = async () => {
    try {
      setHeroSettingsLoading(true);
      const res = await apiFetch("/api/site-settings");
      if (!res.ok) return;
      const data = await res.json();
      if (typeof data?.doctorsSectionDescription === "string") {
        setDoctorsSectionDescription(data.doctorsSectionDescription);
      }
      if (typeof data?.doctorsPageHeroImage === "string" && data.doctorsPageHeroImage.trim()) {
        setDoctorsPageHeroImage(data.doctorsPageHeroImage.trim());
      } else {
        setDoctorsPageHeroImage(DEFAULT_SITE_CONTACT_SETTINGS.doctorsPageHeroImage);
      }
    } catch (error) {
      console.error("Error fetching doctors section description:", error);
    } finally {
      setHeroSettingsLoading(false);
    }
  };

  const handleSaveDoctorsSectionDescription = async () => {
    try {
      setSavingSectionDescription(true);
      const res = await apiFetch("/api/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorsSectionDescription,
        }),
      });
      if (!res.ok) throw new Error("Failed to save doctors section description");
      router.refresh();
      alert("Doctors section description updated!");
    } catch (error) {
      console.error("Error saving doctors section description:", error);
      alert("Failed to save doctors section description");
    } finally {
      setSavingSectionDescription(false);
    }
  };

  const handleSaveDoctorsPageHero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingDoctorsHero(true);
      const res = await apiFetch("/api/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorsPageHeroImage }),
      });
      if (!res.ok) throw new Error("Failed to save doctors page hero");
      const data = await res.json();
      if (typeof data?.doctorsPageHeroImage === "string") {
        setDoctorsPageHeroImage(
          data.doctorsPageHeroImage.trim() || DEFAULT_SITE_CONTACT_SETTINGS.doctorsPageHeroImage
        );
      }
      router.refresh();
      alert("Doctors page header image saved!");
    } catch (error) {
      console.error("Error saving doctors page hero:", error);
      alert("Failed to save doctors page header image");
    } finally {
      setSavingDoctorsHero(false);
    }
  };

  const handleDoctorsHeroImageUpload = (res: Array<{ url: string }>) => {
    if (res?.[0]?.url) setDoctorsPageHeroImage(res[0].url);
  };

  const handleAdd = () => {
    setEditingDoctor(null);
    setFormData({
      name: "",
      designation: "",
      qualification: "",
      experience: "",
      timings: "",
      bio: "",
      appointmentLink: "",
      email: "",
      phone: "",
      image: "",
      sortOrder: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      designation: doctor.designation,
      qualification: doctor.qualification || "",
      experience: doctor.experience || "",
      timings: doctor.timings || "",
      bio: doctor.bio || "",
      appointmentLink: doctor.appointmentLink || "",
      email: doctor.email || "",
      phone: doctor.phone || "",
      image: doctor.image,
      sortOrder: String(typeof doctor.sortOrder === "number" ? doctor.sortOrder : 0),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) {
      return;
    }
    
    try {
      const response = await apiFetch(`/api/doctors/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete doctor");
      
      setDoctors(doctors.filter((d) => d.id !== id));
      router.refresh();
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
      const payload = {
        ...formData,
        sortOrder:
          formData.sortOrder.trim() === "" ? 0 : Number(formData.sortOrder),
      };

      if (editingDoctor) {
        const response = await apiFetch(`/api/doctors/${editingDoctor.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to update doctor");
        
        const updatedDoctor = await response.json();
        setDoctors(doctors.map((d) => (d.id === editingDoctor.id ? updatedDoctor : d)));
        router.refresh();
        alert("Doctor updated successfully!");
      } else {
        const response = await apiFetch("/api/doctors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to create doctor");
        
        const newDoctor = await response.json();
        setDoctors([newDoctor, ...doctors]);
        router.refresh();
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

  const filteredDoctors = doctors
    .filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.designation.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aOrder = typeof a.sortOrder === "number" ? a.sortOrder : 0;
      const bOrder = typeof b.sortOrder === "number" ? b.sortOrder : 0;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  const handleSaveOrder = async (doctor: Doctor) => {
    try {
      setSavingOrderId(doctor.id);
      const response = await apiFetch(`/api/doctors/${doctor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sortOrder:
            doctor.sortOrder === null || doctor.sortOrder === undefined
              ? 0
              : Number(doctor.sortOrder),
        }),
      });
      if (!response.ok) throw new Error("Failed to update doctor order");
      const updated = await response.json();
      setDoctors((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      router.refresh();
    } catch (error) {
      console.error("Error saving doctor order:", error);
      alert("Failed to save doctor order");
    } finally {
      setSavingOrderId(null);
    }
  };

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="bg-white rounded-lg shadow-md p-5 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">
            Doctors Section Description (Home + Doctors page)
          </h3>
          <p className="text-sm text-gray-600">
            Short text above the doctors grid on the home page and doctors listing.
          </p>
          <textarea
            value={doctorsSectionDescription}
            onChange={(e) => setDoctorsSectionDescription(e.target.value)}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Short description shown above the doctors grid..."
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveDoctorsSectionDescription}
              disabled={savingSectionDescription}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingSectionDescription ? "Saving..." : "Save Description"}
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSaveDoctorsPageHero}
          className="bg-white rounded-lg shadow-md p-5 space-y-4"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Doctors page header image
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Banner behind the title on <strong>/doctors</strong> and each doctor profile page.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="text"
              value={doctorsPageHeroImage}
              onChange={(e) => setDoctorsPageHeroImage(e.target.value)}
              disabled={heroSettingsLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
              placeholder={heroSettingsLoading ? "Loading..." : "https://... or /path.jpg"}
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
              onClientUploadComplete={handleDoctorsHeroImageUpload}
              onUploadError={(error: Error) => alert(`Upload Error: ${error.message}`)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
            <div className="h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative flex items-center justify-center">
              {heroSettingsLoading ? (
                <span className="text-gray-500 text-sm">Loading...</span>
              ) : doctorsPageHeroImage.trim() ? (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${doctorsPageHeroImage})` }}
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
                setDoctorsPageHeroImage(DEFAULT_SITE_CONTACT_SETTINGS.doctorsPageHeroImage)
              }
              disabled={heroSettingsLoading}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset to default
            </button>
            <button
              type="submit"
              disabled={savingDoctorsHero || heroSettingsLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingDoctorsHero ? "Saving..." : "Save header image"}
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
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

              <div className="flex items-end gap-2 mb-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">
                    Arrange order (lower shows first)
                  </label>
                  <input
                    type="number"
                    value={
                      doctor.sortOrder === null || doctor.sortOrder === undefined
                        ? ""
                        : String(doctor.sortOrder)
                    }
                    onChange={(e) =>
                      setDoctors((prev) =>
                        prev.map((d) =>
                          d.id === doctor.id
                            ? {
                                ...d,
                                sortOrder:
                                  e.target.value === ""
                                    ? null
                                    : Number(e.target.value),
                              }
                            : d
                        )
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveOrder(doctor)}
                  disabled={savingOrderId === doctor.id}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingOrderId === doctor.id ? "Saving..." : "Save"}
                </button>
              </div>

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
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Profile Details (shown on doctor page)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualification
                    </label>
                    <input
                      type="text"
                      value={formData.qualification}
                      onChange={(e) =>
                        setFormData({ ...formData, qualification: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="MBBS, MD (Cardiology)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience
                    </label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="12+ years"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timings
                    </label>
                    <input
                      type="text"
                      value={formData.timings}
                      onChange={(e) =>
                        setFormData({ ...formData, timings: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Mon - Sat, 10:00 AM - 2:00 PM"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About / Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Short bio about the doctor..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arrange order (lower shows first)
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Make Appointment Link
                </label>
                <input
                  type="url"
                  value={formData.appointmentLink}
                  onChange={(e) =>
                    setFormData({ ...formData, appointmentLink: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/appointment"
                />
                <p className="text-xs text-gray-500 mt-1">
                  When users click MAKE APPOINTMENT, they will be redirected to this link.
                </p>
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
                <DoctorPortraitUpload
                  imageUrl={formData.image}
                  onImageUrlChange={(url) =>
                    setFormData((prev) => ({ ...prev, image: url }))
                  }
                />
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
    </div>
  );
}
