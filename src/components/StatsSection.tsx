"use client";

import { apiFetch } from "@/lib/apiFetch";
import { useEffect, useState } from "react";
import { StatisticIcon } from "@/lib/statisticIcon";

interface Statistic {
  id: string;
  label: string;
  value: string;
  icon: string;
  category: string;
}

const CATEGORY_ORDER = ["patients", "doctors", "departments", "staff"] as const;

const LABEL_KEYWORDS: Record<(typeof CATEGORY_ORDER)[number], string[]> = {
  patients: ["PATIENT"],
  doctors: ["DOCTOR", "SPECIALIST"],
  departments: ["DEPARTMENT", "EXPERIENCE"],
  staff: ["STAFF", "BED", "SERVANT"],
};

type StatsSectionProps = {
  backgroundImageUrl: string;
};

export default function StatsSection({ backgroundImageUrl }: StatsSectionProps) {
  const [stats, setStats] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await apiFetch("/api/statistics");
        if (!response.ok) throw new Error("Failed to fetch statistics");
        const data: Statistic[] = await response.json();

        // Prefer one stat per expected category, then fall back to label keyword matching.
        const picked: Statistic[] = [];
        const usedIds = new Set<string>();

        for (const category of CATEGORY_ORDER) {
          const byCategory = data.find(
            (stat) => stat.category.toLowerCase() === category
          );
          if (byCategory) {
            picked.push(byCategory);
            usedIds.add(byCategory.id);
            continue;
          }

          const byLabel = data.find((stat) => {
            if (usedIds.has(stat.id)) return false;
            const upperLabel = stat.label.toUpperCase();
            return LABEL_KEYWORDS[category].some((keyword) =>
              upperLabel.includes(keyword)
            );
          });

          if (byLabel) {
            picked.push(byLabel);
            usedIds.add(byLabel.id);
          }
        }

        setStats(picked);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="relative py-32 bg-gray-100">
        <div className="relative max-w-7xl mx-auto px-6 flex min-h-[200px] items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </section>
    );
  }

  if (stats.length === 0) {
    return null;
  }

  return (
    <section
      className="relative py-32 bg-fixed bg-center bg-cover"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
      }}
    >
      <div className="absolute inset-0 bg-white/30" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((item) => (
            <div
              key={item.id}
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-10 text-center hover:scale-105 transition-transform"
            >
              <div className="flex justify-center mb-4">
                <StatisticIcon icon={item.icon} className="text-secondary w-10 h-10" />
              </div>
              <h2 className="text-4xl font-bold">{item.value}</h2>
              <p className="text-gray-500 mt-2 text-sm tracking-wide">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

