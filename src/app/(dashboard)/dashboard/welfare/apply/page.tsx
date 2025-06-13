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

interface Beneficiary {
  fullName: string;
  relationship: string;
  phone: string;
  email: string;
  idNumber: string;
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

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    {
      fullName: "",
      relationship: "",
      phone: "",
      email: "",
      idNumber: "",
    },
  ]);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    const checkEligibility = async () => {
      const canAccess = await checkMembershipAndRedirect(router);
      if (!canAccess) return;

      try {
        const response = await fetch('/api/welfare/eligibility');
        if (response.ok) {
          const data = await response.json();
          setCanApply(data.canApply);
          if (!data.canApply) {
            setError(data.reason || 'You are not eligible to apply at this time');
          }
        } else {
          setError('Failed to check eligibility');
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

  const handleBeneficiaryChange = (index: number, field: keyof Beneficiary, value: string) => {
    setBeneficiaries(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addBeneficiary = () => {
    if (beneficiaries.length < 5) {
      setBeneficiaries(prev => [...prev, {
        fullName: "",
        relationship: "",
        phone: "",
        email: "",
        idNumber: "",
      }]);
    }
  };

  const removeBeneficiary = (index: number) => {
    if (beneficiaries.length > 1) {
      setBeneficiaries(prev => prev.filter((_, i) => i !== index));
    }
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
    
    // Validate beneficiaries
    for (let i = 0; i < beneficiaries.length; i++) {
      const beneficiary = beneficiaries[i];
      if (!beneficiary.fullName.trim()) {
        setError(`Please enter full name for beneficiary ${i + 1}`);
        return false;
      }
      if (!beneficiary.relationship.trim()) {
        setError(`Please enter relationship for beneficiary ${i + 1}`);
        return false;
      }
      if (!beneficiary.phone.trim()) {
        setError(`Please enter phone number for beneficiary ${i + 1}`);
        return false;
      }
      if (beneficiary.email && !beneficiary.email.includes('@')) {
        setError(`Please enter valid email for beneficiary ${i + 1}`);
        return false;
      }
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
        beneficiaries: beneficiaries.filter(b => b.fullName.trim()),
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
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
                    <option value="FAMILY_DEATH">Family Member Death ($5,000)</option>
                    <option value="MEMBER_DEATH">Member Death ($8,000)</option>
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

            {/* Beneficiaries */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Beneficiaries ({beneficiaries.length}/5)
                  </h3>
                  <button
                    type="button"
                    onClick={addBeneficiary}
                    disabled={beneficiaries.length >= 5}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Beneficiary
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Add up to 5 beneficiaries who will receive the welfare support
                </p>
              </div>
              <div className="px-6 py-5 space-y-6">
                {beneficiaries.map((beneficiary, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-gray-900">
                        Beneficiary {index + 1}
                      </h4>
                      {beneficiaries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBeneficiary(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Minus className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={beneficiary.fullName}
                          onChange={(e) => handleBeneficiaryChange(index, 'fullName', e.target.value)}
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Relationship to Deceased *
                        </label>
                        <input
                          type="text"
                          value={beneficiary.relationship}
                          onChange={(e) => handleBeneficiaryChange(index, 'relationship', e.target.value)}
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="e.g., Spouse, Child, Parent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={beneficiary.phone}
                          onChange={(e) => handleBeneficiaryChange(index, 'phone', e.target.value)}
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={beneficiary.email}
                          onChange={(e) => handleBeneficiaryChange(index, 'email', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="email@example.com"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID Number (Optional)
                        </label>
                        <input
                          type="text"
                          value={beneficiary.idNumber}
                          onChange={(e) => handleBeneficiaryChange(index, 'idNumber', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Government ID or Social Security Number"
                        />
                      </div>
                    </div>
                  </div>
                ))}
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