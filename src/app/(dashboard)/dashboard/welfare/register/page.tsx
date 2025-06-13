"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, DollarSign, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { checkMembershipAndRedirect } from "@/utils/membershipCheck";

interface WelfareRegistrationStatus {
  isRegistered: boolean;
  paymentStatus: string;
  registrationDate?: string;
  status: string;
}

export default function WelfareRegister() {
  const router = useRouter();
  const [registrationStatus, setRegistrationStatus] = useState<WelfareRegistrationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      const canAccess = await checkMembershipAndRedirect(router);
      if (!canAccess) return;

      try {
        const response = await fetch('/api/welfare/status');
        if (response.ok) {
          const data = await response.json();
          setRegistrationStatus(data);
        }
      } catch (error) {
        console.error('Error checking registration status:', error);
        setError('Failed to load registration status');
      } finally {
        setLoading(false);
      }
    };

    checkRegistrationStatus();
  }, [router]);

  const handleRegister = async () => {
    if (!agreed) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/welfare/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }

      const data = await response.json();
      
      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleCompletePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/welfare/complete-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Payment completion failed');
      }

      const data = await response.json();
      
      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 mt-24">
        <div className="py-6">
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 mt-24">
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="mb-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Welfare Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Welfare Registration</h1>
            <p className="mt-2 text-gray-600">
              Join the Kitwek Victoria Welfare Department
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
              <AlertCircle className="h-5 w-5 inline mr-2" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Registration Form */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Welfare Membership Registration
                  </h3>
                </div>
                
                <div className="px-6 py-5">
                  {registrationStatus?.isRegistered ? (
                    <div className="space-y-6">
                      {/* Already Registered */}
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <div>
                          <p className="text-lg font-medium text-gray-900">Already Registered</p>
                          <p className="text-sm text-gray-500">
                            You registered on {registrationStatus.registrationDate ? 
                              new Date(registrationStatus.registrationDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Payment Status */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-medium text-gray-700">Payment Status:</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            registrationStatus.paymentStatus === 'PAID' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {registrationStatus.paymentStatus}
                          </span>
                        </div>

                        {registrationStatus.paymentStatus === 'PENDING' && (
                          <div>
                            <p className="text-sm text-gray-600 mb-4">
                              Complete your $200 registration payment to activate your welfare membership.
                            </p>
                            <button
                              onClick={handleCompletePayment}
                              disabled={processing}
                              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                              {processing ? (
                                <>
                                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <DollarSign className="h-5 w-5 mr-2" />
                                  Complete Payment - $200
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {registrationStatus.paymentStatus === 'PAID' && (
                          <div className="text-center">
                            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                            <p className="text-lg font-medium text-green-800">Payment Complete!</p>
                            <p className="text-sm text-gray-600">
                              You are now an active member of the welfare fund.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Registration Information */}
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4">Registration Requirements</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            Be a registered member of Kitwek Victoria Association
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            Pay one-time registration fee of $200
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            Agree to welfare fund constitution and terms
                          </li>
                        </ul>
                      </div>

                      {/* Terms and Conditions */}
                      <div className="border-t pt-6">
                        <h4 className="text-md font-medium text-gray-900 mb-4">Terms & Conditions</h4>
                        <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto text-sm text-gray-700 space-y-2">
                          <p><strong>By registering, you agree to:</strong></p>
                          <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Pay the one-time registration fee of $200</li>
                            <li>Participate in the community reimbursement system after claims</li>
                            <li>Provide accurate information for all applications</li>
                            <li>Report bereavements within 7 days of occurrence</li>
                            <li>Submit required documentation for claim verification</li>
                            <li>Understand that there is a 2-month waiting period after fund launch</li>
                            <li>Accept that fund requires minimum 100 members to become operational</li>
                            <li>Comply with all welfare department constitution provisions</li>
                          </ul>
                          <p className="mt-4">
                            <strong>Benefits:</strong> $5,000 for immediate family member death, 
                            $8,000 for registered member death paid to family.
                          </p>
                        </div>
                      </div>

                      {/* Agreement Checkbox */}
                      <div className="border-t pt-6">
                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">
                            I have read and agree to the terms and conditions of the Kitwek Victoria 
                            Welfare Department. I understand the registration fee, benefits, and 
                            reimbursement obligations.
                          </span>
                        </label>
                      </div>

                      {/* Register Button */}
                      <button
                        onClick={handleRegister}
                        disabled={!agreed || processing}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {processing ? (
                          <>
                            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                            Processing Registration...
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-5 w-5 mr-2" />
                            Register & Pay $200
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Information */}
            <div className="space-y-6">
              {/* Registration Fee Breakdown */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Registration Fee</h3>
                </div>
                <div className="px-6 py-5">
                  <div className="flex items-center justify-between text-2xl font-bold text-gray-900">
                    <span>One-time Fee</span>
                    <span>$200</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    This fee covers your lifetime membership in the welfare fund
                  </p>
                </div>
              </div>

              {/* Benefits Summary */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Member Benefits</h3>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Family Death Support</span>
                    <span className="text-lg font-semibold text-gray-900">$5,000</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Member Death Support</span>
                    <span className="text-lg font-semibold text-gray-900">$8,000</span>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500">
                      Family includes spouse, children, and parents only
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">Important Notes</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Minimum 100 members needed for fund to be operational</li>
                  <li>• 2-month waiting period after fund launch</li>
                  <li>• Report bereavements within 7 days</li>
                  <li>• Community reimbursement after each claim</li>
                </ul>
              </div>

              {/* Support */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-700 mb-4">
                  Have questions about welfare registration or benefits?
                </p>
                <a
                  href="/contact-us"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}