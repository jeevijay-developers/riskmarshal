"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Plus,
  Eye,
  Pencil,
  Trash2,
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

interface Client {
  id: number;
  name: string;
  contactNumber: string;
  email: string;
  address?: string;
  gstIn?: string;
  customerId: string;
  policies: number;
  status: "Active" | "Pending";
  value: string;
}

export default function ClientsPage() {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newClient, setNewClient] = useState({
    name: "",
    contactNumber: "",
    email: "",
    address: "",
    gstIn: "",
  });

  const itemsPerPage = 5;

  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      name: "Tata Consultancy Services",
      contactNumber: "+91-98765-43210",
      email: "rajesh.kumar@tcs.com",
      address: "Mumbai, Maharashtra",
      gstIn: "27AAACT2702R1ZN",
      customerId: "CUST000001",
      policies: 12,
      status: "Active",
      value: "₹1.25Cr",
    },
    {
      id: 2,
      name: "Infosys Technologies",
      contactNumber: "+91-87654-32109",
      email: "priya.sharma@infosys.in",
      address: "Bengaluru, Karnataka",
      gstIn: "29AAACI4798L1ZU",
      customerId: "CUST000002",
      policies: 8,
      status: "Active",
      value: "₹89L",
    },
    {
      id: 3,
      name: "Reliance Industries Ltd",
      contactNumber: "+91-76543-21098",
      email: "amit.patel@ril.com",
      address: "Mumbai, Maharashtra",
      gstIn: "27AAACR5055K1Z2",
      customerId: "CUST000003",
      policies: 15,
      status: "Active",
      value: "₹2.1Cr",
    },
    {
      id: 4,
      name: "Wipro Corporation",
      contactNumber: "+91-65432-10987",
      email: "neha.gupta@wipro.in",
      address: "Pune, Maharashtra",
      gstIn: "27AAACW7387Q1Z6",
      customerId: "CUST000004",
      policies: 3,
      status: "Pending",
      value: "₹34.5L",
    },
    {
      id: 5,
      name: "Mahindra & Mahindra",
      contactNumber: "+91-91234-56780",
      email: "suresh.reddy@mahindra.com",
      address: "Hyderabad, Telangana",
      gstIn: "36AAACM2702L1Z8",
      customerId: "CUST000005",
      policies: 20,
      status: "Active",
      value: "₹3.15Cr",
    },
  ]);

  const handleAddClient = () => {
    const nextId = clients.length
      ? Math.max(...clients.map((c) => c.id)) + 1
      : 1;
    const nextCustomerId = `CUST${String(nextId).padStart(6, "0")}`;
    const newEntry: Client = {
      id: nextId,
      name: newClient.name.trim() || "Unnamed Client",
      contactNumber: newClient.contactNumber.trim(),
      email: newClient.email.trim(),
      address: newClient.address.trim(),
      gstIn: newClient.gstIn.trim(),
      customerId: nextCustomerId,
      policies: 0,
      status: "Active",
      value: "₹0",
    };
    setClients((prev) => [newEntry, ...prev]);
    setIsAddClientOpen(false);
    setNewClient({
      name: "",
      contactNumber: "",
      email: "",
      address: "",
      gstIn: "",
    });
  };

  const handleViewDetails = (clientId: number) => {
    console.log("View details for client:", clientId);
    // Implement view details logic
  };

  const handleEditClient = (clientId: number) => {
    console.log("Edit client:", clientId);
    // Implement edit logic
  };

  const handleDeleteClient = (clientId: number) => {
    console.log("Delete client:", clientId);
    // Implement delete logic
  };

  const handleWhatsAppRenewal = (clientId: number) => {
    console.log("Sending renewal link via WhatsApp to client:", clientId);
    // Implement WhatsApp renewal link logic
    // You would typically open WhatsApp with a pre-filled message
  };

  const handleWhatsAppNewPolicy = (clientId: number) => {
    console.log(
      "Sending new policy document via WhatsApp to client:",
      clientId
    );
    // Implement WhatsApp new policy document logic
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
              <Input placeholder="Search clients..." className="pl-10" />
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
                  key={client.id}
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
                    <p className="text-sm text-gray-900">{client.policies}</p>
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
                          onClick={() => handleWhatsAppRenewal(client.id)}
                        >
                          <FaWhatsapp className="w-4 h-4 mr-2" />
                          Send Renewal Link
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleWhatsAppNewPolicy(client.id)}
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
                          onClick={() => handleViewDetails(client.id)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditClient(client.id)}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClient(client.id)}
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
            >
              Add Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
