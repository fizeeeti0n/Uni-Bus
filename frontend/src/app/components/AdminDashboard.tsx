import { useState } from "react";
import { Link } from "react-router";
import { AddBusModal } from "./AddBusModal";
import { AddRouteModal } from "./AddRouteModal";
import { AddDriverModal } from "./AddDriverModal";
import { Toast } from "./Toast";

interface SOSAlert {
  id: string;
  type: "Accident" | "Medical Emergency" | "Bus Breakdown" | "Harassment" | "Other";
  user: string;
  userType: "Student" | "Driver";
  timestamp: string;
  location: string;
  status: "active" | "resolved";
  description?: string;
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddBusModal, setShowAddBusModal] = useState(false);
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([
    {
      id: "SOS-001",
      type: "Medical Emergency",
      user: "Sarah Johnson",
      userType: "Student",
      timestamp: "2026-04-12T09:15:00",
      location: "BUS-101, Route A - Main St & 5th Ave",
      status: "active",
      description: "Student feeling dizzy and experiencing chest pain"
    },
    {
      id: "SOS-002",
      type: "Bus Breakdown",
      user: "Driver #102",
      userType: "Driver",
      timestamp: "2026-04-12T08:45:00",
      location: "BUS-102, Route B - University Blvd",
      status: "active",
      description: "Engine overheating, passengers waiting"
    },
    {
      id: "SOS-003",
      type: "Accident",
      user: "Michael Chen",
      userType: "Student",
      timestamp: "2026-04-11T16:30:00",
      location: "BUS-104, Route C - Campus North Gate",
      status: "resolved",
      description: "Minor collision with parked vehicle, no injuries"
    },
  ]);

  const activeAlerts = sosAlerts.filter(alert => alert.status === "active");

  const stats = [
    { label: "Active Buses", value: "42", change: "+2", trend: "up" },
    { label: "Total Trips Today", value: "156", change: "+12", trend: "up" },
    { label: "Active Students", value: "1,234", change: "+45", trend: "up" },
    { label: "Emergency Alerts", value: activeAlerts.length.toString(), change: activeAlerts.length > 0 ? `+${activeAlerts.length}` : "0", trend: activeAlerts.length > 0 ? "up" : "neutral" },
  ];

  const [buses, setBuses] = useState([
    { id: "BUS-101", driver: "Driver #101", route: "Route A", status: "active", passengers: 28, capacity: 40 },
    { id: "BUS-102", driver: "Driver #102", route: "Route B", status: "active", passengers: 35, capacity: 40 },
    { id: "BUS-103", driver: "Driver #103", route: "Route A", status: "maintenance", passengers: 0, capacity: 40 },
    { id: "BUS-104", driver: "Driver #104", route: "Route C", status: "active", passengers: 18, capacity: 40 },
  ]);

  const [routes, setRoutes] = useState([
    { name: "Route A", buses: 2, stops: 4, avgTime: "35 min", status: "On Time" },
    { name: "Route B", buses: 1, stops: 4, avgTime: "42 min", status: "Delayed" },
    { name: "Route C", buses: 1, stops: 5, avgTime: "48 min", status: "On Time" },
  ]);

  const [drivers, setDrivers] = useState([
    { name: "Driver #101", licenseNumber: "DL-987654321", phone: "+1 (555) 101-0001", assignedBus: "BUS-101", email: "driver101@university.edu", status: "active" },
    { name: "Driver #102", licenseNumber: "DL-987654322", phone: "+1 (555) 102-0002", assignedBus: "BUS-102", email: "driver102@university.edu", status: "active" },
    { name: "Driver #103", licenseNumber: "DL-987654323", phone: "+1 (555) 103-0003", assignedBus: "BUS-103", email: "driver103@university.edu", status: "active" },
  ]);

  const handleAddBus = (newBus: any) => {
    setBuses([...buses, newBus]);
    setToast({ message: `${newBus.id} has been added to the fleet successfully!`, type: "success" });
  };

  const handleAddRoute = (newRoute: any) => {
    setRoutes([...routes, newRoute]);
    setToast({ message: `${newRoute.name} has been created successfully!`, type: "success" });
  };

  const handleAddDriver = (newDriver: any) => {
    setDrivers([...drivers, newDriver]);
    setToast({ message: `${newDriver.name} has been added as a driver!`, type: "success" });
  };

  const handleResolveAlert = (alertId: string) => {
    setSosAlerts(sosAlerts.map(alert =>
      alert.id === alertId ? { ...alert, status: "resolved" as const } : alert
    ));
    setToast({ message: "Alert marked as resolved", type: "success" });
  };

  const getAlertIcon = (type: SOSAlert["type"]) => {
    switch (type) {
      case "Accident":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "Medical Emergency":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case "Bus Breakdown":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case "Harassment":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "Other":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-slate-600">Manage your university bus fleet</p>
          </div>
          <Link
            to="/admin/analytics"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="font-medium">Analytics</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
              <div className="text-xs sm:text-sm text-slate-600 mb-1">{stat.label}</div>
              <div className="flex items-end justify-between">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className={`text-sm font-medium flex items-center gap-1 ${
                  stat.trend === 'up' ? 'text-green-600' :
                  stat.trend === 'down' ? 'text-red-600' :
                  'text-slate-600'
                }`}>
                  {stat.trend === 'up' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  )}
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6">
          <div className="border-b border-slate-200 px-4 sm:px-6 overflow-x-auto">
            <div className="flex gap-4 sm:gap-6 min-w-max">
              {['overview', 'buses', 'routes', 'drivers', 'alerts'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium capitalize transition-colors relative ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'alerts' ? 'SOS Alerts' : tab}
                  {tab === 'alerts' && activeAlerts.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                      {activeAlerts.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Fleet Status</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="text-2xl font-bold text-green-900 mb-1">39</div>
                      <div className="text-sm text-green-700">Active Buses</div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                      <div className="text-2xl font-bold text-yellow-900 mb-1">3</div>
                      <div className="text-sm text-yellow-700">Under Maintenance</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-2xl font-bold text-slate-900 mb-1">8</div>
                      <div className="text-sm text-slate-700">Idle</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { time: "2 min ago", event: "BUS-101 completed Route A", type: "success" },
                      { time: "15 min ago", event: "BUS-102 reported 5 min delay", type: "warning" },
                      { time: "32 min ago", event: "New driver assigned to BUS-105", type: "info" },
                      { time: "1 hour ago", event: "Route B schedule updated", type: "info" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'warning' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="text-sm text-slate-900">{activity.event}</div>
                          <div className="text-xs text-slate-600 mt-1">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "buses" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">Bus Fleet</h3>
                  <button
                    onClick={() => setShowAddBusModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Bus
                  </button>
                </div>
                <div className="space-y-3">
                  {buses.map(bus => (
                    <div key={bus.id} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold text-slate-900">{bus.id}</div>
                          <div className="text-sm text-slate-600">{bus.driver} • {bus.route}</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          bus.status === 'active' ? 'bg-green-100 text-green-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {bus.status}
                        </div>
                      </div>
                      {bus.status === 'active' && (
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(bus.passengers / bus.capacity) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-sm text-slate-600 whitespace-nowrap">
                            {bus.passengers}/{bus.capacity}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "routes" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">Routes</h3>
                  <button
                    onClick={() => setShowAddRouteModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Route
                  </button>
                </div>
                <div className="space-y-3">
                  {routes.map(route => (
                    <div key={route.name} className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold text-slate-900">{route.name}</div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          route.status === 'On Time' ? 'bg-green-100 text-green-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {route.status}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-slate-600">Buses</div>
                          <div className="font-medium text-slate-900">{route.buses}</div>
                        </div>
                        <div>
                          <div className="text-slate-600">Stops</div>
                          <div className="font-medium text-slate-900">{route.stops}</div>
                        </div>
                        <div>
                          <div className="text-slate-600">Avg Time</div>
                          <div className="font-medium text-slate-900">{route.avgTime}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "drivers" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">Drivers</h3>
                  <button
                    onClick={() => setShowAddDriverModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Driver
                  </button>
                </div>
                <div className="space-y-3">
                  {drivers.map((driver, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold text-slate-900">{driver.name}</div>
                          <div className="text-sm text-slate-600">{driver.email}</div>
                        </div>
                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {driver.status}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-slate-600">License</div>
                          <div className="font-medium text-slate-900">{driver.licenseNumber}</div>
                        </div>
                        <div>
                          <div className="text-slate-600">Phone</div>
                          <div className="font-medium text-slate-900">{driver.phone}</div>
                        </div>
                        <div>
                          <div className="text-slate-600">Assigned Bus</div>
                          <div className="font-medium text-slate-900">{driver.assignedBus || 'None'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "alerts" && (
              <div>
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-900">Emergency SOS Alerts</h3>
                  <p className="text-sm text-slate-600 mt-1">Monitor and respond to emergency alerts from students and drivers</p>
                </div>

                {sosAlerts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-slate-600">No emergency alerts</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sosAlerts
                      .sort((a, b) => {
                        if (a.status === "active" && b.status === "resolved") return -1;
                        if (a.status === "resolved" && b.status === "active") return 1;
                        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                      })
                      .map(alert => (
                        <div
                          key={alert.id}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            alert.status === "active"
                              ? "bg-red-50 border-red-200"
                              : "bg-slate-50 border-slate-200 opacity-60"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${
                              alert.status === "active" ? "bg-red-100" : "bg-slate-200"
                            }`}>
                              <div className={alert.status === "active" ? "text-red-600" : "text-slate-600"}>
                                {getAlertIcon(alert.type)}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-slate-900">{alert.type}</h4>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                      alert.status === "active"
                                        ? "bg-red-600 text-white"
                                        : "bg-slate-600 text-white"
                                    }`}>
                                      {alert.status}
                                    </span>
                                  </div>
                                  <div className="text-sm text-slate-600">
                                    {alert.user} ({alert.userType}) • {formatTimestamp(alert.timestamp)}
                                  </div>
                                </div>
                                {alert.status === "active" && (
                                  <button
                                    onClick={() => handleResolveAlert(alert.id)}
                                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors whitespace-nowrap"
                                  >
                                    Mark Resolved
                                  </button>
                                )}
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-start gap-2 text-sm">
                                  <svg className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span className="text-slate-700">{alert.location}</span>
                                </div>
                                {alert.description && (
                                  <div className="flex items-start gap-2 text-sm">
                                    <svg className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="text-slate-700">{alert.description}</span>
                                  </div>
                                )}
                              </div>

                              {alert.status === "active" && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                    Contact {alert.userType}
                                  </button>
                                  <button className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors">
                                    View Location
                                  </button>
                                  <button className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors">
                                    Dispatch Help
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddBusModal
        isOpen={showAddBusModal}
        onClose={() => setShowAddBusModal(false)}
        onAdd={handleAddBus}
      />
      <AddRouteModal
        isOpen={showAddRouteModal}
        onClose={() => setShowAddRouteModal(false)}
        onAdd={handleAddRoute}
      />
      <AddDriverModal
        isOpen={showAddDriverModal}
        onClose={() => setShowAddDriverModal(false)}
        onAdd={handleAddDriver}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
