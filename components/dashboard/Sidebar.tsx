"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Shield,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  UserCog,
  Car,
  UserCheck,
  RefreshCw,
  CheckCircle,
  Clock,
  DollarSign,
  Heart,
  Building,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

const navItems = [
  { name: 'Dashboard Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Our Clients', href: '/dashboard/clients', icon: Users },
  { name: 'Insurance', href: '/dashboard/insurance', icon: Shield },
  { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'Policy management', href: '/dashboard/policy', icon: FileCheck },
  { name: 'Sub agent management', href: '/dashboard/subagent', icon: UserCog },
  { name: 'Car insurance', href: '/dashboard/car-insurance', icon: Car },
  { name: 'Term insurance', href: '/dashboard/term-insurance', icon: Heart },
  { name: 'Industry insurance', href: '/dashboard/industry-insurance', icon: Building },
  { name: 'Our employees', href: '/dashboard/employees', icon: UserCheck },
  { name: 'Renewal list', href: '/dashboard/renewals', icon: RefreshCw },
  { name: 'Active Policies', href: '/dashboard/active-policies', icon: CheckCircle },
  { name: 'Pending Claims', href: '/dashboard/pending-claims', icon: Clock },
  { name: 'Revenue', href: '/dashboard/revenue', icon: DollarSign },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    router.push("/login");
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-full bg-[#ab792e] text-white flex flex-col transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="p-2 flex items-center justify-between border-b border-white/10">
          {!isCollapsed && (
            <div className="flex items-center space-x-3 bg-white p-4 rounded-lg">
              <Image
                src="/logo_bgwhite.png"
                alt="RiskMarshal Logo"
                width={220}
                height={120}
              />
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mx-auto">
              <Shield className="w-5 h-5" />
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-[#ab792e] border-2 border-white rounded-full flex items-center justify-center hover:bg-[#8d6325] transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.name : ""}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Logout" : ""}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>

      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You will need to sign in again
              to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 sm:space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              className="flex-1 bg-[#ab792e] hover:bg-[#8d6325] text-white"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
