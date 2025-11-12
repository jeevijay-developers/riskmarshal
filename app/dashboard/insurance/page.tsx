'use client';

import { Shield, Plus, Search, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function InsurancePage() {
  const policies = [
    {
      id: 'POL-2024-001',
      type: 'Health Insurance',
      client: 'Acme Corporation',
      premium: '$12,500',
      status: 'Active',
      expiry: '2025-03-15',
      partner: 'SafeGuard Insurance',
    },
    {
      id: 'POL-2024-002',
      type: 'Property Insurance',
      client: 'Tech Solutions Ltd',
      premium: '$8,900',
      status: 'Active',
      expiry: '2025-06-20',
      partner: 'Shield Protect Co.',
    },
    {
      id: 'POL-2024-003',
      type: 'Life Insurance',
      client: 'Global Industries',
      premium: '$21,000',
      status: 'Active',
      expiry: '2025-12-31',
      partner: 'Guardian Life',
    },
    {
      id: 'POL-2024-004',
      type: 'Vehicle Insurance',
      client: 'StartupXYZ',
      premium: '$3,450',
      status: 'Pending',
      expiry: '2024-11-30',
      partner: 'TrustCover Inc.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Insurance Policies</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage all insurance policies and partners
          </p>
        </div>
        <Button className="bg-[#658C58] hover:bg-[#567a4a] text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Policy
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#658C58]/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#658C58]" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Policies</h3>
          </div>
          <p className="text-3xl font-semibold text-gray-900">3,892</p>
          <p className="text-sm text-green-600 mt-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            8% increase
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Active Policies</h3>
          </div>
          <p className="text-3xl font-semibold text-gray-900">3,845</p>
          <p className="text-sm text-gray-600 mt-2">98.8% active rate</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Expiring Soon</h3>
          </div>
          <p className="text-3xl font-semibold text-gray-900">127</p>
          <p className="text-sm text-gray-600 mt-2">Next 30 days</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search policies by ID, client, or type..."
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Policy ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Partner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Premium
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {policies.map((policy) => (
                <tr key={policy.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-[#658C58]">
                      {policy.id}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{policy.type}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{policy.client}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600">{policy.partner}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">
                      {policy.premium}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600">{policy.expiry}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        policy.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {policy.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing 1 to 4 of 3,892 policies
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
