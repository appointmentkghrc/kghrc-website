"use client";

import type { ComponentType } from "react";
import * as FaIcons from "react-icons/fa";
import { useMemo, useState } from "react";
import { StatisticIcon } from "@/lib/statisticIcon";

const FA_ICON_NAMES = Object.keys(FaIcons).filter(
  (key) =>
    key !== "default" &&
    typeof (FaIcons as Record<string, unknown>)[key] === "function"
) as string[];

type FaIconComponent = ComponentType<{ className?: string }>;

function getFaIcon(name: string): FaIconComponent | null {
  const Cmp = (FaIcons as Record<string, FaIconComponent | undefined>)[name];
  return Cmp ?? null;
}

export default function FaServiceIconPicker({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (name: string) => void;
  id?: string;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FA_ICON_NAMES;
    return FA_ICON_NAMES.filter((name) => name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="space-y-3" id={id}>
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2">
        <span className="text-sm text-gray-500 shrink-0">Selected:</span>
        <div className="flex items-center gap-2 min-w-0">
          <StatisticIcon icon={value} className="w-7 h-7 text-blue-700 shrink-0" />
          <code className="text-xs font-mono text-gray-800 truncate max-w-[min(100%,14rem)]">
            {value || "—"}
          </code>
        </div>
      </div>

      <label className="block text-sm font-medium text-gray-700">Search icons</label>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. heart, ambulance, user…"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        autoComplete="off"
      />

      <div className="text-xs text-gray-500">
        {filtered.length} of {FA_ICON_NAMES.length} Font Awesome icons (react-icons/fa)
      </div>

      <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
        {filtered.map((name) => {
          const Icon = getFaIcon(name);
          if (!Icon) return null;
          const active = value === name;
          return (
            <button
              key={name}
              type="button"
              onClick={() => onChange(name)}
              title={name}
              className={`flex flex-col items-center gap-1 rounded-md px-2 py-2 text-center transition-colors border ${
                active
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-400"
                  : "border-transparent hover:bg-gray-100"
              }`}
            >
              <Icon className="w-6 h-6 text-gray-800 shrink-0" />
              <span className="text-[10px] leading-tight text-gray-600 break-all line-clamp-2">
                {name}
              </span>
            </button>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">No icons match your search.</p>
      )}
    </div>
  );
}
