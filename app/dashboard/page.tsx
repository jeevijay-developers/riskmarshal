'use client';

import { Users, Shield, FileText, DollarSign, TrendingUp, Clock } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clients"
          value="1,247"
          icon={Users}
          trend={{ value: '12% from last month', isPositive: true }}
        />
        <StatCard
          title="Active Policies"
          value="3,892"
          icon={Shield}
          trend={{ value: '8% from last month', isPositive: true }}
        />
        <StatCard
          title="Pending Claims"
          value="47"
          icon={Clock}
          trend={{ value: '3% from last week', isPositive: false }}
        />
        <StatCard
          title="Revenue (YTD)"
          value="$2.4M"
          icon={DollarSign}
          trend={{ value: '23% from last year', isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-sm text-[#658C58] hover:text-[#567a4a] font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {[
              {
                title: 'New policy issued',
                client: 'Acme Corporation',
                time: '2 hours ago',
              },
              {
                title: 'Claim processed',
                client: 'Tech Solutions Ltd',
                time: '4 hours ago',
              },
              {
                title: 'Policy renewal',
                client: 'Global Industries',
                time: '6 hours ago',
              },
              {
                title: 'New client onboarded',
                client: 'StartupXYZ',
                time: '1 day ago',
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0"
              >
                <div className="w-2 h-2 rounded-full bg-[#658C58] mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600">{activity.client}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Insurance Partners
            </h3>
            <TrendingUp className="w-5 h-5 text-[#658C58]" />
          </div>
          <div className="space-y-4">
            {[
              { name: 'SafeGuard Insurance', policies: 1245, percentage: 32 },
              { name: 'Shield Protect Co.', policies: 987, percentage: 25 },
              { name: 'Guardian Life', policies: 756, percentage: 19 },
              { name: 'TrustCover Inc.', policies: 621, percentage: 16 },
              { name: 'SecureNet Insurance', policies: 283, percentage: 8 },
            ].map((partner, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {partner.name}
                  </p>
                  <p className="text-sm text-gray-600">{partner.policies} policies</p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-[#658C58] h-2 rounded-full"
                    style={{ width: `${partner.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
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
              Claims Processing
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">In Review</span>
              <span className="text-sm font-semibold text-gray-900">23</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Approved</span>
              <span className="text-sm font-semibold text-gray-900">156</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Rejected</span>
              <span className="text-sm font-semibold text-gray-900">8</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Policy Status
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active</span>
              <span className="text-sm font-semibold text-gray-900">3,892</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expiring Soon</span>
              <span className="text-sm font-semibold text-gray-900">127</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expired</span>
              <span className="text-sm font-semibold text-gray-900">45</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Client Types
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Corporate</span>
              <span className="text-sm font-semibold text-gray-900">782</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Individual</span>
              <span className="text-sm font-semibold text-gray-900">415</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">SMB</span>
              <span className="text-sm font-semibold text-gray-900">50</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
