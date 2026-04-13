import { Link } from "react-router";

export function AdminAnalytics() {
  const weeklyData = [
    { day: "Mon", trips: 145, passengers: 2340 },
    { day: "Tue", trips: 152, passengers: 2456 },
    { day: "Wed", trips: 148, passengers: 2398 },
    { day: "Thu", trips: 156, passengers: 2512 },
    { day: "Fri", trips: 162, passengers: 2634 },
    { day: "Sat", trips: 98, passengers: 1567 },
    { day: "Sun", trips: 76, passengers: 1234 },
  ];

  const maxPassengers = Math.max(...weeklyData.map(d => d.passengers));

  const routePerformance = [
    { route: "Route A", onTime: 92, delayed: 8, avgDelay: "3 min", satisfaction: 4.5 },
    { route: "Route B", onTime: 85, delayed: 15, avgDelay: "7 min", satisfaction: 4.1 },
    { route: "Route C", onTime: 88, delayed: 12, avgDelay: "5 min", satisfaction: 4.3 },
  ];

  const topDrivers = [
    { name: "Driver #101", trips: 245, rating: 4.8, onTime: 95 },
    { name: "Driver #102", trips: 238, rating: 4.7, onTime: 93 },
    { name: "Driver #103", trips: 232, rating: 4.6, onTime: 91 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link to="/admin" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Analytics & Reports</h1>
          <p className="text-sm sm:text-base text-slate-600">Performance metrics and insights</p>
        </div>

        {/* Weekly Performance Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-6">Weekly Performance</h2>
          <div className="flex items-end justify-between h-64 gap-4">
            {weeklyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col gap-1">
                  <div className="relative w-full bg-slate-100 rounded-t-lg overflow-hidden" style={{ height: '180px' }}>
                    <div
                      className="absolute bottom-0 w-full bg-blue-600 rounded-t-lg transition-all hover:bg-blue-700"
                      style={{ height: `${(data.passengers / maxPassengers) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-semibold text-slate-900 whitespace-nowrap">
                        {data.passengers}
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-slate-900">{data.day}</div>
                    <div className="text-xs text-slate-600">{data.trips} trips</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Route Performance */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Route Performance</h2>
            <div className="space-y-4">
              {routePerformance.map((route, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold text-slate-900">{route.route}</div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-slate-900">{route.satisfaction}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <div className="text-slate-600">On Time</div>
                      <div className="font-semibold text-green-600">{route.onTime}%</div>
                    </div>
                    <div>
                      <div className="text-slate-600">Delayed</div>
                      <div className="font-semibold text-yellow-600">{route.delayed}%</div>
                    </div>
                    <div>
                      <div className="text-slate-600">Avg Delay</div>
                      <div className="font-semibold text-slate-900">{route.avgDelay}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Drivers */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Top Performing Drivers</h2>
            <div className="space-y-4">
              {topDrivers.map((driver, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 mb-1">{driver.name}</div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-slate-600">{driver.trips} trips</div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-medium text-slate-900">{driver.rating}</span>
                      </div>
                      <div className="text-green-600 font-medium">{driver.onTime}% on-time</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-sm text-slate-600">Avg Occupancy</div>
            </div>
            <div className="text-3xl font-bold text-slate-900">68%</div>
            <div className="text-sm text-green-600 mt-1">+5% from last week</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm text-slate-600">On-Time Rate</div>
            </div>
            <div className="text-3xl font-bold text-slate-900">89%</div>
            <div className="text-sm text-green-600 mt-1">+2% from last week</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm text-slate-600">Avg Delay</div>
            </div>
            <div className="text-3xl font-bold text-slate-900">4.2m</div>
            <div className="text-sm text-red-600 mt-1">+0.5m from last week</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="text-sm text-slate-600">Satisfaction</div>
            </div>
            <div className="text-3xl font-bold text-slate-900">4.4</div>
            <div className="text-sm text-green-600 mt-1">+0.2 from last week</div>
          </div>
        </div>
      </div>
    </div>
  );
}
