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

export default function StatisticsSection() {
  const [stats, setStats] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await apiFetch("/api/statistics");
      if (!response.ok) throw new Error("Failed to fetch statistics");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </section>
    );
  }

  if (stats.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-4 group-hover:bg-[#00c2c0] transition-colors [&_svg]:text-white [&_i]:text-white">
                  <StatisticIcon icon={stat.icon} className="text-white text-3xl w-10 h-10" />
                </div>
                <h3 className="text-5xl font-bold text-gray-800 mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600 text-sm uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
