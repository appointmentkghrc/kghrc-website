"use client";

import { useEffect, useState } from "react";
import { UploadButton } from "@/lib/uploadthing";

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  createdAt: string;
}

export default function TpaInsurancePartnersManager() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tpa-insurance-partners");
      if (!response.ok) throw new Error("Failed to fetch partners");
      const data = (await response.json()) as Partner[];
      setPartners(data);
    } catch (error) {
      console.error("Error fetching TPA/Insurance partners:", error);
      alert("Failed to load partners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleAddPartner = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      const response = await fetch("/api/tpa-insurance-partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, logoUrl }),
      });
      if (!response.ok) throw new Error("Failed to add partner");

      setName("");
      setLogoUrl("");
      await fetchPartners();
      alert("Partner added successfully!");
    } catch (error) {
      console.error("Error adding TPA/Insurance partner:", error);
      alert("Failed to add partner");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (!confirm("Are you sure you want to remove this partner?")) {
      return;
    }

    try {
      const response = await fetch(`/api/tpa-insurance-partners/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete partner");

      await fetchPartners();
      alert("Partner removed successfully!");
    } catch (error) {
      console.error("Error deleting TPA/Insurance partner:", error);
      alert("Failed to remove partner");
    }
  };

  const handleLogoUpload = (res: Array<{ url: string }>) => {
    if (res?.[0]?.url) {
      setLogoUrl(res[0].url);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">TPA / Insurance Partners</h2>
        <p className="text-gray-600 mt-1">
          Add partner name and logo, or remove existing partners.
        </p>
      </div>

      <form onSubmit={handleAddPartner} className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Add Partner</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Partner Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. Mediassist TPA"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
          <input
            type="url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://..."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Or Upload Logo</label>
          <UploadButton
            className="ut-primary-upload"
            endpoint="galleryImage"
            onClientUploadComplete={handleLogoUpload}
            onUploadError={(error: Error) => alert(`Upload Error: ${error.message}`)}
          />
        </div>
        {logoUrl && (
          <div className="h-28 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center bg-white">
            <img src={logoUrl} alt="Partner logo preview" className="max-h-20 max-w-full object-contain" />
          </div>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Adding..." : "Add Partner"}
          </button>
        </div>
      </form>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Existing Partners</h3>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : partners.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No partners added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {partners.map((partner) => (
              <div key={partner.id} className="border border-gray-200 rounded-lg p-4">
                <div className="h-16 flex items-center justify-center mb-3">
                  <img src={partner.logoUrl} alt={`${partner.name} logo`} className="max-h-14 max-w-full object-contain" />
                </div>
                <p className="text-sm font-medium text-gray-800 text-center">{partner.name}</p>
                <button
                  type="button"
                  onClick={() => handleDeletePartner(partner.id)}
                  className="w-full mt-4 px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
