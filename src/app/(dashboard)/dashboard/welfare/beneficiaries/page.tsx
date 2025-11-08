"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Minus,
  AlertCircle,
  Loader2,
  User,
  Save,
  Trash2,
  Edit2
} from "lucide-react";
import { checkMembershipAndRedirect } from "@/utils/membershipCheck";
import { Skeleton } from "@/components/ui/skeleton";

interface FamilyMember {
  id?: string;
  fullName: string;
  relationship: string;
  phone: string;
  email: string;
  idNumber: string;
}

export default function ImmediateFamilyPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newMember, setNewMember] = useState<FamilyMember>({
    fullName: "",
    relationship: "",
    phone: "",
    email: "",
    idNumber: "",
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const loadFamilyMembers = async () => {
      const canAccess = await checkMembershipAndRedirect(router);
      if (!canAccess) return;

      try {
        const response = await fetch('/api/welfare/immediate-family');
        if (response.ok) {
          const data = await response.json();
          setFamilyMembers(data.familyMembers || []);
          // If no family members, show add form by default
          if (data.familyMembers.length === 0) {
            setIsAdding(true);
          }
        } else {
          setError('Failed to load family members');
        }
      } catch (error) {
        console.error('Error loading family members:', error);
        setError('Failed to load family members');
      } finally {
        setLoading(false);
      }
    };

    loadFamilyMembers();
  }, [router]);

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingIndex(null);
    setNewMember({
      fullName: "",
      relationship: "",
      phone: "",
      email: "",
      idNumber: "",
    });
    setError("");
    setSuccess("");
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewMember({
      fullName: "",
      relationship: "",
      phone: "",
      email: "",
      idNumber: "",
    });
  };

  const handleSaveNew = async () => {
    // Validate required fields
    if (!newMember.fullName || !newMember.relationship || !newMember.phone) {
      setError('Please fill in all required fields (Name, Relationship, Phone)');
      return;
    }

    // Validate email if provided
    if (newMember.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newMember.email)) {
        setError('Please enter a valid email address');
        return;
      }
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch('/api/welfare/immediate-family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
      });

      const data = await response.json();

      if (response.ok) {
        setFamilyMembers(prev => [...prev, data.familyMember]);
        setSuccess('Family member added successfully');
        setIsAdding(false);
        setNewMember({
          fullName: "",
          relationship: "",
          phone: "",
          email: "",
          idNumber: "",
        });

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || 'Failed to add family member');
      }
    } catch (error) {
      console.error('Error adding family member:', error);
      setError('Failed to add family member');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setIsAdding(false);
    setError("");
    setSuccess("");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    // Reset to original values by refetching
    fetch('/api/welfare/immediate-family')
      .then(res => res.json())
      .then(data => setFamilyMembers(data.familyMembers || []));
  };

  const handleMemberChange = (index: number, field: keyof FamilyMember, value: string) => {
    setFamilyMembers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSaveEdit = async (index: number) => {
    const member = familyMembers[index];

    // Validate required fields
    if (!member.fullName || !member.relationship || !member.phone) {
      setError('Please fill in all required fields (Name, Relationship, Phone)');
      return;
    }

    // Validate email if provided
    if (member.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(member.email)) {
        setError('Please enter a valid email address');
        return;
      }
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/welfare/immediate-family/${member.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: member.fullName,
          relationship: member.relationship,
          phone: member.phone,
          email: member.email,
          idNumber: member.idNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFamilyMembers(prev => {
          const updated = [...prev];
          updated[index] = data.familyMember;
          return updated;
        });
        setSuccess('Family member updated successfully');
        setEditingIndex(null);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || 'Failed to update family member');
      }
    } catch (error) {
      console.error('Error updating family member:', error);
      setError('Failed to update family member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (index: number, memberId: string) => {
    if (!confirm('Are you sure you want to remove this family member?')) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/welfare/immediate-family/${memberId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setFamilyMembers(prev => prev.filter((_, i) => i !== index));
        setSuccess('Family member removed successfully');

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || 'Failed to remove family member');
      }
    } catch (error) {
      console.error('Error deleting family member:', error);
      setError('Failed to remove family member');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-64 mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Your Immediate Family</h1>
          <p className="mt-2 text-gray-600">
            Add your immediate family members who will be your beneficiaries for welfare support.
            You must have at least one family member before registering for welfare.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Existing Family Members */}
        {familyMembers.length > 0 && (
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Saved Family Members ({familyMembers.length})
                </h3>
              </div>
            </div>
            <div className="px-6 py-5 space-y-6">
              {familyMembers.map((member, index) => (
                <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">
                      Family Member {index + 1}
                    </h4>
                    {editingIndex !== index && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(index)}
                          disabled={saving || editingIndex !== null}
                          className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => member.id && handleDelete(index, member.id)}
                          disabled={saving}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={member.fullName}
                        onChange={(e) => handleMemberChange(index, 'fullName', e.target.value)}
                        disabled={editingIndex !== index}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Relationship to You *
                      </label>
                      <input
                        type="text"
                        value={member.relationship}
                        onChange={(e) => handleMemberChange(index, 'relationship', e.target.value)}
                        disabled={editingIndex !== index}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="e.g., Spouse, Child, Parent, Sibling"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={member.phone}
                        onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                        disabled={editingIndex !== index}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={member.email || ''}
                        onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                        disabled={editingIndex !== index}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={member.idNumber || ''}
                        onChange={(e) => handleMemberChange(index, 'idNumber', e.target.value)}
                        disabled={editingIndex !== index}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Government ID or Social Security Number"
                      />
                    </div>
                  </div>

                  {editingIndex === index && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleSaveEdit(index)}
                        disabled={saving}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={saving}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Family Member Form */}
        {isAdding && (
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Add New Family Member
              </h3>
            </div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newMember.fullName}
                    onChange={(e) => setNewMember(prev => ({ ...prev, fullName: e.target.value }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship to You *
                  </label>
                  <input
                    type="text"
                    value={newMember.relationship}
                    onChange={(e) => setNewMember(prev => ({ ...prev, relationship: e.target.value }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g., Spouse, Child, Parent, Sibling"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={newMember.phone}
                    onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
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
                    value={newMember.email}
                    onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
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
                    value={newMember.idNumber}
                    onChange={(e) => setNewMember(prev => ({ ...prev, idNumber: e.target.value }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Government ID or Social Security Number"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSaveNew}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Add Family Member
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancelAdd}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add New Button */}
        {!isAdding && familyMembers.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={handleAddNew}
              disabled={saving || editingIndex !== null}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Another Family Member
            </button>
          </div>
        )}

        {/* Info Box */}
        {familyMembers.length === 0 && !isAdding && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Family Members Yet</h3>
            <p className="text-gray-600 mb-4">
              You need to add at least one immediate family member before you can register for welfare.
            </p>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Family Member
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
