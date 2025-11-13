"use client";

import { useState } from "react";
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

export default function ClientsPage() {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newClient, setNewClient] = useState({
    name: "",
    contact: "",
    policies: "",
    value: "",
  });

  const itemsPerPage = 5;

  const clients = [
    {
      id: 1,
      name: "Tata Consultancy Services",
      contact: "rajesh.kumar@tcs.com",
      policies: 12,
      status: "Active",
      value: "₹1.25Cr",
    },
    {
      id: 2,
      name: "Infosys Technologies",
      contact: "priya.sharma@infosys.in",
      policies: 8,
      status: "Active",
      value: "₹89L",
    },
    {
      id: 3,
      name: "Reliance Industries Ltd",
      contact: "amit.patel@ril.com",
      policies: 15,
      status: "Active",
      value: "₹2.1Cr",
    },
    {
      id: 4,
      name: "Wipro Corporation",
      contact: "neha.gupta@wipro.in",
      policies: 3,
      status: "Pending",
      value: "₹34.5L",
    },
    {
      id: 5,
      name: "Mahindra & Mahindra",
      contact: "suresh.reddy@mahindra.com",
      policies: 20,
      status: "Active",
      value: "₹3.15Cr",
    },
    {
      id: 6,
      name: "Blue Ocean Enterprises",
      contact: "lisa.anderson@blueocean.com",
      policies: 6,
      status: "Active",
      value: "$67,800",
    },
    {
      id: 7,
      name: "NextGen Technologies",
      contact: "robert.chen@nextgen.com",
      policies: 18,
      status: "Active",
      value: "$298,000",
    },
    {
      id: 8,
      name: "Metro Financial Group",
      contact: "jennifer.white@metrofin.com",
      policies: 11,
      status: "Active",
      value: "$156,700",
    },
    {
      id: 9,
      name: "Sunrise Healthcare",
      contact: "thomas.martin@sunrise.com",
      policies: 9,
      status: "Pending",
      value: "$92,300",
    },
    {
      id: 10,
      name: "Pacific Trading Co",
      contact: "amanda.lee@pacific.com",
      policies: 14,
      status: "Active",
      value: "$187,500",
    },
    {
      id: 11,
      name: "Apex Manufacturing",
      contact: "kevin.rodriguez@apex.com",
      policies: 22,
      status: "Active",
      value: "$345,000",
    },
    {
      id: 12,
      name: "Diamond Real Estate",
      contact: "maria.garcia@diamond.com",
      policies: 7,
      status: "Active",
      value: "$78,900",
    },
    {
      id: 13,
      name: "Velocity Logistics",
      contact: "james.taylor@velocity.com",
      policies: 13,
      status: "Active",
      value: "$165,400",
    },
    {
      id: 14,
      name: "Pinnacle Consulting",
      contact: "susan.miller@pinnacle.com",
      policies: 5,
      status: "Pending",
      value: "$45,200",
    },
    {
      id: 15,
      name: "Silverline Insurance",
      contact: "daniel.wilson@silverline.com",
      policies: 16,
      status: "Active",
      value: "$223,600",
    },
    {
      id: 16,
      name: "Horizon Retail Group",
      contact: "patricia.moore@horizon.com",
      policies: 10,
      status: "Active",
      value: "$134,800",
    },
    {
      id: 17,
      name: "Crystal Energy Solutions",
      contact: "christopher.davis@crystal.com",
      policies: 19,
      status: "Active",
      value: "$267,900",
    },
    {
      id: 18,
      name: "Omega Construction",
      contact: "nancy.johnson@omega.com",
      policies: 8,
      status: "Active",
      value: "$98,500",
    },
    {
      id: 19,
      name: "Elite Automotive",
      contact: "mark.harris@elite.com",
      policies: 12,
      status: "Pending",
      value: "$143,200",
    },
    {
      id: 20,
      name: "Stellar Communications",
      contact: "linda.clark@stellar.com",
      policies: 17,
      status: "Active",
      value: "$245,700",
    },
  ];

  const handleAddClient = () => {
    console.log("Adding client:", newClient);
    // Here you would typically send the data to your backend
    setIsAddClientOpen(false);
    setNewClient({ name: "", contact: "", policies: "", value: "" });
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
  const currentClients = clients.slice(startIndex, endIndex);

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
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Policies
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Total Value
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
                    <p className="text-sm text-gray-600">{client.contact}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{client.policies}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        client.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">
                      {client.value}
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
              <Label htmlFor="contact">Contact Email</Label>
              <Input
                id="contact"
                type="email"
                placeholder="contact@company.com"
                value={newClient.contact}
                onChange={(e) =>
                  setNewClient({ ...newClient, contact: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="policies">Number of Policies</Label>
              <Input
                id="policies"
                type="number"
                placeholder="0"
                value={newClient.policies}
                onChange={(e) =>
                  setNewClient({ ...newClient, policies: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="value">Total Value</Label>
              <Input
                id="value"
                placeholder="$0"
                value={newClient.value}
                onChange={(e) =>
                  setNewClient({ ...newClient, value: e.target.value })
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
