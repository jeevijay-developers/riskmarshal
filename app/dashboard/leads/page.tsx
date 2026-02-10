"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Loader2,
  UserPlus,
  Phone,
  Mail,
  StickyNote,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import {
  getLeads,
  createLead,
  updateLead as updateLeadApi,
  deleteLead as deleteLeadApi,
  Lead,
} from "@/server/leads";

const STATUS_OPTIONS = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Closed Won",
  "Closed Lost",
] as const;

const SOURCE_OPTIONS = [
  "Website",
  "Referral",
  "LinkedIn",
  "Cold Call",
  "Walk-in",
  "Social Media",
  "Other",
];

const statusColors: Record<string, string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  Qualified: "bg-purple-100 text-purple-700",
  "Proposal Sent": "bg-orange-100 text-orange-700",
  "Closed Won": "bg-green-100 text-green-700",
  "Closed Lost": "bg-red-100 text-red-700",
};

export default function LeadsPage() {
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isViewLeadOpen, setIsViewLeadOpen] = useState(false);
  const [isEditLeadOpen, setIsEditLeadOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    status: "New" as Lead["status"],
    source: "Website",
    notes: "",
  });

  const itemsPerPage = 8;
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await getLeads();
      if (response.success && response.data) {
        setLeads(response.data);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  // Filter + search
  const filteredLeads = useMemo(() => {
    let result = leads;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          l.source.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((l) => l.status === statusFilter);
    }
    return result;
  }, [leads, searchQuery, statusFilter]);

  const handleAddLead = async () => {
    if (!newLead.name.trim() || !newLead.phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }
    try {
      setSaving(true);
      const response = await createLead({
        name: newLead.name.trim(),
        email: newLead.email.trim(),
        phone: newLead.phone.trim(),
        status: newLead.status,
        source: newLead.source,
        notes: newLead.notes.trim(),
      });

      if (response.success && response.data) {
        setLeads((prev) => [response.data, ...prev]);
        setIsAddLeadOpen(false);
        setNewLead({
          name: "",
          email: "",
          phone: "",
          status: "New",
          source: "Website",
          notes: "",
        });
        toast.success("Lead created successfully");
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error("Failed to create lead");
    } finally {
      setSaving(false);
    }
  };

  const handleViewDetails = (leadId: string) => {
    const lead = leads.find((l) => l._id === leadId);
    if (lead) {
      setViewLead(lead);
      setIsViewLeadOpen(true);
    }
  };

  const handleEditLead = (leadId: string) => {
    const lead = leads.find((l) => l._id === leadId);
    if (lead) {
      setEditingLead(lead);
      setIsEditLeadOpen(true);
    }
  };

  const handleUpdateLead = async () => {
    if (!editingLead) return;
    try {
      setSaving(true);
      const response = await updateLeadApi(editingLead._id, {
        name: editingLead.name,
        email: editingLead.email,
        phone: editingLead.phone,
        status: editingLead.status,
        source: editingLead.source,
        notes: editingLead.notes,
      });

      if (response.success && response.data) {
        setLeads((prev) =>
          prev.map((l) => (l._id === editingLead._id ? response.data : l))
        );
        setIsEditLeadOpen(false);
        setEditingLead(null);
        toast.success("Lead updated");
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Failed to update lead");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      const response = await deleteLeadApi(leadId);
      if (response.success) {
        setLeads((prev) => prev.filter((l) => l._id !== leadId));
        toast.success("Lead deleted");
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Failed to delete lead");
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeads = useMemo(
    () => filteredLeads.slice(startIndex, endIndex),
    [filteredLeads, startIndex, endIndex]
  );

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Stats
  const stats = useMemo(() => {
    const total = leads.length;
    const newLeads = leads.filter((l) => l.status === "New").length;
    const qualified = leads.filter((l) => l.status === "Qualified").length;
    const closedWon = leads.filter((l) => l.status === "Closed Won").length;
    return { total, newLeads, qualified, closedWon };
  }, [leads]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#ab792e]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Leads Management
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Track and manage your insurance leads pipeline
          </p>
        </div>
        <Button
          className="bg-[#ab792e] hover:bg-[#8d6325] text-white"
          onClick={() => setIsAddLeadOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#ab792e]/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-[#ab792e]" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">New Leads</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {stats.newLeads}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Qualified</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {stats.qualified}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Closed Won</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {stats.closedWon}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Search & Filter */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search leads by name, email, phone..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#ab792e] focus:border-transparent"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Source
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
              {currentLeads.length > 0 ? (
                currentLeads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#ab792e] text-white flex items-center justify-center font-semibold text-sm">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {lead.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-600">{lead.phone}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-600">
                        {lead.email || "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-600">{lead.source}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[lead.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-500">
                        {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(lead._id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditLead(lead._id)}
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteLead(lead._id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">
                      {searchQuery || statusFilter !== "all"
                        ? "No leads match your filters"
                        : "No leads yet. Add your first lead!"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredLeads.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredLeads.length)} of{" "}
              {filteredLeads.length} leads
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ===== ADD LEAD MODAL ===== */}
      <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>
              Enter the lead details to add them to your pipeline.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="lead-name">Full Name *</Label>
              <Input
                id="lead-name"
                placeholder="Enter full name"
                value={newLead.name}
                onChange={(e) =>
                  setNewLead({ ...newLead, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lead-phone">Phone *</Label>
              <Input
                id="lead-phone"
                placeholder="+91-98765-43210"
                value={newLead.phone}
                onChange={(e) =>
                  setNewLead({ ...newLead, phone: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lead-email">Email</Label>
              <Input
                id="lead-email"
                type="email"
                placeholder="email@example.com"
                value={newLead.email}
                onChange={(e) =>
                  setNewLead({ ...newLead, email: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lead-source">Source</Label>
                <select
                  id="lead-source"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ab792e] focus:border-transparent"
                  value={newLead.source}
                  onChange={(e) =>
                    setNewLead({ ...newLead, source: e.target.value })
                  }
                >
                  {SOURCE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lead-status">Status</Label>
                <select
                  id="lead-status"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ab792e] focus:border-transparent"
                  value={newLead.status}
                  onChange={(e) =>
                    setNewLead({
                      ...newLead,
                      status: e.target.value as Lead["status"],
                    })
                  }
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lead-notes">Notes</Label>
              <textarea
                id="lead-notes"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ab792e] focus:border-transparent min-h-[80px] resize-none"
                placeholder="Add any relevant notes about this lead..."
                value={newLead.notes}
                onChange={(e) =>
                  setNewLead({ ...newLead, notes: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddLeadOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#ab792e] hover:bg-[#8d6325] text-white"
              onClick={handleAddLead}
              disabled={saving}
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== EDIT LEAD MODAL ===== */}
      <Dialog open={isEditLeadOpen} onOpenChange={setIsEditLeadOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
            <DialogDescription>Update the lead details.</DialogDescription>
          </DialogHeader>
          {editingLead && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-lead-name">Full Name</Label>
                <Input
                  id="edit-lead-name"
                  placeholder="Enter full name"
                  value={editingLead.name}
                  onChange={(e) =>
                    setEditingLead({ ...editingLead, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-lead-phone">Phone</Label>
                <Input
                  id="edit-lead-phone"
                  placeholder="+91-98765-43210"
                  value={editingLead.phone}
                  onChange={(e) =>
                    setEditingLead({ ...editingLead, phone: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-lead-email">Email</Label>
                <Input
                  id="edit-lead-email"
                  type="email"
                  placeholder="email@example.com"
                  value={editingLead.email}
                  onChange={(e) =>
                    setEditingLead({ ...editingLead, email: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-lead-source">Source</Label>
                  <select
                    id="edit-lead-source"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ab792e] focus:border-transparent"
                    value={editingLead.source}
                    onChange={(e) =>
                      setEditingLead({
                        ...editingLead,
                        source: e.target.value,
                      })
                    }
                  >
                    {SOURCE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-lead-status">Status</Label>
                  <select
                    id="edit-lead-status"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ab792e] focus:border-transparent"
                    value={editingLead.status}
                    onChange={(e) =>
                      setEditingLead({
                        ...editingLead,
                        status: e.target.value as Lead["status"],
                      })
                    }
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-lead-notes">Notes</Label>
                <textarea
                  id="edit-lead-notes"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#ab792e] focus:border-transparent min-h-[80px] resize-none"
                  placeholder="Notes..."
                  value={editingLead.notes || ""}
                  onChange={(e) =>
                    setEditingLead({ ...editingLead, notes: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditLeadOpen(false);
                setEditingLead(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#ab792e] hover:bg-[#8d6325] text-white"
              onClick={handleUpdateLead}
              disabled={saving}
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== VIEW LEAD MODAL ===== */}
      <Dialog
        open={isViewLeadOpen}
        onOpenChange={(open) => {
          setIsViewLeadOpen(open);
          if (!open) setViewLead(null);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>
              Review the lead information.
            </DialogDescription>
          </DialogHeader>
          {viewLead ? (
            <div className="space-y-4 py-2">
              {/* Lead avatar & name */}
              <div className="flex items-center space-x-4 pb-4 border-b border-gray-100">
                <div className="w-14 h-14 rounded-full bg-[#ab792e] text-white flex items-center justify-center font-bold text-xl">
                  {viewLead.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {viewLead.name}
                  </p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      statusColors[viewLead.status] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {viewLead.status}
                  </span>
                </div>
              </div>
              {/* Details */}
              <div className="grid gap-3 text-sm text-gray-800">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{viewLead.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{viewLead.email || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Source</span>
                  <span className="font-medium">{viewLead.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span className="font-medium">
                    {new Date(viewLead.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Updated</span>
                  <span className="font-medium">
                    {new Date(viewLead.updatedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {viewLead.notes && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <StickyNote className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        Notes
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{viewLead.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-gray-500">
              No lead selected.
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsViewLeadOpen(false);
                setViewLead(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
