"use client";

import { useEffect, useState } from "react";
import { Users, Stethoscope, Building2, UserCheck } from "lucide-react";

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

function getIconForLabel(label: string) {
  const upper = label.toUpperCase();

  if (upper.includes("PATIENT")) {
    return <Users className="text-secondary w-10 h-10" />;
  }
  if (upper.includes("DOCTOR")) {
    return <Stethoscope className="text-secondary w-10 h-10" />;
  }
  if (upper.includes("DEPARTMENT")) {
    return <Building2 className="text-secondary w-10 h-10" />;
  }
  if (upper.includes("SERVANT")) {
    return <UserCheck className="text-secondary w-10 h-10" />;
  }

  return <Users className="text-secondary w-10 h-10" />;
}

export default function StatsSection() {
  const [stats, setStats] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/statistics");
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

  if (loading || stats.length === 0) {
    return null;
  }

  return (
    <section
      className="relative py-32 bg-fixed bg-center bg-cover"
      style={{
        backgroundImage: "url('/7.jpg')",
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
                {getIconForLabel(item.label)}
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

