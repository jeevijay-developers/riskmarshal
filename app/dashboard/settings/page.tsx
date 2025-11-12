'use client';

import { Settings as SettingsIcon, User, Bell, Lock, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-[#658C58]/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#658C58]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Profile Information
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <Input defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <Input defaultValue="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input type="email" defaultValue="john.doe@riskmarshal.com" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <Input type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
              <div className="pt-4">
                <Button className="bg-[#658C58] hover:bg-[#567a4a] text-white">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-[#658C58]/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#658C58]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Security
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <Input type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <Input type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <Input type="password" placeholder="Confirm new password" />
              </div>
              <div className="pt-4">
                <Button className="bg-[#658C58] hover:bg-[#567a4a] text-white">
                  Update Password
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-[#658C58]/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-[#658C58]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Email Notifications
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Receive email updates
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Policy Renewals
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Alert for renewals
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Claim Updates
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Notify on claim status
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    New Clients
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Alert for new clients
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-[#658C58]/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-[#658C58]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Organization
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <Input defaultValue="RiskMarshal Inc." />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Industry
                </label>
                <Input defaultValue="Insurance Services" />
              </div>
              <div className="pt-4">
                <Button className="w-full bg-[#658C58] hover:bg-[#567a4a] text-white">
                  Update Organization
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
