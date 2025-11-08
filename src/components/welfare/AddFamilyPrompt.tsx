"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Users, AlertCircle } from "lucide-react";

interface AddFamilyPromptProps {
  hasPaidRegistration: boolean;
  hasFamilyMembers: boolean;
}

export default function AddFamilyPrompt({ hasPaidRegistration, hasFamilyMembers }: AddFamilyPromptProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Only show if user has paid registration but no family members
    if (!hasPaidRegistration || hasFamilyMembers || isDismissed) {
      setIsVisible(false);
      return;
    }

    // Check if user dismissed today
    const dismissedDate = localStorage.getItem('familyPromptDismissed');
    if (dismissedDate) {
      const today = new Date().toDateString();
      const dismissed = new Date(dismissedDate).toDateString();
      if (today === dismissed) {
        setIsVisible(false);
        return;
      }
    }

    setIsVisible(true);
  }, [hasPaidRegistration, hasFamilyMembers, isDismissed]);

  const handleDismiss = () => {
    const today = new Date().toISOString();
    localStorage.setItem('familyPromptDismissed', today);
    setIsDismissed(true);
    setIsVisible(false);
  };

  const handleAddFamily = () => {
    router.push('/dashboard/welfare/beneficiaries');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleDismiss} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-full p-3">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="ml-4 text-lg font-medium text-gray-900">
                Action Required
              </h3>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start">
              <Users className="h-12 w-12 text-indigo-600 mr-4 flex-shrink-0" />
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">
                  Add Your Immediate Family Members
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  We've updated our welfare system. Before you can apply for welfare support,
                  please add your immediate family members who will be your beneficiaries.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Why is this needed?</strong> Adding your family members now makes
                    the application process faster when you need it most.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 sm:justify-end rounded-b-lg">
            <button
              onClick={handleDismiss}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Remind Me Later
            </button>
            <button
              onClick={handleAddFamily}
              className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Users className="inline h-4 w-4 mr-2" />
              Add Family Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
