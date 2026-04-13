import { useState } from "react";

interface AddBusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (bus: any) => void;
}

export function AddBusModal({ isOpen, onClose, onAdd }: AddBusModalProps) {
  const [formData, setFormData] = useState({
    busId: "",
    driverId: "",
    route: "",
    capacity: "40",
    status: "idle",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: formData.busId,
      driver: formData.driverId,
      route: formData.route,
      status: formData.status,
      passengers: 0,
      capacity: parseInt(formData.capacity),
    });
    setFormData({
      busId: "",
      driverId: "",
      route: "",
      capacity: "40",
      status: "idle",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Add New Bus</h2>
          <p className="text-sm sm:text-base text-slate-600 mt-1">Enter bus details to add to the fleet</p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label htmlFor="busId" className="block text-sm font-medium text-slate-700 mb-2">
              Bus ID
            </label>
            <input
              id="busId"
              type="text"
              placeholder="BUS-105"
              value={formData.busId}
              onChange={(e) => setFormData({ ...formData, busId: e.target.value })}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label htmlFor="driverId" className="block text-sm font-medium text-slate-700 mb-2">
              Assigned Driver
            </label>
            <select
              id="driverId"
              value={formData.driverId}
              onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
            >
              <option value="">Select Driver</option>
              <option value="Driver #101">Driver #101</option>
              <option value="Driver #102">Driver #102</option>
              <option value="Driver #103">Driver #103</option>
              <option value="Driver #104">Driver #104</option>
              <option value="Driver #105">Driver #105</option>
            </select>
          </div>

          <div>
            <label htmlFor="route" className="block text-sm font-medium text-slate-700 mb-2">
              Route Assignment
            </label>
            <select
              id="route"
              value={formData.route}
              onChange={(e) => setFormData({ ...formData, route: e.target.value })}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
            >
              <option value="">Select Route</option>
              <option value="Route A">Route A</option>
              <option value="Route B">Route B</option>
              <option value="Route C">Route C</option>
            </select>
          </div>

          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-slate-700 mb-2">
              Passenger Capacity
            </label>
            <input
              id="capacity"
              type="number"
              placeholder="40"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              required
              min="1"
              max="100"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
              Initial Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
            >
              <option value="idle">Idle</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
            </select>
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
              Add Bus
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
