"use client";

export default function DashboardOverview() {
  const stats = [
    {
      title: "Total Testimonials",
      value: "24",
      icon: "fas fa-comment-dots",
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Published Blogs",
      value: "45",
      icon: "fas fa-blog",
      color: "bg-green-500",
      change: "+8%",
    },
    {
      title: "Active Doctors",
      value: "18",
      icon: "fas fa-user-doctor",
      color: "bg-purple-500",
      change: "+3",
    },
    {
      title: "Total Visits",
      value: "12.5K",
      icon: "fas fa-chart-line",
      color: "bg-orange-500",
      change: "+23%",
    },
  ];

  const recentActivity = [
    { action: "New testimonial added", user: "John Doe", time: "2 hours ago" },
    { action: "Blog published", user: "Admin", time: "5 hours ago" },
    { action: "Doctor profile updated", user: "Dr. Smith", time: "1 day ago" },
    { action: "Testimonial edited", user: "Admin", time: "2 days ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                <p className="text-green-600 text-sm mt-2">
                  <i className="fas fa-arrow-up"></i> {stat.change}
                </p>
              </div>
              <div className={`${stat.color} w-14 h-14 rounded-full flex items-center justify-center`}>
                <i className={`${stat.icon} text-white text-2xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">by {activity.user}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <i className="fas fa-plus-circle text-3xl text-blue-600"></i>
              <span className="text-sm font-medium text-gray-700">Add Blog</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <i className="fas fa-user-plus text-3xl text-secondary"></i>
              <span className="text-sm font-medium text-gray-700">Add Doctor</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <i className="fas fa-comment-medical text-3xl text-purple-600"></i>
              <span className="text-sm font-medium text-gray-700">Add Testimonial</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <i className="fas fa-chart-pie text-3xl text-orange-600"></i>
              <span className="text-sm font-medium text-gray-700">View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
