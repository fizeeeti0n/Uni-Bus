import { useState } from "react";
import { SOSModal } from "./SOSModal";
import { ReportDelayModal } from "./ReportDelayModal";

export function DriverInterface() {
  const [tripActive, setTripActive] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [showReportDelayModal, setShowReportDelayModal] = useState(false);

  const driverInfo = {
    name: "Driver #101",
    busNumber: "BUS-101",
    route: "Route A",
    nextStop: "Academic Building"
  };

  const routeStops = [
    { name: "Main Gate", status: "completed", eta: "Departed" },
    { name: "Academic Building", status: "current", eta: "2 min" },
    { name: "Student Center", status: "upcoming", eta: "8 min" },
    { name: "Dormitory", status: "upcoming", eta: "15 min" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Driver Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{driverInfo.name}</h1>
              <p className="text-sm sm:text-base text-slate-600">{driverInfo.busNumber}</p>
            </div>
            <div className={`px-4 py-2 rounded-full font-semibold ${
              tripActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
            }`}>
              {tripActive ? 'Active' : 'Idle'}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div>
              <div className="text-sm text-slate-600">Route</div>
              <div className="font-semibold text-slate-900">{driverInfo.route}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Next Stop</div>
              <div className="font-semibold text-slate-900">{driverInfo.nextStop}</div>
            </div>
          </div>
        </div>

        {/* Trip Controls */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="font-semibold text-slate-900 mb-4">Trip Controls</h2>

          {tripActive ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-green-900">GPS Transmitting</span>
                </div>
                <div className="text-sm text-green-700">
                  Location updated every 5 seconds
                </div>
              </div>

              {/* <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600">Current Speed</span>
                  <span className="text-2xl font-bold text-slate-900">{speed} km/h</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSpeed(Math.max(0, speed - 10))}
                    className="flex-1 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setSpeed(Math.min(80, speed + 10))}
                    className="flex-1 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    +
                  </button>
                </div>
              </div> */}

              <button
                onClick={() => setTripActive(false)}
                className="w-full py-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                End Trip
              </button>
            </div>
          ) : (
            <button
              onClick={() => setTripActive(true)}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Trip
            </button>
          )}
        </div>

        {/* Route Progress */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="font-semibold text-slate-900 mb-4">Route Progress</h2>
          <div className="space-y-4">
            {routeStops.map((stop, index) => (
              <div key={stop.name} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    stop.status === 'completed' ? 'bg-green-500' :
                    stop.status === 'current' ? 'bg-blue-600 ring-4 ring-blue-100' :
                    'bg-slate-200'
                  }`}>
                    {stop.status === 'completed' && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {stop.status === 'current' && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  {index < routeStops.length - 1 && (
                    <div className={`w-0.5 h-12 ${
                      stop.status === 'completed' ? 'bg-green-500' : 'bg-slate-200'
                    }`}></div>
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <div className="font-semibold text-slate-900">{stop.name}</div>
                  <div className="text-sm text-slate-600">{stop.eta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowReportDelayModal(true)}
              className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl hover:bg-yellow-100 transition-colors"
            >
              <svg className="w-6 h-6 text-yellow-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium text-slate-900 text-sm">Report Delay</div>
            </button>

            <button
              onClick={() => setShowSOSModal(true)}
              className="p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
            >
              <svg className="w-6 h-6 text-red-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="font-medium text-slate-900 text-sm">Emergency SOS</div>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SOSModal
        isOpen={showSOSModal}
        onClose={() => setShowSOSModal(false)}
        userType="driver"
      />
      <ReportDelayModal
        isOpen={showReportDelayModal}
        onClose={() => setShowReportDelayModal(false)}
      />
    </div>
  );
}
