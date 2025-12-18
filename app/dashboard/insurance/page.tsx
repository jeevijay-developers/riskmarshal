"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Shield,
  Plus,
  Search,
  TrendingUp,
  Loader2,
  Building2,
  Eye,
  Pencil,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  getInsurers,
  createInsurer,
  updateInsurer,
  deleteInsurer,
  Insurer,
} from "@/server/insurers";

export default function InsurancePage() {
  const { toast } = useToast();
  const [isNewInsurerOpen, setIsNewInsurerOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [insurers, setInsurers] = useState<Insurer[]>([]);
  const [selectedInsurer, setSelectedInsurer] = useState<Insurer | null>(null);
  const [newInsurer, setNewInsurer] = useState({
    companyName: "",
    contactEmail: "",
    contactPhone: "",
    contactHelpline: "",
    address: "",
    status: "Active" as "Active" | "Inactive",
  });

  const fetchInsurers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getInsurers();
      if (response.success) {
        setInsurers(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch insurers", error);
      toast({
        title: "Error",
        description: "Unable to load insurers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchInsurers();
  }, [fetchInsurers]);

  const handleCreateInsurer = async () => {
    if (!newInsurer.companyName.trim()) {
      toast({
        title: "Validation Error",
        description: "Company name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        companyName: newInsurer.companyName,
        contactDetails: {
          email: newInsurer.contactEmail || undefined,
          phone: newInsurer.contactPhone || undefined,
          helpline: newInsurer.contactHelpline || undefined,
          address: newInsurer.address || undefined,
        },
        isActive: newInsurer.status === "Active",
      } as any;

      const response = await createInsurer(payload);
      if (response.success) {
        toast({ title: "Insurer created" });
        setInsurers([response.data, ...insurers]);
        setIsNewInsurerOpen(false);
        setNewInsurer({
          companyName: "",
          contactEmail: "",
          contactPhone: "",
          contactHelpline: "",
          address: "",
          status: "Active",
        });
      }
    } catch (error) {
      console.error("Failed to create insurer", error);
      toast({
        title: "Error",
        description: "Could not create insurer",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenView = (ins: Insurer) => {
    setSelectedInsurer(ins);
    setIsViewOpen(true);
  };

  const handleOpenEdit = (ins: Insurer) => {
    const contact = (ins as any).contactDetails || {};
    setSelectedInsurer(ins);
    setNewInsurer({
      companyName: ins.companyName,
      contactEmail: contact.email || "",
      contactPhone: contact.phone || "",
      contactHelpline: contact.helpline || "",
      address: contact.address || "",
      status:
        (ins as any).isActive ?? ins.status !== "Inactive"
          ? "Active"
          : "Inactive",
    });
    setIsEditOpen(true);
  };

  const handleUpdateInsurer = async () => {
    if (!selectedInsurer?._id) return;
    if (!newInsurer.companyName.trim()) {
      toast({
        title: "Validation Error",
        description: "Company name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        companyName: newInsurer.companyName,
        contactDetails: {
          email: newInsurer.contactEmail || undefined,
          phone: newInsurer.contactPhone || undefined,
          helpline: newInsurer.contactHelpline || undefined,
          address: newInsurer.address || undefined,
        },
        isActive: newInsurer.status === "Active",
      } as any;

      const response = await updateInsurer(selectedInsurer._id, payload);
      if (response.success) {
        toast({ title: "Insurer updated" });
        setInsurers((prev) =>
          prev.map((i) => (i._id === selectedInsurer._id ? response.data : i))
        );
        setIsEditOpen(false);
        setSelectedInsurer(null);
      }
    } catch (error) {
      console.error("Failed to update insurer", error);
      toast({
        title: "Error",
        description: "Could not update insurer",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteInsurer = async (id: string) => {
    setIsDeletingId(id);
    try {
      const response = await deleteInsurer(id);
      if (response.success) {
        toast({ title: "Insurer deleted" });
        setInsurers((prev) => prev.filter((i) => i._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete insurer", error);
      toast({
        title: "Error",
        description: "Could not delete insurer",
        variant: "destructive",
      });
    } finally {
      setIsDeletingId(null);
    }
  };

  const filteredInsurers = useMemo(() => {
    const term = search.toLowerCase();
    return insurers.filter((ins) =>
      [
        ins.companyName,
        ins.shortName,
        (ins as any).contactDetails?.email,
        (ins as any).contactDetails?.phone,
        (ins as any).contactDetails?.helpline,
        (ins as any).contactDetails?.address,
      ]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(term))
    );
  }, [insurers, search]);

  const totalPages = Math.max(1, Math.ceil(filteredInsurers.length / pageSize));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const pageStart = (currentPageSafe - 1) * pageSize;
  const pageEnd = pageStart + pageSize;
  const pagedInsurers = filteredInsurers.slice(pageStart, pageEnd);

  const totalInsurers = insurers.length;
  const activeInsurers = insurers.filter(
    (ins: any) => ins.isActive ?? ins.status !== "Inactive"
  ).length;
  const inactiveInsurers = totalInsurers - activeInsurers;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Insurers</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage insurer partners, contacts, and activation status
          </p>
        </div>
        <Button
          className="bg-[#ab792e] hover:bg-[#8d6325] text-white"
          onClick={() => setIsNewInsurerOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Insurer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#ab792e]/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#ab792e]" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">
              Total Insurers
            </h3>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {totalInsurers}
          </p>
          <p className="text-sm text-gray-600 mt-2 flex items-center">
            Partners in your network
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Active</h3>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {activeInsurers}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Currently active partners
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Inactive</h3>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {inactiveInsurers}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Paused or pending reactivation
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search insurers by name, email, or phone..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#ab792e]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pagedInsurers.map((ins) => {
                  const contact = (ins as any).contactDetails || {};
                  const isActive =
                    (ins as any).isActive ?? ins.status !== "Inactive";
                  return (
                    <tr
                      key={ins._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-[#ab792e]">
                          {ins.companyName}
                        </p>
                        {ins.shortName && (
                          <p className="text-xs text-gray-600">
                            {ins.shortName}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <p>{contact.email || "-"}</p>
                        <p className="text-gray-500">
                          {contact.phone || contact.helpline || ""}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(ins.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleOpenView(ins)}
                            >
                              <Eye className="w-4 h-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleOpenEdit(ins)}
                            >
                              <Pencil className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteInsurer(ins._id)}
                              className="text-red-600 focus:text-red-600"
                              disabled={isDeletingId === ins._id}
                            >
                              {isDeletingId === ins._id ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4 mr-2" />
                              )}
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
                {filteredInsurers.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-6 text-center text-sm text-gray-500"
                    >
                      No insurers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Showing {filteredInsurers.length === 0 ? 0 : pageStart + 1} to{" "}
          {Math.min(pageEnd, filteredInsurers.length)} of{" "}
          {filteredInsurers.length} insurers
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPageSafe === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPageSafe === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* New Insurer Modal */}
      <Dialog open={isNewInsurerOpen} onOpenChange={setIsNewInsurerOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Insurer</DialogTitle>
            <DialogDescription>
              Capture basic details for a new insurer partner.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                placeholder="e.g., HDFC Life"
                value={newInsurer.companyName}
                onChange={(e) =>
                  setNewInsurer({ ...newInsurer, companyName: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="contact@insurer.com"
                value={newInsurer.contactEmail}
                onChange={(e) =>
                  setNewInsurer({ ...newInsurer, contactEmail: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                placeholder="Phone number"
                value={newInsurer.contactPhone}
                onChange={(e) =>
                  setNewInsurer({ ...newInsurer, contactPhone: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactHelpline">Helpline</Label>
              <Input
                id="contactHelpline"
                placeholder="Helpline number"
                value={newInsurer.contactHelpline}
                onChange={(e) =>
                  setNewInsurer({
                    ...newInsurer,
                    contactHelpline: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Office address"
                value={newInsurer.address}
                onChange={(e) =>
                  setNewInsurer({ ...newInsurer, address: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newInsurer.status}
                onValueChange={(value: "Active" | "Inactive") =>
                  setNewInsurer({ ...newInsurer, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewInsurerOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#ab792e] hover:bg-[#8d6325] text-white"
              onClick={handleCreateInsurer}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Create Insurer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Insurer Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Insurer Details</DialogTitle>
            <DialogDescription>Review insurer information.</DialogDescription>
          </DialogHeader>
          {selectedInsurer && (
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <p className="text-xs text-gray-500">Company</p>
                <p className="font-medium text-gray-900">
                  {selectedInsurer.companyName}
                </p>
              </div>
              {selectedInsurer.shortName && (
                <div>
                  <p className="text-xs text-gray-500">Short Name</p>
                  <p>{selectedInsurer.shortName}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500">Contact Email</p>
                <p>{(selectedInsurer as any).contactDetails?.email || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone / Helpline</p>
                <p>
                  {(selectedInsurer as any).contactDetails?.phone ||
                    (selectedInsurer as any).contactDetails?.helpline ||
                    "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Address</p>
                <p>{(selectedInsurer as any).contactDetails?.address || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p>
                  {(selectedInsurer as any).isActive ??
                  selectedInsurer.status !== "Inactive"
                    ? "Active"
                    : "Inactive"}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Insurer Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Insurer</DialogTitle>
            <DialogDescription>Update insurer details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="companyNameEdit">Company Name *</Label>
              <Input
                id="companyNameEdit"
                value={newInsurer.companyName}
                onChange={(e) =>
                  setNewInsurer({ ...newInsurer, companyName: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactEmailEdit">Contact Email</Label>
              <Input
                id="contactEmailEdit"
                type="email"
                value={newInsurer.contactEmail}
                onChange={(e) =>
                  setNewInsurer({ ...newInsurer, contactEmail: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactPhoneEdit">Contact Phone</Label>
              <Input
                id="contactPhoneEdit"
                value={newInsurer.contactPhone}
                onChange={(e) =>
                  setNewInsurer({ ...newInsurer, contactPhone: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactHelplineEdit">Helpline</Label>
              <Input
                id="contactHelplineEdit"
                value={newInsurer.contactHelpline}
                onChange={(e) =>
                  setNewInsurer({
                    ...newInsurer,
                    contactHelpline: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="addressEdit">Address</Label>
              <Input
                id="addressEdit"
                value={newInsurer.address}
                onChange={(e) =>
                  setNewInsurer({ ...newInsurer, address: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="statusEdit">Status</Label>
              <Select
                value={newInsurer.status}
                onValueChange={(value: "Active" | "Inactive") =>
                  setNewInsurer({ ...newInsurer, status: value })
                }
              >
                <SelectTrigger id="statusEdit">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#ab792e] hover:bg-[#8d6325] text-white"
              onClick={handleUpdateInsurer}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
