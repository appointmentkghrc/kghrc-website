"use client";

import { apiFetch } from "@/lib/apiFetch";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/lib/uploadthing";
import { DEFAULT_ABOUT_SETTINGS, type AboutSettings } from "@/lib/aboutSettings";

const toMultiline = (items: string[]) => items.join("\n");
const fromMultiline = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

type OpeningHoursRow = {
  label: string;
  value: string;
};

const parseOpeningHoursRows = (rows: string[]): OpeningHoursRow[] => {
  const parsed = rows.map((row) => {
    const [left, ...rest] = row.split("|");
    return {
      label: left?.trim() || "",
      value: rest.join("|").trim() || "",
    };
  });

  return parsed.length > 0 ? parsed : [{ label: "", value: "" }];
};

const stringifyOpeningHoursRows = (rows: OpeningHoursRow[]): string[] =>
  rows
    .map((row) => ({
      label: row.label.trim(),
      value: row.value.trim(),
    }))
    .filter((row) => row.label.length > 0 || row.value.length > 0)
    .map((row) => `${row.label}|${row.value}`);

const parsePointRows = (rows: string[]): string[] => (rows.length > 0 ? rows : [""]);

const stringifyPointRows = (rows: string[]): string[] =>
  rows.map((row) => row.trim()).filter((row) => row.length > 0);

