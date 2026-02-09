"use client";

import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Lock,
  Building2,
  Loader2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import {
  changePassword,
  updateNotifications,
  getOrganization,
  updateOrganization,
  OrganizationSettings,
} from "@/server/auth";

export default function SettingsPage() {
  const { user, loading: userLoading, updateUserProfile } = useUser();
  const { toast } = useToast();

  // Profile state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Notification state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [renewalReminders, setRenewalReminders] = useState(true);
  const [claimsAlerts, setClaimsAlerts] = useState(false);
  const [newClients, setNewClients] = useState(true);
  const [savingNotifications, setSavingNotifications] = useState(false);

  // Organization state
  const [org, setOrg] = useState<OrganizationSettings | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [whatsappPhoneId, setWhatsappPhoneId] = useState("");
  const [emailSmtpHost, setEmailSmtpHost] = useState("");
  const [emailSmtpUser, setEmailSmtpUser] = useState("");
  const [savingOrg, setSavingOrg] = useState(false);

  // Initialize form from user data
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");

      if (user.notificationPreferences) {
        setEmailNotifications(user.notificationPreferences.email ?? true);
        setRenewalReminders(
          user.notificationPreferences.renewalReminders ?? true
        );
        setClaimsAlerts(user.notificationPreferences.claimsAlerts ?? false);
        setNewClients(user.notificationPreferences.newClients ?? true);
      }

      if (user.organization) {
        setOrg(user.organization);
        setCompanyName(user.organization.companyName || "");
        setAddress(user.organization.address || "");
        setCity(user.organization.city || "");
        setState(user.organization.state || "");
        setPincode(user.organization.pincode || "");
        setGstNumber(user.organization.gstNumber || "");
        if (user.organization.apiConfig) {
          setWhatsappPhoneId(user.organization.apiConfig.whatsappPhoneId || "");
          setEmailSmtpHost(user.organization.apiConfig.emailSmtpHost || "");
          setEmailSmtpUser(user.organization.apiConfig.emailSmtpUser || "");
        }
      }
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const success = await updateUserProfile({
        firstName,
        lastName,
        email,
        phone,
      });
      if (success) {
        toast({
          title: "Success",
          description: "Profile information updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setSavingPassword(true);
    try {
      const response = await changePassword({ currentPassword, newPassword });
      if (response.success) {
        toast({
          title: "Success",
          description: "Password updated successfully.",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update password.",
        variant: "destructive",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleNotificationChange = async (
    key: string,
    value: boolean,
    setter: (v: boolean) => void
  ) => {
    setter(value);
    setSavingNotifications(true);
    try {
      await updateNotifications({ [key]: value });
    } catch (err) {
      console.error("Failed to update notification:", err);
      setter(!value); // Revert on error
    } finally {
      setSavingNotifications(false);
    }
  };

  const handleSaveOrganization = async () => {
    setSavingOrg(true);
    try {
      const response = await updateOrganization({
        companyName,
        address,
        city,
        state,
        pincode,
        gstNumber,
        apiConfig: {
          whatsappPhoneId,
          emailSmtpHost,
          emailSmtpUser,
        },
      });
      if (response.success) {
        toast({
          title: "Success",
          description: "Organization settings updated successfully.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update organization settings.",
        variant: "destructive",
      });
    } finally {
      setSavingOrg(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#ab792e]" />
      </div>
    );
  }

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
          {/* Profile Section */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-[#ab792e]/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#ab792e]" />
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
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="pt-4">
                <Button
                  className="bg-[#ab792e] hover:bg-[#8d6325] text-white"
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-[#ab792e]/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#ab792e]" />
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
                <Input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="pt-4">
                <Button
                  className="bg-[#ab792e] hover:bg-[#8d6325] text-white"
                  onClick={handleChangePassword}
                  disabled={savingPassword}
                >
                  {savingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Organization Section (Admin only) */}
          {user?.role === "admin" && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-[#ab792e]/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-[#ab792e]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Organization
                  </h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Company Name
                    </label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Risk Marshal Insurance"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      GST Number
                    </label>
                    <Input
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      placeholder="22AAAAA0000A1Z5"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Business Street"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <Input
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Pincode
                    </label>
                    <Input
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="400001"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 mt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">
                    API Configuration
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        WhatsApp Phone ID
                      </label>
                      <Input
                        value={whatsappPhoneId}
                        onChange={(e) => setWhatsappPhoneId(e.target.value)}
                        placeholder="Meta WhatsApp Phone Number ID"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        SMTP Host
                      </label>
                      <Input
                        value={emailSmtpHost}
                        onChange={(e) => setEmailSmtpHost(e.target.value)}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      SMTP User
                    </label>
                    <Input
                      value={emailSmtpUser}
                      onChange={(e) => setEmailSmtpUser(e.target.value)}
                      placeholder="your-email@gmail.com"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    className="bg-[#ab792e] hover:bg-[#8d6325] text-white"
                    onClick={handleSaveOrganization}
                    disabled={savingOrg}
                  >
                    {savingOrg ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Organization
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-[#ab792e]/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-[#ab792e]" />
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
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("email", checked, setEmailNotifications)
                  }
                  disabled={savingNotifications}
                />
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
                <Switch
                  checked={renewalReminders}
                  onCheckedChange={(checked) =>
                    handleNotificationChange(
                      "renewalReminders",
                      checked,
                      setRenewalReminders
                    )
                  }
                  disabled={savingNotifications}
                />
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
                <Switch
                  checked={claimsAlerts}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("claimsAlerts", checked, setClaimsAlerts)
                  }
                  disabled={savingNotifications}
                />
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
                <Switch
                  checked={newClients}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("newClients", checked, setNewClients)
                  }
                  disabled={savingNotifications}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
