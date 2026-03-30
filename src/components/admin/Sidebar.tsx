"use client";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, isOpen }: SidebarProps) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: "fas fa-chart-line" },
    { id: "aboutUs", label: "About Us", icon: "fas fa-info-circle" },
    { id: "diagnosticServices", label: "Diagnostic Services", icon: "fas fa-microscope" },
    { id: "heroSectionImage", label: "Hero Section", icon: "fas fa-image" },
    { id: "latestGallery", label: "Latest Gallery", icon: "fas fa-images" },
    { id: "testimonials", label: "Testimonials", icon: "fas fa-comment-dots" },
    { id: "blogs", label: "Blogs", icon: "fas fa-blog" },
    { id: "doctors", label: "Doctors", icon: "fas fa-user-doctor" },
    { id: "stats", label: "Statistics", icon: "fas fa-chart-bar" },
    { id: "contactSettings", label: "Contact Settings", icon: "fas fa-address-book" },
    { id: "socialLinks", label: "Social Links", icon: "fas fa-share-nodes" },
    { id: "tpaInsurancePartners", label: "TPA / Insurance Partners", icon: "fas fa-handshake" },
    { id: "pmjayPatientsTreated", label: "PMJAY Section", icon: "fas fa-hospital" },
    { id: "servicesHighlight", label: "Services highlight", icon: "fas fa-layer-group" },
    { id: "servicesPage", label: "Services page", icon: "fas fa-th-large" },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 flex h-full flex-col bg-blue-900 text-white transition-all duration-300 z-50 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex h-16 flex-shrink-0 items-center justify-center border-b border-blue-800">
        {isOpen ? (
          <h2 className="text-2xl font-bold">KGH Admin</h2>
        ) : (
          <i className="fas fa-hospital text-2xl"></i>
        )}
      </div>

      <nav className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pb-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-blue-800 transition-colors ${
              activeTab === item.id ? "bg-blue-800 border-l-4 border-white" : ""
            }`}
          >
            <i className={`${item.icon} text-xl w-6 flex-shrink-0`}></i>
            {isOpen && <span className="font-medium text-left">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="flex-shrink-0 w-full border-t border-blue-800">
        <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-blue-800 transition-colors">
          <i className="fas fa-sign-out-alt text-xl w-6"></i>
          {isOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
