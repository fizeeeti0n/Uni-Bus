import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { SOSModal } from "./SOSModal";
import { useAuth } from "../contexts/AuthContext";

export function StudentDashboard() {
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState("Route A");
  const [showSOSModal, setShowSOSModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleProtectedAction = () => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  };

  const buses = [
    { id: "BUS-101", route: "Route A", status: "active", occupancy: "available", eta: "5 min", lat: 23.8103, lng: 90.4125 },
    { id: "BUS-102", route: "Route B", status: "active", occupancy: "near-full", eta: "12 min", lat: 23.8150, lng: 90.4200 },
    { id: "BUS-103", route: "Route A", status: "active", occupancy: "full", eta: "18 min", lat: 23.8200, lng: 90.4100 },
  ];

  const routes = [
    { name: "Route A", stops: ["Main Gate", "Academic Building", "Student Center", "Dormitory"] },
    { name: "Route B", stops: ["North Gate", "Library", "Sports Complex", "Medical Center"] },
    { name: "Route C", stops: ["East Gate", "Cafeteria", "Admin Building", "Parking Lot"] },
  ];

  const activeBuses = buses.filter(b => b.route === selectedRoute);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Bus Tracking</h1>
            <p className="text-sm sm:text-base text-slate-600">
              {isAuthenticated ? "Track your bus in real-time" : "View bus locations (Login for full access)"}
            </p>
          </div>
          {isAuthenticated && (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/student/notifications"
                className="relative flex items-center justify-center p-2 sm:px-4 sm:py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">2</span>
              </Link>
              <Link
                to="/student/profile"
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline text-slate-700 font-medium">Profile</span>
              </Link>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Map Placeholder */}
              <div className="relative h-[400px] sm:h-[500px] md:h-[600px] bg-slate-100">
                {/* Mock Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-100"></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-30">
                  <div className="h-full w-full" style={{
                    backgroundImage: `linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                  }}></div>
                </div>

                {/* Bus Markers */}
                {activeBuses.map((bus, index) => (
                  <button
                    key={bus.id}
                    onClick={() => setSelectedBus(bus.id)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 ${
                      selectedBus === bus.id ? 'scale-125 z-20' : 'z-10'
                    }`}
                    style={{
                      left: `${40 + index * 20}%`,
                      top: `${35 + index * 15}%`
                    }}
                  >
                    <div className={`relative ${selectedBus === bus.id ? 'animate-pulse' : ''}`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                        bus.occupancy === 'available' ? 'bg-green-500' :
                        bus.occupancy === 'near-full' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}>
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
                        </svg>
                      </div>
                      {selectedBus === bus.id && (
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl p-3 w-48 border border-slate-200">
                          <div className="font-semibold text-slate-900">{bus.id}</div>
                          <div className="text-sm text-slate-600 mt-1">ETA: {bus.eta}</div>
                          <div className="text-xs text-slate-500 mt-1 capitalize">{bus.occupancy.replace('-', ' ')}</div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}

                {/* Stop Markers */}
                {routes.find(r => r.name === selectedRoute)?.stops.map((stop, index) => (
                  <div
                    key={stop}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${25 + index * 20}%`,
                      top: `${60 + index * 5}%`
                    }}
                  >
                    <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
                    <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 text-xs font-medium text-slate-700 whitespace-nowrap bg-white px-2 py-1 rounded shadow-sm">
                      {stop}
                    </div>
                  </div>
                ))}

                {/* Map Controls */}
                <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md">
                  <button className="p-3 border-b border-slate-200 hover:bg-slate-50">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  <button className="p-3 hover:bg-slate-50">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                </div>

                {/* Location Button */}
                <button className="absolute bottom-4 right-4 p-3 bg-white rounded-lg shadow-md hover:bg-slate-50">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>

              {/* Legend */}
              <div className="p-4 bg-slate-50 border-t border-slate-200">
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-slate-600">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-slate-600">Near Full</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-slate-600">Full</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
            {/* Route Selector */}
            <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 relative ${!isAuthenticated ? 'opacity-60' : ''}`}>
              {!isAuthenticated && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                  <button
                    onClick={handleProtectedAction}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    Login to Select Route
                  </button>
                </div>
              )}
              <h3 className="font-semibold text-slate-900 mb-4">Select Route</h3>
              <div className="space-y-2">
                {routes.map(route => (
                  <button
                    key={route.name}
                    onClick={() => isAuthenticated && setSelectedRoute(route.name)}
                    disabled={!isAuthenticated}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedRoute === route.name
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    } ${!isAuthenticated ? 'cursor-not-allowed' : ''}`}
                  >
                    <div className="font-medium">{route.name}</div>
                    <div className={`text-sm mt-1 ${
                      selectedRoute === route.name ? 'text-blue-100' : 'text-slate-500'
                    }`}>
                      {route.stops.length} stops
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Buses */}
            <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 relative ${!isAuthenticated ? 'opacity-60' : ''}`}>
              {!isAuthenticated && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                  <button
                    onClick={handleProtectedAction}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    Login to View Buses
                  </button>
                </div>
              )}
              <h3 className="font-semibold text-slate-900 mb-4">Active Buses</h3>
              <div className="space-y-3">
                {activeBuses.map(bus => (
                  <div
                    key={bus.id}
                    className={`p-4 rounded-lg border-2 transition-all ${isAuthenticated ? 'cursor-pointer' : 'cursor-not-allowed'} ${
                      selectedBus === bus.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => isAuthenticated && setSelectedBus(bus.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-900">{bus.id}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        bus.occupancy === 'available' ? 'bg-green-100 text-green-700' :
                        bus.occupancy === 'near-full' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {bus.occupancy.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600">ETA: {bus.eta}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency SOS */}
            <button
              onClick={() => isAuthenticated ? setShowSOSModal(true) : handleProtectedAction()}
              className="w-full bg-red-600 text-white rounded-2xl p-4 sm:p-6 hover:bg-red-700 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-semibold text-base sm:text-lg">Emergency SOS</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* SOS Modal */}
      <SOSModal
        isOpen={showSOSModal}
        onClose={() => setShowSOSModal(false)}
        userType="student"
      />
    </div>
  );
}
