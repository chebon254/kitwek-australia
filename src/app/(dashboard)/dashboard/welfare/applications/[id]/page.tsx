"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  DollarSign,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  Phone,
  Mail,
  IdCard,
  Heart,
  MessageSquare,
  CreditCard,
  History
} from "lucide-react";
import { checkMembershipAndRedirect } from "@/utils/membershipCheck";

interface Beneficiary {
  id: string;
  fullName: string;
  relationship: string;
  phone: string;
  email?: string;
  idNumber?: string;
}

interface Document {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}

interface Reimbursement {
  id: string;
  amountDue: number;
  amountPaid: number;
  dueDate: string;
  status: string;
  paidAt?: string;
  createdAt: string;
}

interface WelfareApplicationDetail {
  id: string;
  applicationType: string;
  deceasedName: string;
  relationToDeceased?: string;
  reasonForApplication: string;
  status: string;
  claimAmount: number;
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  payoutDate?: string;
  reimbursementDue?: string;
  beneficiaries: Beneficiary[];
  documents: Document[];
  reimbursements: Reimbursement[];
}

export default function ApplicationDetail() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;
  
  const [application, setApplication] = useState<WelfareApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplicationDetail = async () => {
      const canAccess = await checkMembershipAndRedirect(router);
      if (!canAccess) return;

      try {
        const response = await fetch(`/api/welfare/applications/${applicationId}`);
        if (response.ok) {
          const data = await response.json();
          setApplication(data);
        } else if (response.status === 404) {
          setError('Application not found');
        } else {
          setError('Failed to load application details');
        }
      } catch (error) {
        console.error('Error fetching application detail:', error);
        setError('Failed to load application details');
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      fetchApplicationDetail();
    }
  }, [router, applicationId]);

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
        return <Clock className="h-5 w-5" />;
      case 'APPROVED':
      case 'PAID':
        return <CheckCircle className="h-5 w-5" />;
      case 'REJECTED':
        return <XCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getApplicationTypeLabel = (type: string) => {
    return type === 'MEMBER_DEATH' ? 'Member Death' : 'Family Death';
  };

  const downloadDocument = (doc: Document) => {
    window.open(doc.fileUrl, '_blank');
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

  if (error || !application) {
    return (
      <main className="flex-1 mt-24">
        <div className="py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
              href="/dashboard/welfare/applications"
              className="mb-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Applications
            </Link>
            
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Application Not Found</h3>
                <p className="text-gray-600">{error}</p>
              </div>
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
            <Link
              href="/dashboard/welfare/applications"
              className="mb-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Applications
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
                <p className="mt-2 text-gray-600">
                  Welfare application for {application.deceasedName}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {getStatusIcon(application.status)}
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadge(application.status)}`}>
                  {application.status}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Application Information */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Application Information
                  </h3>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Application Type</label>
                      <p className="mt-1 text-sm text-gray-900">{getApplicationTypeLabel(application.applicationType)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Deceased Person&apos;s Name</label>
                      <p className="mt-1 text-sm text-gray-900">{application.deceasedName}</p>
                    </div>
                    {application.relationToDeceased && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Your Relationship</label>
                        <p className="mt-1 text-sm text-gray-900 capitalize">{application.relationToDeceased}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Claim Amount</label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">${application.claimAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Application</label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{application.reasonForApplication}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Beneficiaries */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Beneficiaries ({application.beneficiaries.length})
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {application.beneficiaries.map((beneficiary, index) => (
                    <div key={beneficiary.id} className="px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-md font-medium text-gray-900 mb-2">
                            {beneficiary.fullName}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Heart className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">Relationship:</span>
                              <span className="text-gray-900">{beneficiary.relationship}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">Phone:</span>
                              <span className="text-gray-900">{beneficiary.phone}</span>
                            </div>
                            {beneficiary.email && (
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">Email:</span>
                                <span className="text-gray-900">{beneficiary.email}</span>
                              </div>
                            )}
                            {beneficiary.idNumber && (
                              <div className="flex items-center space-x-2">
                                <IdCard className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">ID:</span>
                                <span className="text-gray-900">{beneficiary.idNumber}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="ml-4 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          Beneficiary {index + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Supporting Documents ({application.documents.length})
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {application.documents.map((document) => (
                    <div key={document.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <FileText className="h-8 w-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{document.fileName}</p>
                            <p className="text-xs text-gray-500">
                              Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => downloadDocument(document)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => downloadDocument(document)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rejection Reason */}
              {application.status === 'REJECTED' && application.rejectionReason && (
                <div className="bg-white shadow rounded-lg">
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-red-900 flex items-center">
                      <XCircle className="h-5 w-5 mr-2" />
                      Rejection Reason
                    </h3>
                  </div>
                  <div className="px-6 py-5">
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <p className="text-sm text-red-700 whitespace-pre-wrap">{application.rejectionReason}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Timeline */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <History className="h-5 w-5 mr-2" />
                    Application Timeline
                  </h3>
                </div>
                <div className="px-6 py-5">
                  <div className="flow-root">
                    <ul className="-mb-8">
                      <li>
                        <div className="relative pb-8">
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                <FileText className="h-4 w-4 text-white" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-900">Application submitted</p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                {new Date(application.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>

                      {application.approvedAt && (
                        <li>
                          <div className="relative pb-8">
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                                  <CheckCircle className="h-4 w-4 text-white" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-900">Application approved</p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  {new Date(application.approvedAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      )}

                      {application.rejectedAt && (
                        <li>
                          <div className="relative pb-8">
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center ring-8 ring-white">
                                  <XCircle className="h-4 w-4 text-white" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-900">Application rejected</p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  {new Date(application.rejectedAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      )}

                      {application.payoutDate && (
                        <li>
                          <div className="relative">
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                                  <DollarSign className="h-4 w-4 text-white" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-900">Payment completed</p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  {new Date(application.payoutDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Reimbursements */}
              {application.reimbursements.length > 0 && (
                <div className="bg-white shadow rounded-lg">
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Reimbursements
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {application.reimbursements.map((reimbursement) => (
                      <div key={reimbursement.id} className="px-6 py-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            ${reimbursement.amountDue.toFixed(2)}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            reimbursement.status === 'PENDING'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {reimbursement.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Due: {new Date(reimbursement.dueDate).toLocaleDateString()}
                        </p>
                        {reimbursement.amountPaid > 0 && (
                          <p className="text-xs text-gray-500">
                            Paid: ${reimbursement.amountPaid.toFixed(2)}
                          </p>
                        )}
                        {reimbursement.paidAt && (
                          <p className="text-xs text-gray-500">
                            Paid on: {new Date(reimbursement.paidAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Application Details */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Application Details</h3>
                </div>
                <div className="px-6 py-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Application ID</span>
                    <span className="text-gray-900 font-mono">{application.id.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className="text-gray-900">{application.status}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Type</span>
                    <span className="text-gray-900">{getApplicationTypeLabel(application.applicationType)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Claim Amount</span>
                    <span className="text-gray-900 font-semibold">${application.claimAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Submitted</span>
                    <span className="text-gray-900">{new Date(application.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Help & Support */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-700 mb-4">
                  Questions about your application status or need assistance?
                </p>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
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