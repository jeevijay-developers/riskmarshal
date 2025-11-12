'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            RiskMarshal Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-[#658C58] transition-colors rounded-lg hover:bg-gray-100">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#658C58] rounded-full"></span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-600">Administrator</p>
            </div>
            <Avatar className="h-10 w-10 border-2 border-[#658C58]">
              <AvatarFallback className="bg-[#658C58] text-white">JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
