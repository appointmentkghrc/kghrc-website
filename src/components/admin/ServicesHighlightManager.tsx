"use client";

import { apiFetch } from "@/lib/apiFetch";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import {
  DEFAULT_SERVICES_HIGHLIGHT_ITEMS,
  SERVICES_HIGHLIGHT_ICON_OPTIONS,
  type ServicesHighlightItem,
} from "@/lib/servicesHighlightDefaults";
import { resolveServicesHighlightIcon } from "@/lib/servicesHighlightIcons";

function ScrollableIconSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selected =
    SERVICES_HIGHLIGHT_ICON_OPTIONS.find((o) => o.value === value) ??
    SERVICES_HIGHLIGHT_ICON_OPTIONS[0];
  const SelectedIcon = resolveServicesHighlightIcon(value);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm hover:bg-gray-50"
      >
        <span className="flex min-w-0 items-center gap-2">
          <SelectedIcon className="h-5 w-5 shrink-0 text-gray-700" strokeWidth={1.75} />
          <span className="truncate text-gray-800">{selected?.label}</span>
        </span>
        <i
          className={`fas fa-chevron-down shrink-0 text-xs text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul
          className="absolute z-30 mt-1 max-h-48 w-full overflow-y-auto overscroll-contain rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
          role="listbox"
        >
          {SERVICES_HIGHLIGHT_ICON_OPTIONS.map((opt) => {
            const OptIcon = resolveServicesHighlightIcon(opt.value);
            const isActive = opt.value === value;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                    isActive ? "bg-blue-50 text-blue-900" : "text-gray-800"
                  }`}
                >
                  <OptIcon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                  <span className="min-w-0 truncate">{opt.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function ServicesHighlightManager() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<ServicesHighlightItem[]>(DEFAULT_SERVICES_HIGHLIGHT_ITEMS);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await apiFetch("/api/site-settings");
        if (!response.ok) throw new Error("Failed to fetch site settings");
        const data = await response.json();

        const rawItems = data?.servicesHighlightItems;
        if (Array.isArray(rawItems) && rawItems.length > 0) {
          const parsed: ServicesHighlightItem[] = [];
          for (const entry of rawItems) {
            if (!entry || typeof entry !== "object") continue;
            const obj = entry as Record<string, unknown>;
            const title = typeof obj.title === "string" ? obj.title.trim() : "";
            const href = typeof obj.href === "string" ? obj.href.trim() : "";
            const iconKey =
              typeof obj.iconKey === "string" ? obj.iconKey.trim() : "userRound";
            if (title.length === 0 || href.length === 0) continue;
            parsed.push({ title, href, iconKey });
          }
          if (parsed.length > 0) setItems(parsed);
          else setItems([...DEFAULT_SERVICES_HIGHLIGHT_ITEMS]);
        } else {
          setItems([...DEFAULT_SERVICES_HIGHLIGHT_ITEMS]);
        }
      } catch (error) {
        console.error("Error fetching services highlight settings:", error);
        alert("Failed to load services highlight settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleItemChange = (
    index: number,
    field: keyof ServicesHighlightItem,
    value: string
  ) => {
    setItems((prev) => {
      const next = [...prev];
      const row = { ...next[index], [field]: value };
      next[index] = row;
      return next;
    });
  };

  const addRow = () => {
    setItems((prev) => [
      ...prev,
      { title: "", href: "/contact", iconKey: SERVICES_HIGHLIGHT_ICON_OPTIONS[0]?.value ?? "userRound" },
    ]);
  };

  const removeRow = (index: number) => {
    setItems((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = items
      .map((row) => ({
        title: row.title.trim(),
        href: row.href.trim(),
        iconKey: row.iconKey.trim() || "userRound",
      }))
      .filter((row) => row.title.length > 0 && row.href.length > 0);

    if (trimmed.length === 0) {
      alert("Add at least one card with a title and link.");
      return;
    }

    try {
      setSaving(true);
      const response = await apiFetch("/api/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          servicesHighlightTitle: "",
          servicesHighlightItems: trimmed,
        }),
      });

      if (!response.ok) throw new Error("Failed to save services highlight settings");

      const data = await response.json();
      if (Array.isArray(data?.servicesHighlightItems)) {
        setItems(data.servicesHighlightItems);
      }

      router.refresh();
      alert("Services highlight section updated successfully!");
    } catch (error) {
      console.error("Error saving services highlight settings:", error);
      alert("Failed to save services highlight settings");
    } finally {
      setSaving(false);
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
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Services highlight (homepage)</h2>
        <p className="text-gray-600 mt-1">
          The cards below the departments section. Each card has a title, link URL, and icon.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Cards</span>
            <button
              type="button"
              onClick={addRow}
              className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add card
            </button>
          </div>

          {items.map((row, index) => {
            const PreviewIcon = resolveServicesHighlightIcon(row.iconKey);
            const selectedIconLabel =
              SERVICES_HIGHLIGHT_ICON_OPTIONS.find((o) => o.value === row.iconKey)?.label ??
              row.iconKey;

            return (
              <div
                key={index}
                className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                  <div className="md:col-span-4">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={row.title}
                      onChange={(e) => handleItemChange(index, "title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="e.g. ADVANCED CARE"
                      required
                    />
                  </div>
                  <div className="md:col-span-5">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Link URL</label>
                    <input
                      type="text"
                      value={row.href}
                      onChange={(e) => handleItemChange(index, "href", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="/contact or https://..."
                      required
                    />
                  </div>
                  <div className="md:col-span-3 flex justify-end md:justify-start">
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      disabled={items.length <= 1}
                      className="text-sm text-red-600 hover:text-red-800 disabled:opacity-40 disabled:cursor-not-allowed px-2 py-2 self-end"
                      title="Remove card"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                    <ScrollableIconSelect
                      value={row.iconKey}
                      onChange={(next) => handleItemChange(index, "iconKey", next)}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white px-6 py-3 sm:shrink-0">
                    <span className="text-xs font-medium text-gray-500">Preview</span>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-blue-600 text-blue-600">
                      <PreviewIcon className="h-7 w-7" strokeWidth={1.75} />
                    </div>
                    <p className="text-center text-[11px] text-gray-600 leading-snug max-w-[140px]">
                      {selectedIconLabel}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
