import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Plus, Search, Filter, Shield, DollarSign, Calendar, User, FileText } from "lucide-react";

export default function ActivePolicies() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Active Policies</h1>
          <p className="text-gray-600 mt-1">View and manage all currently active insurance policies</p>
        </div>
        <Button className="bg-[#658C58] hover:bg-[#567a4a]">
          <Plus className="w-4 h-4 mr-2" />
          New Policy
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search active policies..." className="pl-10" />
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
            <CardTitle className="text-sm font-medium">Total Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Premium Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹4.8Cr</div>
            <p className="text-xs text-muted-foreground">Annual premium revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage Amount</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹90Cr</div>
            <p className="text-xs text-muted-foreground">Total coverage provided</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Policy Value</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹38,400</div>
            <p className="text-xs text-muted-foreground">Per policy annually</p>
          </CardContent>
        </Card>
      </div>

      {/* Policy Type Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Policy Distribution</CardTitle>
            <CardDescription>Breakdown by insurance type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "Motor Insurance", count: 487, percentage: 39, color: "bg-blue-500" },
                { type: "Home Insurance", count: 312, percentage: 25, color: "bg-green-500" },
                { type: "Term Insurance", count: 198, percentage: 16, color: "bg-purple-500" },
                { type: "Business Insurance", count: 156, percentage: 13, color: "bg-yellow-500" },
                { type: "Health Insurance", count: 94, percentage: 7, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded ${item.color}`}></div>
                    <span className="text-sm font-medium">{item.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{item.count}</span>
                    <span className="text-xs text-gray-500">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest policy activations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { policy: "POL-2025-045", client: "Ravi Kumar", type: "Motor", date: "2 hours ago" },
                { policy: "POL-2025-044", client: "Neha Joshi", type: "Home", date: "5 hours ago" },
                { policy: "POL-2025-043", client: "Arjun Gupta", type: "Term", date: "1 day ago" },
                { policy: "POL-2025-042", client: "Priya Mehta", type: "Business", date: "1 day ago" },
                { policy: "POL-2025-041", client: "Suresh Iyer", type: "Motor", date: "2 days ago" },
              ].map((activity) => (
                <div key={activity.policy} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{activity.policy}</p>
                    <p className="text-xs text-gray-600">{activity.client} - {activity.type}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Policies List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Policy Details</CardTitle>
          <CardDescription>Complete list of currently active insurance policies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { 
                policyId: "POL-2025-045", 
                client: "Ravi Kumar", 
                policyType: "Motor Insurance", 
                premium: "₹28,500/year", 
                coverage: "₹5,00,000", 
                startDate: "Nov 10, 2025", 
                endDate: "Nov 10, 2026", 
                agent: "Ramesh Chandra",
                status: "Active",
                paymentStatus: "Paid"
              },
              { 
                policyId: "POL-2025-044", 
                client: "Neha Joshi", 
                policyType: "Home Insurance", 
                premium: "₹48,000/year", 
                coverage: "₹25,00,000", 
                startDate: "Nov 08, 2025", 
                endDate: "Nov 08, 2026", 
                agent: "Sunita Sharma",
                status: "Active",
                paymentStatus: "Paid"
              },
              { 
                policyId: "POL-2025-043", 
                client: "Arjun Gupta", 
                policyType: "Term Insurance", 
                premium: "₹64,000/year", 
                coverage: "₹50,00,000", 
                startDate: "Nov 05, 2025", 
                endDate: "Nov 05, 2026", 
                agent: "Deepak Kumar",
                status: "Active",
                paymentStatus: "Pending"
              },
              { 
                policyId: "POL-2025-042", 
                client: "Priya Mehta", 
                policyType: "Business Insurance", 
                premium: "₹1,08,000/year", 
                coverage: "₹1,00,00,000", 
                startDate: "Nov 03, 2025", 
                endDate: "Nov 03, 2026", 
                agent: "Pooja Singh",
                status: "Active",
                paymentStatus: "Paid"
              },
            ].map((policy) => (
              <div key={policy.policyId} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{policy.policyId}</p>
                      <p className="text-sm text-gray-600">{policy.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">
                      {policy.status}
                    </Badge>
                    <Badge variant={policy.paymentStatus === 'Paid' ? 'secondary' : 'destructive'}>
                      {policy.paymentStatus}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <FileText className="w-3 h-3 mr-1" />
                      Policy Type
                    </div>
                    <p className="font-medium">{policy.policyType}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <DollarSign className="w-3 h-3 mr-1" />
                      Premium
                    </div>
                    <p className="font-medium">{policy.premium}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Shield className="w-3 h-3 mr-1" />
                      Coverage
                    </div>
                    <p className="font-medium">{policy.coverage}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <User className="w-3 h-3 mr-1" />
                      Agent
                    </div>
                    <p className="font-medium">{policy.agent}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <div>
                    <span className="text-gray-600">Policy Period: </span>
                    <span className="font-medium">{policy.startDate} - {policy.endDate}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit Policy
                    </Button>
                    {policy.paymentStatus === 'Pending' && (
                      <Button size="sm" className="bg-[#658C58] hover:bg-[#567a4a]">
                        Process Payment
                      </Button>
                    )}
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