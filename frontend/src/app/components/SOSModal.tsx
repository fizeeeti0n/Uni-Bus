import { useState } from "react";

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: "student" | "driver";
}

export function SOSModal({ isOpen, onClose, userType }: SOSModalProps) {
  const [step, setStep] = useState<"confirm" | "sending" | "sent">("confirm");
  const [selectedIssue, setSelectedIssue] = useState<string>("");

  const issues = [
    { id: "accident", label: "Accident", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
    { id: "medical", label: "Medical Emergency", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
    { id: "breakdown", label: "Bus Breakdown", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
    { id: "harassment", label: "Harassment", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
    { id: "other", label: "Other Emergency", icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

  const handleSendSOS = () => {
    setStep("sending");

    // Simulate sending SOS
    setTimeout(() => {
      setStep("sent");

      // Auto-close after 3 seconds
      setTimeout(() => {
        handleClose();
      }, 3000);
    }, 2000);
  };

  const handleClose = () => {
    setStep("confirm");
    setSelectedIssue("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] overflow-y-auto">
        {step === "confirm" && (
          <>
            <div className="bg-red-600 p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Emergency SOS</h2>
              <p className="text-sm sm:text-base text-red-100">This will alert emergency services and administrators</p>
            </div>

            <div className="p-4 sm:p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Select Emergency Type</h3>
              <div className="space-y-2 mb-6">
                {issues.map((issue) => (
                  <button
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                      selectedIssue === issue.id
                        ? 'border-red-600 bg-red-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <svg className={`w-6 h-6 ${selectedIssue === issue.id ? 'text-red-600' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={issue.icon} />
                    </svg>
                    <span className={`font-medium ${selectedIssue === issue.id ? 'text-red-900' : 'text-slate-900'}`}>
                      {issue.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Your location will be shared</p>
                    <p>Emergency services will receive your GPS coordinates and contact information.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendSOS}
                  disabled={!selectedIssue}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  Send SOS Alert
                </button>
              </div>
            </div>
          </>
        )}

        {step === "sending" && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Sending Emergency Alert...</h3>
            <p className="text-slate-600">Contacting emergency services</p>
          </div>
        )}

        {step === "sent" && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Alert Sent Successfully!</h3>
            <p className="text-slate-600 mb-4">Emergency services have been notified and are on their way.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-900">
                <strong>Help is coming!</strong><br />
                Stay at your current location. Emergency contact: <span className="font-mono">+1 (555) 911-0000</span>
              </p>
            </div>
            <button
              onClick={handleClose}
              className="px-6 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
