import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, Search, Filter, AlertTriangle, FileText, DollarSign, Calendar, User, Phone } from "lucide-react";

export default function PendingClaims() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pending Claims</h1>
          <p className="text-gray-600 mt-1">Review and process insurance claims awaiting approval</p>
        </div>
        <Button className="bg-[#658C58] hover:bg-[#567a4a]">
          <Plus className="w-4 h-4 mr-2" />
          New Claim
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search claims by number or client..." className="pl-10" />
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
            <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Urgent attention required</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claim Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹91.2L</div>
            <p className="text-xs text-muted-foreground">Pending approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2</div>
            <p className="text-xs text-muted-foreground">Days average</p>
          </CardContent>
        </Card>
      </div>

      {/* Claims Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Claims by Type</CardTitle>
            <CardDescription>Breakdown of pending claims</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "Motor Accident", count: 28, amount: "₹28.4L", color: "bg-red-500" },
                { type: "Property Damage", count: 19, amount: "₹19.6L", color: "bg-orange-500" },
                { type: "Medical/Health", count: 15, amount: "₹31.2L", color: "bg-blue-500" },
                { type: "Theft/Burglary", count: 8, amount: "₹9L", color: "bg-purple-500" },
                { type: "Natural Disaster", count: 3, amount: "₹3L", color: "bg-green-500" },
              ].map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded ${item.color}`}></div>
                    <span className="text-sm font-medium">{item.type}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">{item.count} claims</span>
                    <span className="font-medium">{item.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority Queue</CardTitle>
            <CardDescription>High priority claims requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { claim: "CLM-2025-087", client: "Suresh Patel", type: "Motor Accident", priority: "High", days: 14 },
                { claim: "CLM-2025-083", client: "Meena Sharma", type: "Property Damage", priority: "High", days: 12 },
                { claim: "CLM-2025-079", client: "Ajay Kumar", type: "Medical", priority: "High", days: 10 },
                { claim: "CLM-2025-075", client: "Kavita Singh", type: "Theft", priority: "Medium", days: 8 },
                { claim: "CLM-2025-071", client: "Deepak Joshi", type: "Motor Accident", priority: "Medium", days: 7 },
              ].map((item) => (
                <div key={item.claim} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.claim}</p>
                    <p className="text-xs text-gray-600">{item.client} - {item.type}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={item.priority === 'High' ? 'destructive' : 'secondary'}>
                      {item.priority}
                    </Badge>
                    <span className="text-xs text-gray-500">{item.days}d</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Claims List */}
      <Card>
        <CardHeader>
          <CardTitle>Claims Requiring Action</CardTitle>
          <CardDescription>Complete list of pending insurance claims</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { 
                claimId: "CLM-2025-087", 
                policyId: "POL-2024-156",
                client: "Suresh Patel", 
                claimType: "Motor Accident", 
                claimAmount: "₹4,70,000", 
                dateSubmitted: "Oct 30, 2025", 
                daysOpen: 14,
                adjuster: "Ananya Sharma",
                priority: "High",
                status: "Under Review",
                description: "Rear-end collision with property damage and minor injury"
              },
              { 
                claimId: "CLM-2025-086", 
                policyId: "POL-2024-203",
                client: "Rekha Gupta", 
                claimType: "Property Damage", 
                claimAmount: "₹3,64,000", 
                dateSubmitted: "Nov 01, 2025", 
                daysOpen: 12,
                adjuster: "Rajesh Patel",
                priority: "Medium",
                status: "Documents Pending",
                description: "Water damage to basement due to pipe burst"
              },
              { 
                claimId: "CLM-2025-085", 
                policyId: "POL-2024-098",
                client: "Vikram Reddy", 
                claimType: "Medical/Health", 
                claimAmount: "₹9,16,000", 
                dateSubmitted: "Nov 03, 2025", 
                daysOpen: 10,
                adjuster: "Priya Gupta",
                priority: "High",
                status: "Medical Review",
                description: "Emergency surgery following workplace accident"
              },
              { 
                claimId: "CLM-2025-084", 
                policyId: "POL-2024-087",
                client: "Nisha Jain", 
                claimType: "Theft/Burglary", 
                claimAmount: "₹2,48,000", 
                dateSubmitted: "Nov 05, 2025", 
                daysOpen: 8,
                adjuster: "Vikram Singh",
                priority: "Medium",
                status: "Investigation",
                description: "Home burglary with electronics and jewelry stolen"
              },
            ].map((claim) => (
              <div key={claim.claimId} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      claim.priority === 'High' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      {claim.priority === 'High' ? 
                        <AlertTriangle className="w-6 h-6 text-red-600" /> :
                        <Clock className="w-6 h-6 text-yellow-600" />
                      }
                    </div>
                    <div>
                      <p className="font-semibold">{claim.claimId}</p>
                      <p className="text-sm text-gray-600">{claim.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={claim.priority === 'High' ? 'destructive' : 'secondary'}>
                      {claim.priority} Priority
                    </Badge>
                    <Badge variant="outline">
                      {claim.daysOpen} days open
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <FileText className="w-3 h-3 mr-1" />
                      Claim Details
                    </div>
                    <p className="font-medium">{claim.claimType}</p>
                    <p className="text-gray-500">{claim.policyId}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <DollarSign className="w-3 h-3 mr-1" />
                      Claim Amount
                    </div>
                    <p className="font-medium">{claim.claimAmount}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <User className="w-3 h-3 mr-1" />
                      Adjuster
                    </div>
                    <p className="font-medium">{claim.adjuster}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      Submitted
                    </div>
                    <p className="font-medium">{claim.dateSubmitted}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Status:</span> {claim.status}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-medium">Description:</span> {claim.description}
                  </p>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline" size="sm">
                    <Phone className="w-3 h-3 mr-1" />
                    Contact Client
                  </Button>
                  <Button variant="outline" size="sm">
                    View Documents
                  </Button>
                  <Button variant="outline" size="sm">
                    Update Status
                  </Button>
                  <Button size="sm" className="bg-[#658C58] hover:bg-[#567a4a]">
                    Process Claim
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}