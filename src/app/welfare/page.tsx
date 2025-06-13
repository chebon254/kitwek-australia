"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Users, DollarSign, Clock, CheckCircle, Heart, Scale, FileText } from "lucide-react";

interface WelfareFundStats {
  totalMembers: number;
  activeMembers: number;
  totalAmount: number;
  isOperational: boolean;
  launchDate?: string;
  waitingPeriodEnd?: string;
}

export default function WelfarePage() {
  const [stats, setStats] = useState<WelfareFundStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWelfareStats = async () => {
      try {
        const response = await fetch('/api/welfare/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching welfare stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWelfareStats();
  }, []);

  const benefits = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Family Support",
      description: "$5,000 support for immediate family members (spouse, child, or parent)",
      amount: "$5,000"
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Member Support", 
      description: "$8,000 support for registered member's family",
      amount: "$8,000"
    }
  ];

  const requirements = [
    "Be a registered member of Kitwek Victoria Association",
    "Pay one-time registration fee of $200",
    "Minimum 100 members required for operation",
    "2-month waiting period after launch before first claim"
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Register & Pay",
      description: "Pay the one-time $200 registration fee to join the welfare fund"
    },
    {
      step: 2,
      title: "Waiting Period",
      description: "Wait for the 2-month waiting period after fund launch"
    },
    {
      step: 3,
      title: "Apply When Needed",
      description: "Submit application within 7 days of bereavement with required documents"
    },
    {
      step: 4,
      title: "Receive Support",
      description: "Get funds disbursed within 14 days of approval"
    },
    {
      step: 5,
      title: "Community Reimbursement",
      description: "All members reimburse the fund within 2 weeks to replenish it"
    }
  ];

  return (
    <main className="flex-1 mt-24">
      <div className="py-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Kitwek Victoria Welfare Department
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Supporting our community during times of grief and loss
              </p>
              
              {!loading && stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-8">
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="h-8 w-8" />
                    </div>
                    <div className="text-3xl font-bold">{stats.activeMembers}</div>
                    <div className="text-sm opacity-80">Active Members</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSign className="h-8 w-8" />
                    </div>
                    <div className="text-3xl font-bold">${stats.totalAmount.toLocaleString()}</div>
                    <div className="text-sm opacity-80">Total Fund</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                    <div className="flex items-center justify-center mb-2">
                      {stats.isOperational ? (
                        <CheckCircle className="h-8 w-8 text-green-300" />
                      ) : (
                        <Clock className="h-8 w-8 text-yellow-300" />
                      )}
                    </div>
                    <div className="text-lg font-bold">
                      {stats.isOperational ? "Operational" : "Pending Launch"}
                    </div>
                    <div className="text-sm opacity-80">
                      {stats.isOperational ? "Ready to serve" : `${100 - stats.totalMembers} more needed`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Purpose Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Our Purpose
            </h2>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-gray-600 mb-6">
                The Kitwek Victoria Welfare Department provides financial support to registered members 
                during bereavement, promoting solidarity and mutual assistance among Kalenjin community 
                members in times of grief.
              </p>
              <p className="text-lg text-gray-600">
                We ensure the sustainability and effective management of the bereavement fund through 
                community-based support and transparent governance.
              </p>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Member Benefits
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-blue-500">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {benefit.description}
                      </p>
                      <div className="text-3xl font-bold text-blue-600">
                        {benefit.amount}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements Section */}
          <div className="mb-16 bg-gray-50 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Membership Requirements
            </h2>
            <div className="max-w-3xl mx-auto">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex items-start space-x-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <p className="text-lg text-gray-700">{requirement}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              How It Works
            </h2>
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-5 gap-6">
                {howItWorks.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Constitution Highlights */}
          <div className="mb-16 bg-blue-50 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Key Constitutional Points
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="flex items-start space-x-3">
                <Scale className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Governance</h3>
                  <p className="text-gray-700">
                    Led by elected Chairperson, Secretary, Treasurer, and 8 sub-tribe representatives. 
                    Annual elections with term limits.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <FileText className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Transparency</h3>
                  <p className="text-gray-700">
                    Annual audits, financial reports at AGM, and transparent fund management 
                    with multiple signatories.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Claim Process</h3>
                  <p className="text-gray-700">
                    7 days to report, 14 days for disbursement, 2 weeks for community 
                    reimbursement. Clear timelines for all processes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Users className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Community Support</h3>
                  <p className="text-gray-700">
                    Shared responsibility model where all members contribute to replenish 
                    the fund after each claim.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Join Our Welfare Community?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Be part of a caring community that supports each other in times of need
            </p>
            <div className="space-x-4">
              <Link
                href="/dashboard/welfare"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Access Welfare Dashboard
              </Link>
              <Link
                href="/contact-us"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Have Questions?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}