function SectionCard({
  step,
  title,
  subtitle,
  children,
}: {
  step: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-start gap-3">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-semibold mt-0.5">
            {step}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </section>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1.5">{children}</label>;
}

export default function AboutUsManager() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<AboutSettings>(DEFAULT_ABOUT_SETTINGS);

  const [openingHoursRows, setOpeningHoursRows] = useState<OpeningHoursRow[]>(
    parseOpeningHoursRows(DEFAULT_ABOUT_SETTINGS.openingHoursRows)
  );
  const [missionPointsRows, setMissionPointsRows] = useState<string[]>(
    parsePointRows(DEFAULT_ABOUT_SETTINGS.missionPoints)
  );
  const [visionPointsRows, setVisionPointsRows] = useState<string[]>(
    parsePointRows(DEFAULT_ABOUT_SETTINGS.visionPoints)
  );
  const [diagnosticItemsRows, setDiagnosticItemsRows] = useState<string[]>(
    parsePointRows(DEFAULT_ABOUT_SETTINGS.diagnosticItems)
  );
  const [facilitiesItemsRows, setFacilitiesItemsRows] = useState<string[]>(
    parsePointRows(DEFAULT_ABOUT_SETTINGS.facilitiesItems)
  );
  const [servicesItemsRows, setServicesItemsRows] = useState<string[]>(
    parsePointRows(DEFAULT_ABOUT_SETTINGS.servicesItems)
  );

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await apiFetch("/api/about-settings");
        if (!response.ok) throw new Error("Failed to fetch about settings");
        const data: AboutSettings = await response.json();
        setFormData(data);
        setOpeningHoursRows(parseOpeningHoursRows(data.openingHoursRows));
        setMissionPointsRows(parsePointRows(data.missionPoints));
        setVisionPointsRows(parsePointRows(data.visionPoints));
        setDiagnosticItemsRows(parsePointRows(data.diagnosticItems));
        setFacilitiesItemsRows(parsePointRows(data.facilitiesItems));
        setServicesItemsRows(parsePointRows(data.servicesItems));
      } catch (error) {
        console.error("Error loading about settings:", error);
        alert("Failed to load About Us settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateField = <K extends keyof AboutSettings>(key: K, value: AboutSettings[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpload =
    (field: "heroBackgroundImage" | "profileImagePrimary" | "profileImageSecondary") =>
    (res: Array<{ url: string }>) => {
      if (res && res[0]) {
        updateField(field, res[0].url);
      }
    };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload: AboutSettings = {
        ...formData,
        openingHoursRows: stringifyOpeningHoursRows(openingHoursRows),
        missionPoints: stringifyPointRows(missionPointsRows),
        visionPoints: stringifyPointRows(visionPointsRows),
        diagnosticItems: stringifyPointRows(diagnosticItemsRows),
        facilitiesItems: stringifyPointRows(facilitiesItemsRows),
        servicesItems: stringifyPointRows(servicesItemsRows),
      };

      const response = await apiFetch("/api/about-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to save about settings");

      const updated: AboutSettings = await response.json();
      setFormData(updated);
      setOpeningHoursRows(parseOpeningHoursRows(updated.openingHoursRows));
      setMissionPointsRows(parsePointRows(updated.missionPoints));
      setVisionPointsRows(parsePointRows(updated.visionPoints));
      setDiagnosticItemsRows(parsePointRows(updated.diagnosticItems));
      setFacilitiesItemsRows(parsePointRows(updated.facilitiesItems));
      setServicesItemsRows(parsePointRows(updated.servicesItems));
      router.refresh();
      alert("About Us settings updated successfully!");
    } catch (error) {
      console.error("Error saving about settings:", error);
      alert("Failed to save About Us settings");
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
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">About Us Management</h2>
        <p className="text-gray-600 mt-1">
          Each card below maps to a section on the public About page.
        </p>
      </div>

      <SectionCard
        step="1"
        title="Hero Section"
        subtitle="Controls the top banner area with page title, breadcrumb, and background image."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Hero title</FieldLabel>
            <input
              type="text"
              value={formData.heroTitle}
              onChange={(e) => updateField("heroTitle", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="About Us"
              required
            />
          </div>
          <div>
            <FieldLabel>Breadcrumb</FieldLabel>
            <input
              type="text"
              value={formData.heroBreadcrumb}
              onChange={(e) => updateField("heroBreadcrumb", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="HOME › ABOUT"
              required
            />
          </div>
        </div>
        <div>
          <FieldLabel>Hero background image URL</FieldLabel>
          <input
            type="url"
            value={formData.heroBackgroundImage}
            onChange={(e) => updateField("heroBackgroundImage", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="https://..."
            required
          />
        </div>
        <div>
          <FieldLabel>Upload hero background image</FieldLabel>
          <UploadButton
            className="ut-primary-upload"
            endpoint="aboutImage"
            onClientUploadComplete={handleUpload("heroBackgroundImage")}
            onUploadError={(error: Error) => alert(`Upload Error: ${error.message}`)}
          />
        </div>
      </SectionCard>

      <SectionCard
        step="2"
        title="Hospital Profile Section"
        subtitle="Controls the tagline, profile heading/body text, and the two overlapping images."
      >
        <div>
          <FieldLabel>Tagline</FieldLabel>
          <input
            type="text"
            value={formData.aboutTagline}
            onChange={(e) => updateField("aboutTagline", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="KANKE GENERAL HOSPITAL & RESEARCH CENTRE"
            required
          />
        </div>
        <div>
          <FieldLabel>Profile title</FieldLabel>
          <input
            type="text"
            value={formData.profileTitle}
            onChange={(e) => updateField("profileTitle", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Hospital Profile"
            required
          />
        </div>
        <div>
          <FieldLabel>Profile description</FieldLabel>
          <textarea
            value={formData.profileDescription}
            onChange={(e) => updateField("profileDescription", e.target.value)}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Hospital description text..."
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3 p-4 rounded-lg border border-gray-200">
            <div>
              <FieldLabel>Primary image URL</FieldLabel>
              <input
                type="url"
                value={formData.profileImagePrimary}
                onChange={(e) => updateField("profileImagePrimary", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="https://..."
                required
              />
            </div>
            <div>
              <FieldLabel>Upload primary image</FieldLabel>
              <UploadButton
                className="ut-primary-upload"
                endpoint="aboutImage"
                onClientUploadComplete={handleUpload("profileImagePrimary")}
                onUploadError={(error: Error) => alert(`Upload Error: ${error.message}`)}
              />
            </div>
          </div>
          <div className="space-y-3 p-4 rounded-lg border border-gray-200">
            <div>
              <FieldLabel>Secondary image URL</FieldLabel>
              <input
                type="url"
                value={formData.profileImageSecondary}
                onChange={(e) => updateField("profileImageSecondary", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="https://..."
                required
              />
            </div>
            <div>
              <FieldLabel>Upload secondary image</FieldLabel>
              <UploadButton
                className="ut-primary-upload"
                endpoint="aboutImage"
                onClientUploadComplete={handleUpload("profileImageSecondary")}
                onUploadError={(error: Error) => alert(`Upload Error: ${error.message}`)}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        step="3"
        title="Three-Column Feature Strip"
        subtitle="Controls Card 1, Opening Hours, and Card 2."
      >
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="rounded-lg border border-gray-200 p-4 space-y-4">
            <h4 className="text-sm font-semibold text-gray-800">Card 1 (Left)</h4>
            <div>
              <FieldLabel>Card 1 title</FieldLabel>
              <input
                type="text"
                value={formData.contactTitle}
                onChange={(e) => updateField("contactTitle", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Card 1 title"
                required
              />
            </div>
            <div>
              <FieldLabel>Card 1 description</FieldLabel>
              <textarea
                value={formData.contactDescription}
                onChange={(e) => updateField("contactDescription", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Card 1 description..."
                required
              />
            </div>
            <div>
              <FieldLabel>Card 1 button label</FieldLabel>
              <input
                type="text"
                value={formData.contactButtonLabel}
                onChange={(e) => updateField("contactButtonLabel", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="READ MORE"
                required
              />
            </div>
            <div>
              <FieldLabel>Card 1 button link</FieldLabel>
              <input
                type="text"
                value={formData.contactButtonHref}
                onChange={(e) => updateField("contactButtonHref", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="/contact"
                required
              />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 space-y-4">
            <h4 className="text-sm font-semibold text-gray-800">Card 2 (Right)</h4>
            <div>
              <FieldLabel>Card 2 title</FieldLabel>
              <input
                type="text"
                value={formData.cancerTitle}
                onChange={(e) => updateField("cancerTitle", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Card 2 title"
                required
              />
            </div>
            <div>
              <FieldLabel>Card 2 description</FieldLabel>
              <textarea
                value={formData.cancerDescription}
                onChange={(e) => updateField("cancerDescription", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Card 2 description..."
                required
              />
            </div>
            <div>
              <FieldLabel>Card 2 button label</FieldLabel>
              <input
                type="text"
                value={formData.cancerButtonLabel}
                onChange={(e) => updateField("cancerButtonLabel", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="READ MORE"
                required
              />
            </div>
            <div>
              <FieldLabel>Card 2 button link</FieldLabel>
              <input
                type="text"
                value={formData.cancerButtonHref}
                onChange={(e) => updateField("cancerButtonHref", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="/contact"
                required
              />
            </div>
          </div>
        </div>
        <div>
          <FieldLabel>Opening hours title</FieldLabel>
          <input
            type="text"
            value={formData.openingHoursTitle}
            onChange={(e) => updateField("openingHoursTitle", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="OPENING HOURS"
            required
          />
        </div>
        <div>
          <FieldLabel>Opening hours rows</FieldLabel>
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 bg-gray-50 px-3 py-2 border-b border-gray-200 text-xs font-semibold text-gray-700">
              <span>Day / Label</span>
              <span>Time / Value</span>
              <span className="text-right">Action</span>
            </div>
            <div className="p-3 space-y-3">
              {openingHoursRows.map((row, index) => (
                <div
                  key={`opening-row-${index}`}
                  className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-center"
                >
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) =>
                      setOpeningHoursRows((prev) =>
                        prev.map((item, i) =>
                          i === index ? { ...item, label: e.target.value } : item
                        )
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Mon - Tues :"
                  />
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) =>
                      setOpeningHoursRows((prev) =>
                        prev.map((item, i) =>
                          i === index ? { ...item, value: e.target.value } : item
                        )
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="6.00 AM - 10.00 PM"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setOpeningHoursRows((prev) =>
                        prev.length === 1 ? [{ label: "", value: "" }] : prev.filter((_, i) => i !== index)
                      )
                    }
                    className="px-3 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setOpeningHoursRows((prev) => [...prev, { label: "", value: "" }])
                }
                className="px-4 py-2 text-sm rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                + Add row
              </button>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            These rows appear on the home page (departments section), site footer, and this About
            page. Use Label | Value (saved as label|value). The title above applies everywhere.
          </p>
        </div>
      </SectionCard>

      <SectionCard
        step="4"
        title="Mission, Vision & Service Lists"
        subtitle="Controls the lower cards: mission/vision and diagnostic/facilities/services lists."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Mission title</FieldLabel>
            <input
              type="text"
              value={formData.missionTitle}
              onChange={(e) => updateField("missionTitle", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Mission"
              required
            />
          </div>
          <div>
            <FieldLabel>Vision title</FieldLabel>
            <input
              type="text"
              value={formData.visionTitle}
              onChange={(e) => updateField("visionTitle", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Vision"
              required
            />
          </div>
        </div>
        <div>
          <FieldLabel>Mission points</FieldLabel>
          <div className="rounded-lg border border-gray-200 p-3 space-y-3">
            {missionPointsRows.map((row, index) => (
              <div key={`mission-point-${index}`} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={row}
                  onChange={(e) =>
                    setMissionPointsRows((prev) =>
                      prev.map((item, i) => (i === index ? e.target.value : item))
                    )
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder={`Mission point ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setMissionPointsRows((prev) =>
                      prev.length === 1 ? [""] : prev.filter((_, i) => i !== index)
                    )
                  }
                  className="px-3 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setMissionPointsRows((prev) => [...prev, ""])}
              className="px-4 py-2 text-sm rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              + Add mission point
            </button>
          </div>
        </div>
        <div>
          <FieldLabel>Vision points</FieldLabel>
          <div className="rounded-lg border border-gray-200 p-3 space-y-3">
            {visionPointsRows.map((row, index) => (
              <div key={`vision-point-${index}`} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={row}
                  onChange={(e) =>
                    setVisionPointsRows((prev) =>
                      prev.map((item, i) => (i === index ? e.target.value : item))
                    )
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder={`Vision point ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setVisionPointsRows((prev) =>
                      prev.length === 1 ? [""] : prev.filter((_, i) => i !== index)
                    )
                  }
                  className="px-3 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setVisionPointsRows((prev) => [...prev, ""])}
              className="px-4 py-2 text-sm rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              + Add vision point
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <FieldLabel>Diagnostic card title</FieldLabel>
            <input
              type="text"
              value={formData.diagnosticTitle}
              onChange={(e) => updateField("diagnosticTitle", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Diagnostic Services"
              required
            />
          </div>
          <div>
            <FieldLabel>Facilities card title</FieldLabel>
            <input
              type="text"
              value={formData.facilitiesTitle}
              onChange={(e) => updateField("facilitiesTitle", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Hospital Facilities"
              required
            />
          </div>
          <div>
            <FieldLabel>Services card title</FieldLabel>
            <input
              type="text"
              value={formData.servicesTitle}
              onChange={(e) => updateField("servicesTitle", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Hospital Services"
              required
            />
          </div>
        </div>
        <div>
          <FieldLabel>Diagnostic list items</FieldLabel>
          <div className="rounded-lg border border-gray-200 p-3 space-y-3">
            {diagnosticItemsRows.map((row, index) => (
              <div key={`diagnostic-item-${index}`} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={row}
                  onChange={(e) =>
                    setDiagnosticItemsRows((prev) =>
                      prev.map((item, i) => (i === index ? e.target.value : item))
                    )
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder={`Diagnostic item ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setDiagnosticItemsRows((prev) =>
                      prev.length === 1 ? [""] : prev.filter((_, i) => i !== index)
                    )
                  }
                  className="px-3 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setDiagnosticItemsRows((prev) => [...prev, ""])}
              className="px-4 py-2 text-sm rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              + Add diagnostic item
            </button>
          </div>
        </div>
        <div>
          <FieldLabel>Facilities list items</FieldLabel>
          <div className="rounded-lg border border-gray-200 p-3 space-y-3">
            {facilitiesItemsRows.map((row, index) => (
              <div key={`facilities-item-${index}`} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={row}
                  onChange={(e) =>
                    setFacilitiesItemsRows((prev) =>
                      prev.map((item, i) => (i === index ? e.target.value : item))
                    )
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder={`Facilities item ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setFacilitiesItemsRows((prev) =>
                      prev.length === 1 ? [""] : prev.filter((_, i) => i !== index)
                    )
                  }
                  className="px-3 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFacilitiesItemsRows((prev) => [...prev, ""])}
              className="px-4 py-2 text-sm rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              + Add facilities item
            </button>
          </div>
        </div>
        <div>
          <FieldLabel>Services list items</FieldLabel>
          <div className="rounded-lg border border-gray-200 p-3 space-y-3">
            {servicesItemsRows.map((row, index) => (
              <div key={`services-item-${index}`} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={row}
                  onChange={(e) =>
                    setServicesItemsRows((prev) =>
                      prev.map((item, i) => (i === index ? e.target.value : item))
                    )
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder={`Services item ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setServicesItemsRows((prev) =>
                      prev.length === 1 ? [""] : prev.filter((_, i) => i !== index)
                    )
                  }
                  className="px-3 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setServicesItemsRows((prev) => [...prev, ""])}
              className="px-4 py-2 text-sm rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              + Add services item
            </button>
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-end sticky bottom-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save About Us Settings"}
        </button>
      </div>
    </form>
  );
}
