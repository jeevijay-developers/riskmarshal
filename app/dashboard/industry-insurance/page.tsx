import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building, Plus, Search, Filter, Factory, Truck, Store, Briefcase, Shield, DollarSign, TrendingUp, Users } from "lucide-react";

export default function IndustryInsurance() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Industry Insurance</h1>
          <p className="text-gray-600 mt-1">Manage commercial and industrial insurance policies</p>
        </div>
        <Button className="bg-[#658C58] hover:bg-[#567a4a]">
          <Plus className="w-4 h-4 mr-2" />
          New Industry Policy
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search by company or industry type..." className="pl-10" />
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
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">287</div>
            <p className="text-xs text-muted-foreground">+12% from last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coverage</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹142Cr</div>
            <p className="text-xs text-muted-foreground">Commercial coverage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Premiums</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹3.2Cr</div>
            <p className="text-xs text-muted-foreground">Industry revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industries Covered</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Different sectors</p>
          </CardContent>
        </Card>
      </div>

      {/* Industry Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Coverage by Industry Sector</CardTitle>
            <CardDescription>Distribution of policies across different industries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { industry: "Manufacturing", count: 78, percentage: 27, avgPremium: "₹24L", color: "bg-blue-500", icon: Factory },
                { industry: "Transportation", count: 62, percentage: 22, avgPremium: "₹18L", color: "bg-green-500", icon: Truck },
                { industry: "Retail", count: 54, percentage: 19, avgPremium: "₹12L", color: "bg-purple-500", icon: Store },
                { industry: "Technology", count: 43, percentage: 15, avgPremium: "₹22L", color: "bg-yellow-500", icon: Briefcase },
                { industry: "Construction", count: 32, percentage: 11, avgPremium: "₹28L", color: "bg-red-500", icon: Building },
                { industry: "Other", count: 18, percentage: 6, avgPremium: "₹15L", color: "bg-gray-500", icon: Briefcase },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.industry} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded ${item.color} flex items-center justify-center`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">{item.industry}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">{item.count} policies</span>
                      <span className="text-gray-500">({item.percentage}%)</span>
                      <span className="font-medium">{item.avgPremium}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Categories</CardTitle>
            <CardDescription>Policy distribution by risk assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { risk: "Low Risk", count: 124, percentage: 43, color: "bg-green-500" },
                { risk: "Medium Risk", count: 98, percentage: 34, color: "bg-yellow-500" },
                { risk: "High Risk", count: 65, percentage: 23, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.risk} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.risk}</span>
                    <span className="text-gray-600">{item.count} policies ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Average Risk Score:</strong> 6.2/10
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Based on industry standards and claims history
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Industry Insurance Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Industry Insurance Policies</CardTitle>
          <CardDescription>Latest commercial and industrial insurance policies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { 
                policyId: "IND-2025-042", 
                company: "TechMahindra Solutions Pvt Ltd",
                industry: "Technology",
                coverage: "₹25L", 
                premium: "₹2.85L/year", 
                riskLevel: "Medium",
                employees: 150,
                location: "Pune, Maharashtra",
                startDate: "Nov 08, 2025", 
                status: "Active",
                coverageType: "General Liability + Cyber"
              },
              { 
                policyId: "IND-2025-041", 
                company: "Larsen & Toubro Construction",
                industry: "Construction",
                coverage: "₹50L", 
                premium: "₹4.52L/year", 
                riskLevel: "High",
                employees: 320,
                location: "Mumbai, Maharashtra",
                startDate: "Nov 05, 2025", 
                status: "Active",
                coverageType: "General + Workers Comp"
              },
              { 
                policyId: "IND-2025-040", 
                company: "Bharti Airtel Manufacturing",
                industry: "Manufacturing",
                coverage: "₹32L", 
                premium: "₹3.28L/year", 
                riskLevel: "Medium",
                employees: 240,
                location: "Chennai, Tamil Nadu",
                startDate: "Nov 03, 2025", 
                status: "Under Review",
                coverageType: "Product Liability + Property"
              },
              { 
                policyId: "IND-2025-039", 
                company: "Blue Dart Logistics Pvt Ltd",
                industry: "Transportation",
                coverage: "₹18L", 
                premium: "₹2.24L/year", 
                riskLevel: "Medium",
                employees: 85,
                location: "Bangalore, Karnataka",
                startDate: "Nov 01, 2025", 
                status: "Active",
                coverageType: "Commercial Auto + Cargo"
              },
            ].map((policy) => (
              <div key={policy.policyId} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      policy.industry === 'Technology' ? 'bg-blue-100' :
                      policy.industry === 'Construction' ? 'bg-orange-100' :
                      policy.industry === 'Manufacturing' ? 'bg-purple-100' :
                      'bg-green-100'
                    }`}>
                      {policy.industry === 'Technology' && <Briefcase className="w-6 h-6 text-blue-600" />}
                      {policy.industry === 'Construction' && <Building className="w-6 h-6 text-orange-600" />}
                      {policy.industry === 'Manufacturing' && <Factory className="w-6 h-6 text-purple-600" />}
                      {policy.industry === 'Transportation' && <Truck className="w-6 h-6 text-green-600" />}
                    </div>
                    <div>
                      <p className="font-semibold">{policy.policyId}</p>
                      <p className="text-sm text-gray-600">{policy.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={policy.status === 'Active' ? 'default' : 'secondary'}>
                      {policy.status}
                    </Badge>
                    <Badge variant={
                      policy.riskLevel === 'Low' ? 'secondary' :
                      policy.riskLevel === 'Medium' ? 'default' :
                      'destructive'
                    }>
                      {policy.riskLevel} Risk
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Factory className="w-3 h-3 mr-1" />
                      Industry
                    </div>
                    <p className="font-medium">{policy.industry}</p>
                    <p className="text-gray-500">{policy.coverageType}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Shield className="w-3 h-3 mr-1" />
                      Coverage
                    </div>
                    <p className="font-medium">{policy.coverage}</p>
                    <p className="text-gray-500">{policy.premium}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Users className="w-3 h-3 mr-1" />
                      Employees
                    </div>
                    <p className="font-medium">{policy.employees} staff</p>
                    <p className="text-gray-500">{policy.location}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Building className="w-3 h-3 mr-1" />
                      Policy Start
                    </div>
                    <p className="font-medium">{policy.startDate}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Risk Assessment
                  </Button>
                  <Button variant="outline" size="sm">
                    Claims History
                  </Button>
                  {policy.status === 'Under Review' && (
                    <Button size="sm" className="bg-[#658C58] hover:bg-[#567a4a]">
                      Approve Policy
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