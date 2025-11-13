import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, Search, Filter, Calendar, DollarSign, Shield, User, Users, TrendingUp } from "lucide-react";

export default function TermInsurance() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Term Insurance</h1>
          <p className="text-gray-600 mt-1">Manage term life insurance policies and coverage plans</p>
        </div>
        <Button className="bg-[#658C58] hover:bg-[#567a4a]">
          <Plus className="w-4 h-4 mr-2" />
          New Term Policy
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search term insurance policies..." className="pl-10" />
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
            <CardTitle className="text-sm font-medium">Active Term Policies</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">543</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coverage</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹68Cr</div>
            <p className="text-xs text-muted-foreground">Life coverage amount</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Premiums</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1.48Cr</div>
            <p className="text-xs text-muted-foreground">Recurring revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Policy Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12.5L</div>
            <p className="text-xs text-muted-foreground">Per policy coverage</p>
          </CardContent>
        </Card>
      </div>

      {/* Policy Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Coverage by Age Group</CardTitle>
            <CardDescription>Term insurance distribution across age demographics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { ageGroup: "25-35 years", count: 198, percentage: 36, avgCoverage: "₹15L", color: "bg-green-500" },
                { ageGroup: "36-45 years", count: 167, percentage: 31, avgCoverage: "₹18L", color: "bg-blue-500" },
                { ageGroup: "46-55 years", count: 124, percentage: 23, avgCoverage: "₹12L", color: "bg-purple-500" },
                { ageGroup: "56-65 years", count: 54, percentage: 10, avgCoverage: "₹8L", color: "bg-yellow-500" }
              ].map((item) => (
                <div key={item.ageGroup} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded ${item.color}`}></div>
                    <span className="text-sm font-medium">{item.ageGroup}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">{item.count} policies</span>
                    <span className="text-gray-500">({item.percentage}%)</span>
                    <span className="font-medium">{item.avgCoverage}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Policy Terms</CardTitle>
            <CardDescription>Distribution by policy duration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { term: "10 Year Term", count: 189, percentage: 35, color: "bg-red-500" },
                { term: "20 Year Term", count: 162, percentage: 30, color: "bg-orange-500" },
                { term: "30 Year Term", count: 135, percentage: 25, color: "bg-blue-500" },
                { term: "Whole Life", count: 57, percentage: 10, color: "bg-purple-500" },
              ].map((item) => (
                <div key={item.term} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.term}</span>
                    <span className="text-gray-600">{item.count} policies ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Term Insurance Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Term Insurance Policies</CardTitle>
          <CardDescription>Latest term life insurance policies and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { 
                policyId: "TERM-2025-078", 
                client: "Rajesh Kumar Sharma", 
                age: 32,
                coverage: "₹25L", 
                premium: "₹2,800/month", 
                term: "20 Year Term",
                beneficiary: "Priya Sharma (Spouse)",
                startDate: "Nov 08, 2025", 
                status: "Active",
                medicalExam: "Completed"
              },
              { 
                policyId: "TERM-2025-077", 
                client: "Neha Joshi", 
                age: 28,
                coverage: "₹30L", 
                premium: "₹3,200/month", 
                term: "30 Year Term",
                beneficiary: "Arjun Joshi (Spouse)",
                startDate: "Nov 05, 2025", 
                status: "Active",
                medicalExam: "Completed"
              },
              { 
                policyId: "TERM-2025-076", 
                client: "Amit Singh Rajput", 
                age: 45,
                coverage: "₹15L", 
                premium: "₹4,200/month", 
                term: "10 Year Term",
                beneficiary: "Kavya Rajput (Spouse)",
                startDate: "Nov 03, 2025", 
                status: "Pending Medical",
                medicalExam: "Scheduled"
              },
              { 
                policyId: "TERM-2025-075", 
                client: "Suresh Reddy", 
                age: 38,
                coverage: "₹40L", 
                premium: "₹5,400/month", 
                term: "20 Year Term",
                beneficiary: "Anita Reddy (Spouse)",
                startDate: "Nov 01, 2025", 
                status: "Active",
                medicalExam: "Completed"
              },
            ].map((policy) => (
              <div key={policy.policyId} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{policy.policyId}</p>
                      <p className="text-sm text-gray-600">{policy.client} (Age: {policy.age})</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={policy.status === 'Active' ? 'default' : 'secondary'}>
                      {policy.status}
                    </Badge>
                    <Badge variant={policy.medicalExam === 'Completed' ? 'secondary' : 'outline'}>
                      {policy.medicalExam}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Shield className="w-3 h-3 mr-1" />
                      Coverage
                    </div>
                    <p className="font-medium">{policy.coverage}</p>
                    <p className="text-gray-500">{policy.term}</p>
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
                      <Users className="w-3 h-3 mr-1" />
                      Beneficiary
                    </div>
                    <p className="font-medium text-xs">{policy.beneficiary}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      Start Date
                    </div>
                    <p className="font-medium">{policy.startDate}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit Policy
                  </Button>
                  {policy.status === 'Pending Medical' && (
                    <Button size="sm" className="bg-[#658C58] hover:bg-[#567a4a]">
                      Schedule Medical
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}