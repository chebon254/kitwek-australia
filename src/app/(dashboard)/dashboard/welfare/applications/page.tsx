"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  Plus,
  Filter,
  Search,
  RefreshCw
} from "lucide-react";
import { checkMembershipAndRedirect } from "@/utils/membershipCheck";

interface WelfareApplication {
  id: string;
  applicationType: string;
  deceasedName: string;
  status: string;
  claimAmount: number;
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  payoutDate?: string;
  reimbursementDue?: string;
}

interface WelfareReimbursement {
  id: string;
  amountDue: number;
  amountPaid: number;
  dueDate: string;
  status: string;
  applicationId: string;
}

export default function WelfareApplications() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  
  const [applications, setApplications] = useState<WelfareApplication[]>([]);
  const [reimbursements, setReimbursements] = useState<WelfareReimbursement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      const canAccess = await checkMembershipAndRedirect(router);
      if (!canAccess) return;

      try {
        const response = await fetch('/api/welfare/applications');
        if (response.ok) {
          const data = await response.json();
          setApplications(data.applications || []);
          setReimbursements(data.reimbursements || []);
        } else {
          setError('Failed to load applications');
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [router]);

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/welfare/applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
        setReimbursements(data.reimbursements || []);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      APPROVED: "bg-blue-100 text-blue-800 border-blue-200",
      PAID: "bg-green-100 text-green-800 border-green-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200",
      PROCESSING: "bg-purple-100 text-purple-800 border-purple-200"
    };
    return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'APPROVED':
      case 'PAID':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getApplicationTypeLabel = (type: string) => {
    return type === 'MEMBER_DEATH' ? 'Member Death' : 'Family Death';
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.deceasedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicationType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getReimbursementForApplication = (applicationId: string) => {
    return reimbursements.find(r => r.applicationId === applicationId);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard/welfare"
              className="mb-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Welfare Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Welfare Applications</h1>
                <p className="mt-2 text-gray-600">
                  View and track your welfare support applications
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={refreshData}
                  disabled={refreshing}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <Link
                  href="/dashboard/welfare/apply"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Application
                </Link>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative">
              <CheckCircle className="h-5 w-5 inline mr-2" />
              Your welfare application has been submitted successfully! You will be notified once it is reviewed.
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
              <AlertCircle className="h-5 w-5 inline mr-2" />
              {error}
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search applications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="ALL">All Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="PAID">Paid</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Showing {filteredApplications.length} of {applications.length} applications
                </div>
              </div>
            </div>
          </div>

          {/* Applications List */}
          {filteredApplications.length === 0 ? (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {applications.length === 0 ? 'No Applications' : 'No Matching Applications'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {applications.length === 0 
                    ? 'You haven\'t submitted any welfare applications yet.'
                    : 'Try adjusting your search or filter criteria.'
                  }
                </p>
                {applications.length === 0 && (
                  <div className="mt-6">
                    <Link
                      href="/dashboard/welfare/apply"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Submit First Application
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => {
                const reimbursement = getReimbursementForApplication(application.id);
                return (
                  <div key={application.id} className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {getStatusIcon(application.status)}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {application.deceasedName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {getApplicationTypeLabel(application.applicationType)}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(application.status)}`}>
                          {application.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Claim Amount</p>
                            <p className="text-sm font-medium text-gray-900">
                              ${application.claimAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Submitted</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(application.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {application.approvedAt && (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <div>
                              <p className="text-xs text-gray-500">Approved</p>
                              <p className="text-sm font-medium text-gray-900">
                                {new Date(application.approvedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        )}

                        {application.payoutDate && (
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-green-400" />
                            <div>
                              <p className="text-xs text-gray-500">Paid Out</p>
                              <p className="text-sm font-medium text-gray-900">
                                {new Date(application.payoutDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Rejection Reason */}
                      {application.status === 'REJECTED' && application.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                          <div className="flex">
                            <XCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-medium text-red-800">Application Rejected</h4>
                              <p className="text-sm text-red-700 mt-1">{application.rejectionReason}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Reimbursement Information */}
                      {reimbursement && (
                        <div className={`border rounded-md p-3 mb-4 ${
                          reimbursement.status === 'PENDING' 
                            ? 'bg-orange-50 border-orange-200' 
                            : 'bg-green-50 border-green-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className={`text-sm font-medium ${
                                reimbursement.status === 'PENDING' ? 'text-orange-800' : 'text-green-800'
                              }`}>
                                Reimbursement {reimbursement.status === 'PENDING' ? 'Due' : 'Completed'}
                              </h4>
                              <p className={`text-sm ${
                                reimbursement.status === 'PENDING' ? 'text-orange-700' : 'text-green-700'
                              }`}>
                                ${reimbursement.amountDue.toFixed(2)} due by{' '}
                                {new Date(reimbursement.dueDate).toLocaleDateString()}
                              </p>
                              {reimbursement.amountPaid > 0 && (
                                <p className="text-xs text-gray-600">
                                  Paid: ${reimbursement.amountPaid.toFixed(2)}
                                </p>
                              )}
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              reimbursement.status === 'PENDING'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {reimbursement.status}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          Application ID: {application.id.slice(0, 8)}...
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/dashboard/welfare/applications/${application.id}`)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </button>
                          {application.status === 'APPROVED' && (
                            <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50">
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Summary Statistics */}
          {applications.length > 0 && (
            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Application Summary</h3>
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {applications.length}
                    </p>
                    <p className="text-sm text-gray-500">Total Applications</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {applications.filter(a => a.status === 'PENDING').length}
                    </p>
                    <p className="text-sm text-gray-500">Pending</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {applications.filter(a => a.status === 'PAID').length}
                    </p>
                    <p className="text-sm text-gray-500">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      ${applications
                        .filter(a => a.status === 'PAID')
                        .reduce((sum, a) => sum + a.claimAmount, 0)
                        .toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">Total Received</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}