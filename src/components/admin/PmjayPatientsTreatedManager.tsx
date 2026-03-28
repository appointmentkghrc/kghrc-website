"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { DEFAULT_PMJAY_PRIMARY_LOGO } from "@/lib/pmjayDefaults";

type PmjayFormData = {
  pmjayPatientsTreatedValue: string;
  pmjayPrimaryLogoUrl: string;
  pmjaySecondaryLogoUrl: string;
};

const emptyForm: PmjayFormData = {
  pmjayPatientsTreatedValue: "0",
  pmjayPrimaryLogoUrl: "",
  pmjaySecondaryLogoUrl: "",
};

export default function PmjayPatientsTreatedManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<PmjayFormData>(emptyForm);
  const [pmjayStatValue, setPmjayStatValue] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const [settingsRes, statsRes] = await Promise.all([
          fetch("/api/site-settings"),
          fetch("/api/statistics"),
        ]);
        if (!settingsRes.ok) throw new Error("Failed to fetch site settings");
        const data = await settingsRes.json();

        setFormData({
          pmjayPatientsTreatedValue: String(data?.pmjayPatientsTreatedValue ?? "0"),
          pmjayPrimaryLogoUrl: String(data?.pmjayPrimaryLogoUrl ?? ""),
          pmjaySecondaryLogoUrl: String(data?.pmjaySecondaryLogoUrl ?? ""),
        });

        if (statsRes.ok) {
          const stats: { category?: string; value?: string }[] = await statsRes.json();
          const pmjay = stats.find((s) => s.category === "pmjay");
          const v = pmjay?.value?.trim();
          setPmjayStatValue(v ? String(v) : null);
        }
      } catch (error) {
        console.error("Error fetching PMJAY settings:", error);
        alert("Failed to load PMJAY settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await fetch("/api/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pmjayPatientsTreatedValue: formData.pmjayPatientsTreatedValue,
          pmjayPrimaryLogoUrl: formData.pmjayPrimaryLogoUrl,
          pmjaySecondaryLogoUrl: formData.pmjaySecondaryLogoUrl,
        }),
      });

      if (!response.ok) throw new Error("Failed to save PMJAY settings");

      alert("PMJAY homepage section updated successfully!");
    } catch (error) {
      console.error("Error saving PMJAY settings:", error);
      alert("Failed to save PMJAY settings");
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

  const primaryLogoUrl = formData.pmjayPrimaryLogoUrl.trim();
  const previewPrimaryLogo = primaryLogoUrl || DEFAULT_PMJAY_PRIMARY_LOGO;
  const secondaryLogoUrl = formData.pmjaySecondaryLogoUrl.trim();
  const value = formData.pmjayPatientsTreatedValue.trim() || "0";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">PMJAY Patients Treated</h2>
        <p className="text-gray-600 mt-1">
          Configure the homepage mini-section (PMJAY logos and fallback count). The live number
          prefers a Statistics row with category <code className="text-sm bg-gray-100 px-1 rounded">pmjay</code>{" "}
          (Admin → Statistics).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-5">
        {pmjayStatValue !== null ? (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            Homepage count is taken from the database (Statistics, category{" "}
            <strong>pmjay</strong>): <strong>{pmjayStatValue}</strong>. The field below is only
            used if that statistic is removed.
          </div>
        ) : null}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Patients treated value (fallback)
          </label>
          <input
            type="text"
            name="pmjayPatientsTreatedValue"
            value={formData.pmjayPatientsTreatedValue}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. 10,000+"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PMJAY Logo URL (left)
            </label>
            <input
              type="url"
              name="pmjayPrimaryLogoUrl"
              value={formData.pmjayPrimaryLogoUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Leave empty for ${DEFAULT_PMJAY_PRIMARY_LOGO}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional PMJAY Logo URL (right)
            </label>
            <input
              type="url"
              name="pmjaySecondaryLogoUrl"
              value={formData.pmjaySecondaryLogoUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save PMJAY Section"}
          </button>
        </div>
      </form>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
        <div className="rounded-2xl border border-gray-200 bg-[#f7f7f7] px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={previewPrimaryLogo}
              alt="Ayushman Bharat PMJAY"
              className="w-16 h-16 object-contain rounded-2xl border border-gray-200 bg-white p-1"
            />
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Patients treated under Ayushman Bharat Yogna
              </p>
              <p className="text-3xl font-extrabold text-gray-900 leading-none mt-2">
                {value}
              </p>
            </div>
          </div>

          {secondaryLogoUrl ? (
            <div className="flex items-center justify-center">
              <img
                src={secondaryLogoUrl}
                alt="Additional PMJAY logo"
                className="h-14 w-auto object-contain"
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

