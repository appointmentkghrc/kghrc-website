"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import DashboardOverview from "@/components/admin/DashboardOverview";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import BlogsManager from "@/components/admin/BlogsManager";
import DoctorsManager from "@/components/admin/DoctorsManager";
import StatsManager from "@/components/admin/StatsManager";
import ContactSettingsManager from "@/components/admin/ContactSettingsManager";
import DiagnosticServicesManager from "@/components/admin/DiagnosticServicesManager";
import HeroSectionSettingsManager from "@/components/admin/HeroSectionSettingsManager";
import LatestGalleryManager from "@/components/admin/LatestGalleryManager";
import SocialLinksManager from "@/components/admin/SocialLinksManager";
import AboutUsManager from "@/components/admin/AboutUsManager";
import TpaInsurancePartnersManager from "@/components/admin/TpaInsurancePartnersManager";
import PmjayPatientsTreatedManager from "@/components/admin/PmjayPatientsTreatedManager";
import ServicesHighlightManager from "@/components/admin/ServicesHighlightManager";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const tabTitles: Record<string, string> = {
    overview: "Overview",
    aboutUs: "About Us",
    diagnosticServices: "Diagnostic Services",
    heroSectionImage: "Hero Section",
    latestGallery: "Latest Gallery",
    testimonials: "Testimonials",
    blogs: "Blogs",
    doctors: "Doctors",
    stats: "Statistics",
    contactSettings: "Contact Settings",
    socialLinks: "Social Links",
    tpaInsurancePartners: "TPA / Insurance Partners",
    pmjayPatientsTreated: "PMJAY Section",
    servicesHighlight: "Services highlight",
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />;
      case "testimonials":
        return <TestimonialsManager />;
      case "diagnosticServices":
        return <DiagnosticServicesManager />;
      case "aboutUs":
        return <AboutUsManager />;
      case "heroSectionImage":
        return <HeroSectionSettingsManager />;
      case "latestGallery":
        return <LatestGalleryManager />;
      case "blogs":
        return <BlogsManager />;
      case "doctors":
        return <DoctorsManager />;
      case "stats":
        return <StatsManager />;
      case "contactSettings":
        return <ContactSettingsManager />;
      case "socialLinks":
        return <SocialLinksManager />;
      case "tpaInsurancePartners":
        return <TpaInsurancePartnersManager />;
      case "pmjayPatientsTreated":
        return <PmjayPatientsTreatedManager />;
      case "servicesHighlight":
        return <ServicesHighlightManager />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">
            {tabTitles[activeTab] ?? "Admin"}
          </h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
              <span className="font-medium text-gray-700">Admin</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
