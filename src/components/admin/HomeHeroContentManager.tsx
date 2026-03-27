"use client";

import { useEffect, useState } from "react";

type HeroContentForm = {
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroDescription: string;
  heroCtaLabel: string;
  heroCtaHref: string;
  heroOpeningHoursRows: string[];
};

const emptyForm: HeroContentForm = {
  heroTitleLine1: "",
  heroTitleLine2: "",
  heroDescription: "",
  heroCtaLabel: "",
  heroCtaHref: "",
  heroOpeningHoursRows: [],
};

type OpeningHoursRow = {
  day: string;
  time: string;
};

const parseOpeningRows = (rows: string[] | undefined): OpeningHoursRow[] => {
  if (!rows || rows.length === 0) return [];

  const parsed = rows
    .map((row) => row.split("|"))
    .map(([day, time]) => ({
      day: (day ?? "").trim(),
      time: (time ?? "").trim(),
    }))
    .filter((row) => row.day.length > 0);

  return parsed;
};

const stringifyOpeningRows = (rows: OpeningHoursRow[]): string[] =>
  rows
    .map((row) => `${row.day.trim()}|${row.time.trim()}`)
    .filter((row) => row.includes("|") && row.split("|")[0].trim().length > 0);

export default function HomeHeroContentManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<HeroContentForm>(emptyForm);
  const [openingHoursRows, setOpeningHoursRows] = useState<OpeningHoursRow[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/site-settings");
        if (!response.ok) throw new Error("Failed to fetch hero content settings");
        const data = await response.json();
        setFormData({
          heroTitleLine1: data?.heroTitleLine1 ?? "",
          heroTitleLine2: data?.heroTitleLine2 ?? "",
          heroDescription: data?.heroDescription ?? "",
          heroCtaLabel: data?.heroCtaLabel ?? "",
          heroCtaHref: data?.heroCtaHref ?? "",
          heroOpeningHoursRows: Array.isArray(data?.heroOpeningHoursRows)
            ? data.heroOpeningHoursRows
            : [],
        });
        setOpeningHoursRows(parseOpeningRows(data?.heroOpeningHoursRows));
      } catch (error) {
        console.error("Error fetching hero content settings:", error);
        alert("Failed to load homepage hero content");
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
      const payload = {
        ...formData,
        heroOpeningHoursRows: stringifyOpeningRows(openingHoursRows),
      };
      const response = await fetch("/api/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save hero content settings");
      const updated = await response.json();
      setFormData({
        heroTitleLine1: updated?.heroTitleLine1 ?? "",
        heroTitleLine2: updated?.heroTitleLine2 ?? "",
        heroDescription: updated?.heroDescription ?? "",
        heroCtaLabel: updated?.heroCtaLabel ?? "",
        heroCtaHref: updated?.heroCtaHref ?? "",
        heroOpeningHoursRows: Array.isArray(updated?.heroOpeningHoursRows)
          ? updated.heroOpeningHoursRows
          : [],
      });
      setOpeningHoursRows(parseOpeningRows(updated?.heroOpeningHoursRows));
      alert("Homepage hero content updated successfully!");
    } catch (error) {
      console.error("Error saving hero content settings:", error);
      alert("Failed to save homepage hero content");
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
        <h2 className="text-2xl font-bold text-gray-800">Homepage Hero Content</h2>
        <p className="text-gray-600 mt-1">
          Edit the homepage headline, description and the “Contact Us” button link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title Line 1
            </label>
            <input
              type="text"
              name="heroTitleLine1"
              value={formData.heroTitleLine1}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Best care for your"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title Line 2
            </label>
            <input
              type="text"
              name="heroTitleLine2"
              value={formData.heroTitleLine2}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Good health"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opening Hours
          </label>
          <div className="mb-3">
            <button
              type="button"
              onClick={() =>
                setOpeningHoursRows((prev) => [...prev, { day: "", time: "" }])
              }
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Add Row
            </button>
          </div>
          {openingHoursRows.length === 0 && (
            <p className="text-sm text-gray-500 mb-3">
              No opening hours configured yet. Click "Add Row" to create entries.
            </p>
          )}
          <div className="space-y-3">
            {openingHoursRows.map((row, index) => (
              <div key={`${row.day}-${index}`} className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <input
                  type="text"
                  value={row.day}
                  onChange={(e) => {
                    const value = e.target.value;
                    setOpeningHoursRows((prev) =>
                      prev.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, day: value } : item
                      )
                    );
                  }}
                  className="w-full md:col-span-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Day"
                />
                <input
                  type="text"
                  value={row.time}
                  onChange={(e) => {
                    const value = e.target.value;
                    setOpeningHoursRows((prev) =>
                      prev.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, time: value } : item
                      )
                    );
                  }}
                  className="w-full md:col-span-6 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder='Time (e.g. "6.00 AM - 10.00 PM" or "CLOSED")'
                />
                <button
                  type="button"
                  onClick={() =>
                    setOpeningHoursRows((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="md:col-span-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="heroDescription"
            value={formData.heroDescription}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button Label
            </label>
            <input
              type="text"
              name="heroCtaLabel"
              value={formData.heroCtaLabel}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Contact Us"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button Link (URL or path)
            </label>
            <input
              type="text"
              name="heroCtaHref"
              value={formData.heroCtaHref}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="/contact"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Hero Content"}
          </button>
        </div>
      </form>
    </div>
  );
}

