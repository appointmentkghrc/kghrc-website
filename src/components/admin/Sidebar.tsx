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
    { id: "testimonials", label: "Testimonials", icon: "fas fa-comment-dots" },
    { id: "blogs", label: "Blogs", icon: "fas fa-blog" },
    { id: "doctors", label: "Doctors", icon: "fas fa-user-doctor" },
    { id: "stats", label: "Statistics", icon: "fas fa-chart-bar" },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-blue-900 text-white transition-all duration-300 z-50 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex items-center justify-center h-16 border-b border-blue-800">
        {isOpen ? (
          <h2 className="text-2xl font-bold">KGH Admin</h2>
        ) : (
          <i className="fas fa-hospital text-2xl"></i>
        )}
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-blue-800 transition-colors ${
              activeTab === item.id ? "bg-blue-800 border-l-4 border-white" : ""
            }`}
          >
            <i className={`${item.icon} text-xl w-6`}></i>
            {isOpen && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full border-t border-blue-800">
        <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-blue-800 transition-colors">
          <i className="fas fa-sign-out-alt text-xl w-6"></i>
          {isOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
