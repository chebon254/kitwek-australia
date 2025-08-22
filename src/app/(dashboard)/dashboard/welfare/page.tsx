"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  CreditCard,
  Heart,
  Plus,
  History
} from "lucide-react";
import { checkMembershipAndRedirect } from "@/utils/membershipCheck";
import { Skeleton } from "@/components/ui/skeleton";

interface WelfareStatus {
  isRegistered: boolean;
  paymentStatus: string;
  registrationDate?: string;
  status: string;
  canApply: boolean;
  applications: WelfareApplication[];
  reimbursements: WelfareReimbursement[];
}

interface WelfareApplication {
  id: string;
  applicationType: string;
  deceasedName: string;
  status: string;
  claimAmount: number;
  createdAt: string;
  approvedAt?: string;
  payoutDate?: string;
}

interface WelfareReimbursement {
  id: string;
  amountDue: number;
  amountPaid: number;
  dueDate: string;
  status: string;
  applicationId: string;
}

interface FundStats {
  totalMembers: number;
  activeMembers: number;
  totalAmount: number;
  isOperational: boolean;
  waitingPeriodEnd?: string;
}

export default function WelfareDashboard() {
  const router = useRouter();
  const [welfareStatus, setWelfareStatus] = useState<WelfareStatus | null>(null);
  const [fundStats, setFundStats] = useState<FundStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWelfareData = async () => {
      const canAccess = await checkMembershipAndRedirect(router);
      if (!canAccess) return;

      try {
        const [statusResponse, statsResponse] = await Promise.all([
          fetch('/api/welfare/status'),
          fetch('/api/welfare/stats')
        ]);

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setWelfareStatus(statusData);
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setFundStats(statsData);
        }
      } catch (error) {
        console.error('Error fetching welfare data:', error);
        setError('Failed to load welfare information');
      } finally {
        setLoading(false);
      }
    };

    fetchWelfareData();
  }, [router]);

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      PAID: "bg-green-100 text-green-800 border-green-200", 
      ACTIVE: "bg-green-100 text-green-800 border-green-200",
      SUSPENDED: "bg-red-100 text-red-800 border-red-200",
      APPROVED: "bg-blue-100 text-blue-800 border-blue-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200"
    };
    
    return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (loading) {
    return (
      <main className="flex-1 mt-24">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-lg" />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-48 rounded-lg" />
                <Skeleton className="h-64 rounded-lg" />
                <Skeleton className="h-56 rounded-lg" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-48 rounded-lg" />
                <Skeleton className="h-32 rounded-lg" />
                <Skeleton className="h-40 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 mt-24">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
              <p className="mt-1 text-sm text-gray-500">{error}</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 mt-24">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welfare Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Manage your welfare membership and applications
            </p>
          </div>

          {/* Fund Status Overview */}
          {fundStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Members</p>
                    <p className="text-2xl font-semibold text-gray-900">{fundStats.totalMembers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Members</p>
                    <p className="text-2xl font-semibold text-gray-900">{fundStats.activeMembers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Fund Balance</p>
                    <p className="text-2xl font-semibold text-gray-900">AUD ${fundStats.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {fundStats.isOperational ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : (
                      <Clock className="h-8 w-8 text-orange-600" />
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {fundStats.isOperational ? "Operational" : "Pending"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Status & Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Registration Status */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Your Welfare Status
                  </h3>
                </div>
                <div className="px-6 py-5">
                  {welfareStatus?.isRegistered ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Registration Status</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(welfareStatus.status)}`}>
                          {welfareStatus.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Payment Status</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(welfareStatus.paymentStatus)}`}>
                          {welfareStatus.paymentStatus}
                        </span>
                      </div>
                      
                      {welfareStatus.registrationDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-500">Registered</span>
                          <span className="text-sm text-gray-900">
                            {new Date(welfareStatus.registrationDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {welfareStatus.paymentStatus === 'PAID' && welfareStatus.status === 'ACTIVE' && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                            <span className="text-sm font-medium text-green-800">
                              You are an active welfare member!
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Shield className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Not Registered</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Join the welfare fund to access member benefits
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                </div>
                <div className="px-6 py-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {!welfareStatus?.isRegistered ? (
                      <Link
                        href="/dashboard/welfare/register"
                        className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <CreditCard className="h-5 w-5 mr-2" />
                        Register & Pay AUD $200
                      </Link>
                    ) : welfareStatus.paymentStatus === 'PENDING' ? (
                      <Link
                        href="/dashboard/welfare/register"
                        className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                      >
                        <CreditCard className="h-5 w-5 mr-2" />
                        Complete Payment
                      </Link>
                    ) : null}

                    {welfareStatus?.canApply && (
                      <Link
                        href="/dashboard/welfare/apply"
                        className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Apply for Welfare
                      </Link>
                    )}

                    <Link
                      href="/welfare"
                      className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      View Constitution
                    </Link>

                    {welfareStatus?.applications && welfareStatus.applications.length > 0 && (
                      <Link
                        href="/dashboard/welfare/applications"
                        className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <History className="h-5 w-5 mr-2" />
                        View Applications
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Applications */}
              {welfareStatus?.applications && welfareStatus.applications.length > 0 && (
                <div className="bg-white shadow rounded-lg">
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Recent Applications</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {welfareStatus.applications.slice(0, 3).map((application) => (
                      <div key={application.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {application.deceasedName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {application.applicationType === 'MEMBER_DEATH' ? 'Member Death' : 'Family Death'} • 
                              AUD ${application.claimAmount.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400">
                              Applied {new Date(application.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(application.status)}`}>
                            {application.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Info & Reimbursements */}
            <div className="space-y-6">
              {/* Membership Benefits */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Membership Benefits</h3>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div className="flex items-start space-x-3">
                    <Heart className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Family Loss</p>
                      <p className="text-sm text-gray-500">AUD $5,000 for spouse, child, or parent</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Member Death</p>
                      <p className="text-sm text-gray-500">AUD $8,000 to immediate family</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Reimbursements */}
              {welfareStatus?.reimbursements && welfareStatus.reimbursements.some(r => r.status === 'PENDING') && (
                <div className="bg-white shadow rounded-lg">
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
                      Pending Reimbursements
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {welfareStatus.reimbursements
                      .filter(r => r.status === 'PENDING')
                      .map((reimbursement) => (
                        <div key={reimbursement.id} className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                AUD ${reimbursement.amountDue.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500">
                                Due: {new Date(reimbursement.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-medium border bg-orange-100 text-orange-800 border-orange-200">
                              Due
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Help & Support */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-700 mb-4">
                  Have questions about the welfare fund or need assistance with your application?
                </p>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}