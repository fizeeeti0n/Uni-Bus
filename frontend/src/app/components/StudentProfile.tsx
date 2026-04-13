import { useState } from "react";
import { Link } from "react-router";

export function StudentProfile() {
  const [activeTab, setActiveTab] = useState("profile");

  const studentInfo = {
    name: "John Smith",
    studentId: "STU-2026-001234",
    email: "john.smith@university.edu",
    phone: "+880 1234-56791",
    department: "Computer Science",
    year: "3rd Year",
  };

  const favoriteRoutes = [
    { name: "Route A", lastUsed: "Today, 8:30 AM" },
    { name: "Route B", lastUsed: "Yesterday, 5:45 PM" },
  ];

  const tripHistory = [
    { date: "2026-04-11", route: "Route A", bus: "BUS-101", time: "8:30 AM", status: "Completed" },
    { date: "2026-04-10", route: "Route B", bus: "BUS-102", time: "5:45 PM", status: "Completed" },
    { date: "2026-04-10", route: "Route A", bus: "BUS-101", time: "8:15 AM", status: "Completed" },
    { date: "2026-04-09", route: "Route A", bus: "BUS-103", time: "8:30 AM", status: "Completed" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link to="/student" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-700"></div>
          <div className="px-8 pb-8">
            <div className="flex items-end gap-6 -mt-16 mb-6">
              <div className="w-32 h-32 bg-white rounded-2xl border-4 border-white shadow-md flex items-center justify-center">
                <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="pb-4">
                <h2 className="text-2xl font-bold text-slate-900">{studentInfo.name}</h2>
                <p className="text-slate-600">{studentInfo.studentId}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 mb-6">
              <div className="flex gap-6">
                {['profile', 'history', 'settings'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 px-2 border-b-2 font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={studentInfo.email}
                      readOnly
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={studentInfo.phone}
                      readOnly
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                    <input
                      type="text"
                      value={studentInfo.department}
                      readOnly
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Year</label>
                    <input
                      type="text"
                      value={studentInfo.year}
                      readOnly
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Favorite Routes</h3>
                  <div className="space-y-3">
                    {favoriteRoutes.map(route => (
                      <div key={route.name} className="p-4 bg-slate-50 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-900">{route.name}</div>
                          <div className="text-sm text-slate-600">Last used: {route.lastUsed}</div>
                        </div>
                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Trip History</h3>
                <div className="space-y-3">
                  {tripHistory.map((trip, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-slate-900">{trip.route} - {trip.bus}</div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {trip.status}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600">
                        {trip.date} at {trip.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer">
                      <span className="text-slate-900">Bus arrival notifications</span>
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer">
                      <span className="text-slate-900">Route delays</span>
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer">
                      <span className="text-slate-900">Emergency alerts</span>
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Account Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-left">
                      Change Password
                    </button>
                    <button className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-left">
                      Download My Data
                    </button>
                    <button className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-left">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
