"use client";

import { useRouter } from "next/navigation";
import { X, Lock, LogIn, UserPlus } from "lucide-react";
import { useEffect } from "react";

interface MembersOnlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle?: string;
}

export default function MembersOnlyModal({
  isOpen,
  onClose,
  eventTitle,
}: MembersOnlyModalProps) {
  const router = useRouter();

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogin = () => {
    router.push("/sign-in");
  };

  const handleSignup = () => {
    router.push("/sign-up");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-100 rounded-full p-3">
              <Lock className="h-8 w-8 text-indigo-600" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Members Only Event
          </h2>

          {/* Description */}
          <p className="text-center text-gray-600 mb-6">
            {eventTitle ? (
              <>
                <span className="font-semibold">{eventTitle}</span> is a
                members-only event. Please log in to your account or join to
                access this event.
              </>
            ) : (
              "This is a members-only event. Please log in to your account or join to access this event."
            )}
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleLogin}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <LogIn className="h-5 w-5" />
              Login to Your Account
            </button>

            <button
              onClick={handleSignup}
              className="w-full bg-white border-2 border-indigo-600 text-indigo-600 py-3 px-4 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <UserPlus className="h-5 w-5" />
              Join as a Member
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already a member?{" "}
            <button
              onClick={handleLogin}
              className="text-indigo-600 hover:text-indigo-700 font-medium underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
