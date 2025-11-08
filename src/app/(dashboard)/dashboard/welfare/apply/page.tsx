"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  Minus, 
  AlertCircle, 
  Loader2,
  FileText,
  User,
  Heart
} from "lucide-react";
import { checkMembershipAndRedirect } from "@/utils/membershipCheck";
import { Skeleton } from "@/components/ui/skeleton";

interface FamilyMember {
  id: string;
  fullName: string;
  relationship: string;
  phone: string;
  email?: string;
  idNumber?: string;
}

interface UploadedFile {
  name: string;
  url: string;
  type: string;
}

export default function WelfareApply() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [canApply, setCanApply] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    applicationType: "",
    deceasedName: "",
    relationToDeceased: "",
    reasonForApplication: "",
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedFamilyIds, setSelectedFamilyIds] = useState<string[]>([]);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    const checkEligibility = async () => {
      const canAccess = await checkMembershipAndRedirect(router);
      if (!canAccess) return;

      try {
        // Fetch eligibility and family members in parallel
        const [eligibilityResponse, familyResponse] = await Promise.all([
          fetch('/api/welfare/eligibility'),
          fetch('/api/welfare/immediate-family')
        ]);

        if (eligibilityResponse.ok) {
          const data = await eligibilityResponse.json();
          setCanApply(data.canApply);
          if (!data.canApply) {
            setError(data.reason || 'You are not eligible to apply at this time');
          }
        } else {
          setError('Failed to check eligibility');
        }

        if (familyResponse.ok) {
          const familyData = await familyResponse.json();
          setFamilyMembers(familyData.familyMembers || []);
        }
      } catch (error) {
        console.error('Error checking eligibility:', error);
        setError('Failed to check eligibility');
      } finally {
        setLoading(false);
      }
    };

    checkEligibility();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleFamilySelection = (familyId: string) => {
    setSelectedFamilyIds(prev => {
      if (prev.includes(familyId)) {
        return prev.filter(id => id !== familyId);
      } else if (prev.length < 5) {
        return [...prev, familyId];
      }
      return prev;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
          setError(`File ${file.name} is not a supported format. Please use JPG, PNG, or PDF.`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError(`File ${file.name} is too large. Maximum size is 5MB.`);
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'welfare-documents');

        const response = await fetch('/api/upload/welfare-document', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await response.json();
        setUploadedFiles(prev => [...prev, {
          name: file.name,
          url: data.url,
          type: file.type.includes('pdf') ? 'document' : 'image',
        }]);
      }
    } catch (error) {
      console.error('File upload error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload files');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.applicationType) {
      setError('Please select application type');
      return false;
    }
    if (!formData.deceasedName.trim()) {
      setError('Please enter the deceased person\'s name');
      return false;
    }
    if (formData.applicationType === 'FAMILY_DEATH' && !formData.relationToDeceased) {
      setError('Please specify your relationship to the deceased');
      return false;
    }
    if (!formData.reasonForApplication.trim()) {
      setError('Please provide reason for application');
      return false;
    }

    // Validate beneficiaries selection
    if (selectedFamilyIds.length === 0) {
      setError('Please select at least one beneficiary');
      return false;
    }

    if (uploadedFiles.length === 0) {
      setError('Please upload at least one supporting document');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setError("");

    try {
      const applicationData = {
        ...formData,
        immediateFamilyIds: selectedFamilyIds,
        documents: uploadedFiles,
      };

      const response = await fetch('/api/welfare/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Application submission failed');
      }

      // Success - redirect to applications page
      router.push('/dashboard/welfare/applications?success=true');
    } catch (error) {
      console.error('Application submission error:', error);
      setError(error instanceof Error ? error.message : 'Application submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 mt-24">
        <div className="py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <Skeleton className="h-4 w-48 mb-4" />
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-80" />
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <Skeleton className="h-6 w-48 mb-6" />
              
              <div className="space-y-6">
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                
                <div>
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                
                <div>
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                
                <div>
                  <Skeleton className="h-4 w-56 mb-2" />
                  <Skeleton className="h-32 w-full" />
                </div>
                
                <Skeleton className="h-48 w-full rounded-lg" />
                
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!canApply && error) {
    return (
      <main className="flex-1 mt-24">
        <div className="py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
              onClick={() => router.back()}
              className="mb-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Welfare Dashboard
            </button>
            
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Cannot Apply</h3>
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
            <h1 className="text-3xl font-bold text-gray-900">Apply for Welfare Support</h1>
            <p className="mt-2 text-gray-600">
              Submit your application for bereavement support
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
              <AlertCircle className="h-5 w-5 inline mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Application Details */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Application Details
                </h3>
              </div>
              <div className="px-6 py-5 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Type *
                  </label>
                  <select
                    name="applicationType"
                    value={formData.applicationType}
                    onChange={handleInputChange}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select application type</option>
                    <option value="FAMILY_DEATH">Family Member Death (AUD $5,000)</option>
                    <option value="MEMBER_DEATH">Member Death (AUD $8,000)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deceased Person&apos;s Full Name *
                  </label>
                  <input
                    type="text"
                    name="deceasedName"
                    value={formData.deceasedName}
                    onChange={handleInputChange}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter full name"
                  />
                </div>

                {formData.applicationType === 'FAMILY_DEATH' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Relationship to Deceased *
                    </label>
                    <select
                      name="relationToDeceased"
                      value={formData.relationToDeceased}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select relationship</option>
                      <option value="spouse">Spouse</option>
                      <option value="child">Child</option>
                      <option value="parent">Parent</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Application *
                  </label>
                  <textarea
                    name="reasonForApplication"
                    value={formData.reasonForApplication}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Please provide details about the circumstances and why you are applying for welfare support..."
                  />
                </div>
              </div>
            </div>

            {/* Beneficiaries Selection */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Select Beneficiaries ({selectedFamilyIds.length}/5)
                  </h3>
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard/welfare/beneficiaries')}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Manage Family
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Select up to 5 of your immediate family members as beneficiaries for this claim
                </p>
              </div>
              <div className="px-6 py-5">
                {familyMembers.length > 0 ? (
                  <div className="space-y-3">
                    {familyMembers.map((member) => (
                      <label
                        key={member.id}
                        className={`flex items-start p-4 border rounded-lg cursor-pointer transition ${
                          selectedFamilyIds.includes(member.id)
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${selectedFamilyIds.length >= 5 && !selectedFamilyIds.includes(member.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFamilyIds.includes(member.id)}
                          onChange={() => toggleFamilySelection(member.id)}
                          disabled={selectedFamilyIds.length >= 5 && !selectedFamilyIds.includes(member.id)}
                          className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {member.fullName}
                            </p>
                            <span className="text-xs text-gray-500">
                              {member.relationship}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {member.phone}
                            {member.email && ` • ${member.email}`}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      No family members found. Please add your immediate family first.
                    </p>
                    <button
                      type="button"
                      onClick={() => router.push('/dashboard/welfare/beneficiaries')}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Family Members
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Document Upload */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Supporting Documents
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload death certificate, proof of relationship, and other supporting documents
                </p>
              </div>
              <div className="px-6 py-5">
                <div className="space-y-4">
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      accept="image/*,application/pdf"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5 mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-5 w-5 mr-2" />
                          Upload Documents
                        </>
                      )}
                    </button>
                    <p className="mt-2 text-xs text-gray-500">
                      Supported formats: JPG, PNG, PDF. Maximum 5MB per file.
                    </p>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Uploaded Files:</h4>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || uploading}
                className="flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5 mr-2" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}