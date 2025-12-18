"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Shield,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  Loader2,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import * as policyService from "@/server/policies";
import * as clientService from "@/server/clients";

interface DashboardStats {
  totalClients: number;
  activePolicies: number;
  pendingPolicies: number;
  totalRevenue: number;
}

interface RecentActivity {
  title: string;
  client: string;
  time: string;
}

interface InsurancePartner {
  name: string;
  policies: number;
  percentage: number;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activePolicies: 0,
    pendingPolicies: 0,
    totalRevenue: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [insurancePartners, setInsurancePartners] = useState<
    InsurancePartner[]
  >([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch policies
      const policiesRes = await policyService.getAllPolicies({ limit: 100 });
      const policies = policiesRes.policies || [];

      // Calculate stats from policies
      const activePolicies = policies.filter(
        (p) => p.status === "active"
      ).length;
      const pendingPolicies = policies.filter(
        (p) => p.status === "draft" || p.status === "payment_pending"
      ).length;

      // Calculate total revenue from premiums
      const totalRevenue = policies.reduce((sum, p) => {
        return sum + (p.premiumDetails?.finalPremium || 0);
      }, 0);

      // Fetch clients
      let totalClients = 0;
      try {
        const clientsRes = await clientService.getClients();
        totalClients = clientsRes.data?.length || 0;
      } catch {
        totalClients = policies.length;
      }

      // Fetch insurers for partners list
      const insurersRes = await policyService.getInsurers();
      const insurers = insurersRes.data || [];

      // Calculate policies per insurer
      const insurerPolicyCounts: Record<string, number> = {};
      policies.forEach((p) => {
        const insurerId =
          typeof p.insurer === "string" ? p.insurer : p.insurer?._id;
        if (insurerId) {
          insurerPolicyCounts[insurerId] =
            (insurerPolicyCounts[insurerId] || 0) + 1;
        }
      });

      const totalPoliciesCount = policies.length || 1;
      const partnersData: InsurancePartner[] = insurers
        .map((ins) => ({
          name: ins.companyName,
          policies: insurerPolicyCounts[ins._id] || 0,
          percentage: Math.round(
            ((insurerPolicyCounts[ins._id] || 0) / totalPoliciesCount) * 100
          ),
        }))
        .filter((p) => p.policies > 0)
        .sort((a, b) => b.policies - a.policies)
        .slice(0, 5);

      // Generate recent activities from latest policies
      const recentPolicies = [...policies]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 4);

      const activities: RecentActivity[] = recentPolicies.map((p) => {
        const clientName =
          typeof p.client === "string"
            ? "Client"
            : (p.client as any)?.name || "Unknown Client";
        const statusText =
          p.status === "active"
            ? "New policy issued"
            : p.status === "draft"
            ? "Policy draft created"
            : p.status === "payment_pending"
            ? "Awaiting payment"
            : "Policy updated";

        const createdAt = new Date(p.createdAt);
        const now = new Date();
        const diffMs = now.getTime() - createdAt.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        let timeAgo = "";
        if (diffHours < 1) timeAgo = "Just now";
        else if (diffHours < 24) timeAgo = `${diffHours} hours ago`;
        else if (diffDays === 1) timeAgo = "1 day ago";
        else timeAgo = `${diffDays} days ago`;

        return { title: statusText, client: clientName, time: timeAgo };
      });

      setStats({ totalClients, activePolicies, pendingPolicies, totalRevenue });
      setRecentActivities(activities);
      setInsurancePartners(partnersData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${value.toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#ab792e]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clients"
          value={stats.totalClients.toLocaleString()}
          icon={Users}
          trend={{ value: "From database", isPositive: true }}
        />
        <StatCard
          title="Active Policies"
          value={stats.activePolicies.toLocaleString()}
          icon={Shield}
          trend={{ value: "Currently active", isPositive: true }}
        />
        <StatCard
          title="Pending Policies"
          value={stats.pendingPolicies.toString()}
          icon={Clock}
          trend={{ value: "Awaiting action", isPositive: false }}
        />
        <StatCard
          title="Revenue (YTD)"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          trend={{ value: "Total premiums", isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
            <button className="text-sm text-[#ab792e] hover:text-[#8d6325] font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0"
                >
                  <div className="w-2 h-2 rounded-full bg-[#ab792e] mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600">{activity.client}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent activity</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Insurance Partners
            </h3>
            <TrendingUp className="w-5 h-5 text-[#ab792e]" />
          </div>
          <div className="space-y-4">
            {insurancePartners.length > 0 ? (
              insurancePartners.map((partner, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {partner.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {partner.policies} policies
                    </p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-[#ab792e] h-2 rounded-full"
                      style={{ width: `${partner.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No partners data available
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Policy Status
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="text-sm font-semibold text-gray-900">
                {stats.pendingPolicies}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active</span>
              <span className="text-sm font-semibold text-gray-900">
                {stats.activePolicies}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total</span>
              <span className="text-sm font-semibold text-gray-900">
                {stats.activePolicies + stats.pendingPolicies}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Revenue Summary
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Premium</span>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(stats.totalRevenue)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Policies</span>
              <span className="text-sm font-semibold text-gray-900">
                {stats.activePolicies}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. Premium</span>
              <span className="text-sm font-semibold text-gray-900">
                {stats.activePolicies > 0
                  ? formatCurrency(
                      Math.round(stats.totalRevenue / stats.activePolicies)
                    )
                  : "₹0"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Clients</span>
              <span className="text-sm font-semibold text-gray-900">
                {stats.totalClients}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Policies</span>
              <span className="text-sm font-semibold text-gray-900">
                {stats.activePolicies + stats.pendingPolicies}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <span className="text-sm font-semibold text-gray-900">
                {stats.activePolicies + stats.pendingPolicies > 0
                  ? Math.round(
                      (stats.activePolicies /
                        (stats.activePolicies + stats.pendingPolicies)) *
                        100
                    )
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
