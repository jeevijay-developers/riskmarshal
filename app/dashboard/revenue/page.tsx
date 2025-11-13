import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, BarChart3, PieChart, Download, Filter, Calendar } from "lucide-react";

export default function Revenue() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
          <p className="text-gray-600 mt-1">Track financial performance and revenue metrics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-[#658C58] hover:bg-[#567a4a]">
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Date Range and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <Input type="date" defaultValue="2025-01-01" className="w-40" />
          <span className="text-gray-500">to</span>
          <Input type="date" defaultValue="2025-11-13" className="w-40" />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹56.8Cr</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5%
              </span> from last year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹4.74Cr</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8.3%
              </span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claims Payout</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹7.6Cr</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-red-600">
                <TrendingDown className="w-3 h-3 mr-1" />
                -3.2%
              </span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹32.3Cr</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +15.7%
              </span> profit margin
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>Revenue performance over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {[
                { month: 'Jan', amount: 220 },
                { month: 'Feb', amount: 240 },
                { month: 'Mar', amount: 260 },
                { month: 'Apr', amount: 245 },
                { month: 'May', amount: 275 },
                { month: 'Jun', amount: 290 },
                { month: 'Jul', amount: 285 },
                { month: 'Aug', amount: 295 },
                { month: 'Sep', amount: 310 },
                { month: 'Oct', amount: 280 },
                { month: 'Nov', amount: 284 },
                { month: 'Dec', amount: 300 }
              ].map((data, index) => (
                <div key={data.month} className="flex flex-col items-center space-y-1">
                  <div 
                    className="w-8 bg-[#658C58] rounded-t"
                    style={{ height: `${(data.amount / 320) * 200}px` }}
                    title={`$${data.amount}K`}
                  ></div>
                  <span className="text-xs text-gray-600">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
              Revenue in thousands (K)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Insurance Type</CardTitle>
            <CardDescription>Revenue breakdown by policy categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "Auto Insurance", revenue: "₹18.7Cr", percentage: 39.4, color: "bg-blue-500" },
                { type: "Home Insurance", revenue: "₹11.8Cr", percentage: 25.0, color: "bg-green-500" },
                { type: "Life Insurance", revenue: "₹9.5Cr", percentage: 20.0, color: "bg-purple-500" },
                { type: "Business Insurance", revenue: "₹4.7Cr", percentage: 10.0, color: "bg-yellow-500" },
                { type: "Health Insurance", revenue: "₹2.6Cr", percentage: 5.6, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.type} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.type}</span>
                    <span className="text-gray-600">{item.revenue} ({item.percentage}%)</span>
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

      {/* Financial Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
            <CardDescription>Important financial metrics and ratios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { metric: "Loss Ratio", value: "68%", target: "70%", status: "good", description: "Claims payout vs premium collected" },
                { metric: "Expense Ratio", value: "25%", target: "30%", status: "excellent", description: "Operating expenses vs premium" },
                { metric: "Combined Ratio", value: "93%", target: "100%", status: "good", description: "Overall underwriting profitability" },
                { metric: "Premium Growth", value: "+12.5%", target: "+10%", status: "excellent", description: "Year-over-year growth rate" },
                { metric: "Customer Retention", value: "89%", target: "85%", status: "good", description: "Policy renewal rate" },
              ].map((kpi) => (
                <div key={kpi.metric} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{kpi.metric}</p>
                    <p className="text-xs text-gray-600">{kpi.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{kpi.value}</p>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">Target: {kpi.target}</span>
                      <Badge variant={
                        kpi.status === 'excellent' ? 'default' :
                        kpi.status === 'good' ? 'secondary' :
                        'destructive'
                      } className="text-xs">
                        {kpi.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Agents</CardTitle>
            <CardDescription>Revenue generated by top sales agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { agent: "Rajesh Kumar Sharma", revenue: "₹4.7Cr", policies: 67, commission: "₹2.37L", growth: "+18%" },
                { agent: "Priya Singh", revenue: "₹4.4Cr", policies: 59, commission: "₹2.23L", growth: "+22%" },
                { agent: "Amit Patel", revenue: "₹4.1Cr", policies: 54, commission: "₹2.05L", growth: "+15%" },
                { agent: "Neha Gupta", revenue: "₹3.7Cr", policies: 48, commission: "₹1.87L", growth: "+9%" },
                { agent: "Suresh Reddy", revenue: "₹3.3Cr", policies: 42, commission: "₹1.65L", growth: "+25%" },
              ].map((agent, index) => (
                <div key={agent.agent} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#658C58] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{agent.agent}</p>
                      <p className="text-xs text-gray-600">{agent.policies} policies sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{agent.revenue}</p>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-gray-600">Commission: {agent.commission}</span>
                      <Badge variant="secondary">{agent.growth}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}