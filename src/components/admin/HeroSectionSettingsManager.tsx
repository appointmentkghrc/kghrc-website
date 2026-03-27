"use client";

import HeroSectionManager from "@/components/admin/HeroSectionManager";
import HomeHeroContentManager from "@/components/admin/HomeHeroContentManager";

export default function HeroSectionSettingsManager() {
  return (
    <div className="space-y-10">
      <HeroSectionManager />
      <HomeHeroContentManager />
    </div>
  );
}

