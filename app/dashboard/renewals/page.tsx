import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Plus, Search, Filter, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function RenewalList() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Renewal List</h1>
          <p className="text-gray-600 mt-1">Track and manage policy renewals and expirations</p>
        </div>
        <Button className="bg-[#658C58] hover:bg-[#567a4a]">
          <Plus className="w-4 h-4 mr-2" />
          Bulk Renewal
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search by policy or client name..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">Policies expiring</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renewed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renewal Rate</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Above target (85%)</p>
          </CardContent>
        </Card>
      </div>

      {/* Renewal List */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Renewals</CardTitle>
          <CardDescription>Upcoming and overdue policy renewals requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { 
                policyId: "POL-2024-156", 
                client: "Manoj Agarwal", 
                policyType: "Home Insurance", 
                currentPremium: "₹48,000", 
                newPremium: "₹50,400", 
                expiryDate: "Nov 20, 2025", 
                daysUntilExpiry: 7, 
                status: "Pending Renewal",
                renewalStatus: "contacted"
              },
              { 
                policyId: "POL-2024-098", 
                client: "Kavitha Nair", 
                policyType: "Motor Insurance", 
                currentPremium: "₹28,500", 
                newPremium: "₹30,000", 
                expiryDate: "Nov 15, 2025", 
                daysUntilExpiry: 2, 
                status: "Urgent",
                renewalStatus: "pending"
              },
              { 
                policyId: "POL-2024-203", 
                client: "Rohit Malhotra", 
                policyType: "Term Insurance", 
                currentPremium: "₹64,000", 
                newPremium: "₹64,000", 
                expiryDate: "Nov 10, 2025", 
                daysUntilExpiry: -3, 
                status: "Overdue",
                renewalStatus: "overdue"
              },
              { 
                policyId: "POL-2024-087", 
                client: "Suman Reddy", 
                policyType: "Business Insurance", 
                currentPremium: "₹1,08,000", 
                newPremium: "₹1,13,400", 
                expiryDate: "Dec 01, 2025", 
                daysUntilExpiry: 18, 
                status: "Upcoming",
                renewalStatus: "not_contacted"
              },
            ].map((renewal) => (
              <div key={renewal.policyId} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      renewal.status === 'Overdue' ? 'bg-red-100' :
                      renewal.status === 'Urgent' ? 'bg-yellow-100' :
                      renewal.status === 'Pending Renewal' ? 'bg-blue-100' :
                      'bg-green-100'
                    }`}>
                      {renewal.status === 'Overdue' ? 
                        <AlertCircle className="w-6 h-6 text-red-600" /> :
                        renewal.status === 'Urgent' ? 
                        <Clock className="w-6 h-6 text-yellow-600" /> :
                        <RefreshCw className="w-6 h-6 text-blue-600" />
                      }
                    </div>
                    <div>
                      <p className="font-semibold">{renewal.policyId}</p>
                      <p className="text-sm text-gray-600">{renewal.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      renewal.status === 'Overdue' ? 'destructive' :
                      renewal.status === 'Urgent' ? 'secondary' :
                      renewal.status === 'Pending Renewal' ? 'default' :
                      'outline'
                    }>
                      {renewal.status}
                    </Badge>
                    {renewal.daysUntilExpiry < 0 && (
                      <Badge variant="destructive">
                        {Math.abs(renewal.daysUntilExpiry)} days overdue
                      </Badge>
                    )}
                    {renewal.daysUntilExpiry >= 0 && renewal.daysUntilExpiry <= 7 && (
                      <Badge variant="secondary">
                        {renewal.daysUntilExpiry} days left
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Policy Type</p>
                    <p className="font-medium">{renewal.policyType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Current Premium</p>
                    <p className="font-medium">{renewal.currentPremium}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">New Premium</p>
                    <p className="font-medium">{renewal.newPremium}</p>
                    {renewal.currentPremium !== renewal.newPremium && (
                      <p className="text-xs text-green-600">+{((parseFloat(renewal.newPremium.replace('₹', '').replace(',', '')) - parseFloat(renewal.currentPremium.replace('₹', '').replace(',', ''))) / parseFloat(renewal.currentPremium.replace('₹', '').replace(',', '')) * 100).toFixed(1)}%</p>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Expiry Date</p>
                    <p className="font-medium">{renewal.expiryDate}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Contact Status:</span>
                    <Badge variant="outline" className={
                      renewal.renewalStatus === 'contacted' ? 'border-green-500 text-green-700' :
                      renewal.renewalStatus === 'pending' ? 'border-yellow-500 text-yellow-700' :
                      renewal.renewalStatus === 'overdue' ? 'border-red-500 text-red-700' :
                      'border-gray-500 text-gray-700'
                    }>
                      {renewal.renewalStatus === 'contacted' ? 'Client Contacted' :
                       renewal.renewalStatus === 'pending' ? 'Pending Response' :
                       renewal.renewalStatus === 'overdue' ? 'Overdue' :
                       'Not Contacted'}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Contact Client
                    </Button>
                    <Button variant="outline" size="sm">
                      View Policy
                    </Button>
                    <Button size="sm" className="bg-[#658C58] hover:bg-[#567a4a]">
                      Process Renewal
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}