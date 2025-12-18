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
import { FaWhatsapp } from "react-icons/fa6";
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
  getClients,
  createClient,
  updateClient as updateClientApi,
  deleteClient as deleteClientApi,
  searchClients,
} from "@/server/clients";

interface Client {
  _id: string;
  name: string;
  contactNumber: string;
  email?: string;
  address?: string;
  gstIn?: string;
  customerId: string;
  policies?: string[];
  createdAt?: string;
}

export default function ClientsPage() {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState({
    name: "",
    contactNumber: "",
    email: "",
    address: "",
    gstIn: "",
  });

  const itemsPerPage = 5;

  const [clients, setClients] = useState<Client[]>([]);

  // Fetch clients from backend
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await getClients();
      if (response.success && response.data) {
        setClients(response.data);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  // Search clients
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      fetchClients();
      return;
    }
    try {
      const results = await searchClients(query);
      setClients(results);
    } catch (error) {
      console.error("Error searching clients:", error);
      toast.error("Search failed");
    }
  };

  const handleAddClient = async () => {
    try {
      setSaving(true);
      const response = await createClient({
        name: newClient.name.trim() || "Unnamed Client",
        contactNumber: newClient.contactNumber.trim(),
        email: newClient.email.trim(),
        address: newClient.address.trim(),
        gstIn: newClient.gstIn.trim(),
      });

      if (response.success && response.data) {
        setClients((prev) => [response.data, ...prev]);
        setIsAddClientOpen(false);
        setNewClient({
          name: "",
          contactNumber: "",
          email: "",
          address: "",
          gstIn: "",
        });
        toast.success("Client created successfully");
      }
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Failed to create client");
    } finally {
      setSaving(false);
    }
  };

  const handleViewDetails = (clientId: string) => {
    const client = clients.find((c) => c._id === clientId);
    console.log("View details for client:", client);
    // Implement view details logic - could open a modal with full details
  };

  const handleEditClient = (clientId: string) => {
    const client = clients.find((c) => c._id === clientId);
    if (client) {
      setEditingClient(client);
      setIsEditClientOpen(true);
    }
  };

  const handleUpdateClient = async () => {
    if (!editingClient) return;
    try {
      setSaving(true);
      const response = await updateClientApi(editingClient._id, {
        name: editingClient.name,
        contactNumber: editingClient.contactNumber,
        email: editingClient.email,
        address: editingClient.address,
        gstIn: editingClient.gstIn,
      });

      if (response.success && response.data) {
        setClients((prev) =>
          prev.map((c) => (c._id === editingClient._id ? response.data! : c))
        );
        setIsEditClientOpen(false);
        setEditingClient(null);
        toast.success("Client updated");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Failed to update client");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return;
    try {
      const response = await deleteClientApi(clientId);
      if (response.success) {
        setClients((prev) => prev.filter((c) => c._id !== clientId));
        toast.success("Client deleted");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client");
    }
  };

  const handleWhatsAppRenewal = (clientId: string) => {
    const client = clients.find((c) => c._id === clientId);
    if (client) {
      const phone = client.contactNumber.replace(/[^0-9]/g, "");
      const message = encodeURIComponent(
        `Hi ${client.name}, your insurance policy is due for renewal. Please click here to renew: [Renewal Link]`
      );
      window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    }
  };

  const handleWhatsAppNewPolicy = (clientId: string) => {
    const client = clients.find((c) => c._id === clientId);
    if (client) {
      const phone = client.contactNumber.replace(/[^0-9]/g, "");
      const message = encodeURIComponent(
        `Hi ${client.name}, please find your policy document attached. For any queries, feel free to contact us.`
      );
      window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = useMemo(
    () => clients.slice(startIndex, endIndex),
    [clients, startIndex, endIndex]
  );

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#ab792e]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Our Clients</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage and view all your insurance clients
          </p>
        </div>
        <Button
          className="bg-[#ab792e] hover:bg-[#8d6325] text-white"
          onClick={() => setIsAddClientOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search clients..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Contact No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  GSTIN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Customer ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Policies
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  WhatsApp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentClients.map((client) => (
                <tr
                  key={client._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#ab792e] text-white flex items-center justify-center font-semibold text-sm">
                        {client.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {client.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600">
                      {client.contactNumber}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600">{client.email}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-600">
                      {client.gstIn || "—"}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{client.customerId}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">
                      {client.policies?.length || 0}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="inline-flex items-center justify-center p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
                          <FaWhatsapp className="w-5 h-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleWhatsAppRenewal(client._id)}
                        >
                          <FaWhatsapp className="w-4 h-4 mr-2" />
                          Send Renewal Link
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleWhatsAppNewPolicy(client._id)}
                        >
                          <FaWhatsapp className="w-4 h-4 mr-2" />
                          Send Policy Document
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                          onClick={() => handleViewDetails(client._id)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditClient(client._id)}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClient(client._id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, clients.length)} of{" "}
            {clients.length} clients
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
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new client to your system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Client Name</Label>
              <Input
                id="name"
                placeholder="Enter client name"
                value={newClient.name}
                onChange={(e) =>
                  setNewClient({ ...newClient, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                placeholder="+91-98765-43210"
                value={newClient.contactNumber}
                onChange={(e) =>
                  setNewClient({ ...newClient, contactNumber: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@company.com"
                value={newClient.email}
                onChange={(e) =>
                  setNewClient({ ...newClient, email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gstIn">GSTIN</Label>
              <Input
                id="gstIn"
                placeholder="27AAACT2702R1ZN"
                value={newClient.gstIn}
                onChange={(e) =>
                  setNewClient({ ...newClient, gstIn: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="City, State"
                value={newClient.address}
                onChange={(e) =>
                  setNewClient({ ...newClient, address: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddClientOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#ab792e] hover:bg-[#8d6325] text-white"
              onClick={handleAddClient}
              disabled={saving}
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Client Modal */}
      <Dialog open={isEditClientOpen} onOpenChange={setIsEditClientOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Update the client details.</DialogDescription>
          </DialogHeader>
          {editingClient && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Client Name</Label>
                <Input
                  id="edit-name"
                  placeholder="Enter client name"
                  value={editingClient.name}
                  onChange={(e) =>
                    setEditingClient({ ...editingClient, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-contactNumber">Contact Number</Label>
                <Input
                  id="edit-contactNumber"
                  placeholder="+91-98765-43210"
                  value={editingClient.contactNumber}
                  onChange={(e) =>
                    setEditingClient({
                      ...editingClient,
                      contactNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="contact@company.com"
                  value={editingClient.email}
                  onChange={(e) =>
                    setEditingClient({
                      ...editingClient,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-gstIn">GSTIN</Label>
                <Input
                  id="edit-gstIn"
                  placeholder="27AAACT2702R1ZN"
                  value={editingClient.gstIn || ""}
                  onChange={(e) =>
                    setEditingClient({
                      ...editingClient,
                      gstIn: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  placeholder="City, State"
                  value={editingClient.address || ""}
                  onChange={(e) =>
                    setEditingClient({
                      ...editingClient,
                      address: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditClientOpen(false);
                setEditingClient(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#ab792e] hover:bg-[#8d6325] text-white"
              onClick={handleUpdateClient}
              disabled={saving}
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
