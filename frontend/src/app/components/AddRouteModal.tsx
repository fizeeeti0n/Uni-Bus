import { useState } from "react";

interface AddRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (route: any) => void;
}

export function AddRouteModal({ isOpen, onClose, onAdd }: AddRouteModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    stops: "",
    avgTime: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stopCount = formData.stops.split(',').filter(s => s.trim()).length;
    onAdd({
      name: formData.name,
      buses: 0,
      stops: stopCount,
      avgTime: formData.avgTime,
      status: "On Time",
    });
    setFormData({
      name: "",
      stops: "",
      avgTime: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Create New Route</h2>
          <p className="text-sm sm:text-base text-slate-600 mt-1">Define a new bus route</p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Route Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Route D"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label htmlFor="stops" className="block text-sm font-medium text-slate-700 mb-2">
              Bus Stops
            </label>
            <textarea
              id="stops"
              placeholder="Enter stops separated by commas (e.g., Main Gate, Library, Cafeteria)"
              value={formData.stops}
              onChange={(e) => setFormData({ ...formData, stops: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
            />
            <p className="text-xs text-slate-500 mt-1">Separate each stop with a comma</p>
          </div>

          <div>
            <label htmlFor="avgTime" className="block text-sm font-medium text-slate-700 mb-2">
              Average Trip Time
            </label>
            <input
              id="avgTime"
              type="text"
              placeholder="45 min"
              value={formData.avgTime}
              onChange={(e) => setFormData({ ...formData, avgTime: e.target.value })}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Route Configuration</p>
                <p>After creating the route, you can assign buses and configure schedules in the route management section.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Create Route
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
