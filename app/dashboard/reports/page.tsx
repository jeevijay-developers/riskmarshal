"use client";

import { useState } from "react";
import { FileText, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function ReportsPage() {
  const [isGenerateReportOpen, setIsGenerateReportOpen] = useState(false);
  const [reportConfig, setReportConfig] = useState({
    type: "",
    format: "",
    period: "",
    startDate: "",
    endDate: "",
  });
  const reports = [
    {
      title: "Monthly Revenue Report",
      description: "Comprehensive revenue breakdown for the month",
      date: "March 2024",
      format: "PDF",
      size: "2.4 MB",
    },
    {
      title: "Claims Analysis",
      description: "Detailed analysis of processed claims",
      date: "Q1 2024",
      format: "XLSX",
      size: "1.8 MB",
    },
    {
      title: "Client Activity Report",
      description: "Overview of client engagement and policies",
      date: "February 2024",
      format: "PDF",
      size: "3.1 MB",
    },
    {
      title: "Partner Performance",
      description: "Insurance partner metrics and KPIs",
      date: "Q1 2024",
      format: "PDF",
      size: "2.7 MB",
    },
  ];

  const handleGenerateReport = () => {
    console.log("Generating report:", reportConfig);
    // Here you would typically send the request to your backend
    setIsGenerateReportOpen(false);
    setReportConfig({
      type: "",
      format: "",
      period: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Reports</h2>
          <p className="text-sm text-gray-600 mt-1">
            Access and download your business reports
          </p>
        </div>
        <Button
          className="bg-[#658C58] hover:bg-[#567a4a] text-white"
          onClick={() => setIsGenerateReportOpen(true)}
        >
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Stats
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <p className="text-2xl font-semibold text-gray-900">24</p>
            <p className="text-sm text-gray-600 mt-1">Total Reports</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <p className="text-2xl font-semibold text-gray-900">156</p>
            <p className="text-sm text-gray-600 mt-1">Downloads</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <p className="text-2xl font-semibold text-gray-900">8</p>
            <p className="text-sm text-gray-600 mt-1">This Month</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <p className="text-2xl font-semibold text-gray-900">45 MB</p>
            <p className="text-sm text-gray-600 mt-1">Total Size</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-lg bg-[#658C58]/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-[#658C58]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-600 space-x-4 mb-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {report.date}
              </div>
              <div className="flex items-center">
                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                  {report.format}
                </span>
              </div>
              <div>{report.size}</div>
            </div>

            <Button
              variant="outline"
              className="w-full hover:bg-[#658C58] hover:text-white hover:border-[#658C58]"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        ))}
      </div>

      {/* Generate Report Modal */}
      <Dialog
        open={isGenerateReportOpen}
        onOpenChange={setIsGenerateReportOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate New Report</DialogTitle>
            <DialogDescription>
              Configure and generate a custom report for your business insights.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select
                value={reportConfig.type}
                onValueChange={(value) =>
                  setReportConfig({ ...reportConfig, type: value })
                }
              >
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue Report</SelectItem>
                  <SelectItem value="claims">Claims Analysis</SelectItem>
                  <SelectItem value="client">Client Activity</SelectItem>
                  <SelectItem value="partner">Partner Performance</SelectItem>
                  <SelectItem value="policy">Policy Overview</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="format">Export Format</Label>
              <Select
                value={reportConfig.format}
                onValueChange={(value) =>
                  setReportConfig({ ...reportConfig, format: value })
                }
              >
                <SelectTrigger id="format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="period">Time Period</Label>
              <Select
                value={reportConfig.period}
                onValueChange={(value) =>
                  setReportConfig({ ...reportConfig, period: value })
                }
              >
                <SelectTrigger id="period">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-quarter">This Quarter</SelectItem>
                  <SelectItem value="last-quarter">Last Quarter</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {reportConfig.period === "custom" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={reportConfig.startDate}
                    onChange={(e) =>
                      setReportConfig({
                        ...reportConfig,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={reportConfig.endDate}
                    onChange={(e) =>
                      setReportConfig({
                        ...reportConfig,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsGenerateReportOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#658C58] hover:bg-[#567a4a] text-white"
              onClick={handleGenerateReport}
            >
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
