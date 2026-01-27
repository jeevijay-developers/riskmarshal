"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, Download, Calendar, Trash2, Loader2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import {
  getReports,
  generateReport,
  downloadReport,
  deleteReport,
  Report,
} from "@/server/reports";

export default function ReportsPage() {
  const { toast } = useToast();
  const [isGenerateReportOpen, setIsGenerateReportOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [reportConfig, setReportConfig] = useState({
    type: "",
    format: "",
    period: "",
    startDate: "",
    endDate: "",
  });

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getReports();
      if (response.success) {
        setReports(response.data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast({
        title: "Error",
        description: "Failed to fetch reports",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch reports on mount
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleGenerateReport = async () => {
    if (!reportConfig.type || !reportConfig.format || !reportConfig.period) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (
      reportConfig.period === "custom" &&
      (!reportConfig.startDate || !reportConfig.endDate)
    ) {
      toast({
        title: "Validation Error",
        description: "Please select start and end dates for custom period",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      const response = await generateReport({
        type: reportConfig.type as Report["type"],
        format: reportConfig.format as Report["format"],
        period: reportConfig.period,
        startDate: reportConfig.startDate || undefined,
        endDate: reportConfig.endDate || undefined,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Report generated successfully",
        });
        setReports([response.data, ...reports]);
        setIsGenerateReportOpen(false);
        setReportConfig({
          type: "",
          format: "",
          period: "",
          startDate: "",
          endDate: "",
        });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = async (report: Report) => {
    try {
      const response = await downloadReport(report._id, report.format);
      if (response.success) {
        // Handle PDF blob download
        if (response.blob) {
          const url = URL.createObjectURL(response.blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = response.filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } else if (response.data) {
          // Handle JSON data downloads
          const dataStr = JSON.stringify(response.data, null, 2);
          const blob = new Blob([dataStr], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = response.filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }

        toast({
          title: "Success",
          description: "Report downloaded successfully",
        });
      }
    } catch (error) {
      console.error("Error downloading report:", error);
      toast({
        title: "Error",
        description: "Failed to download report",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      const response = await deleteReport(reportId);
      if (response.success) {
        setReports(reports.filter((r) => r._id !== reportId));
        toast({
          title: "Success",
          description: "Report deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      toast({
        title: "Error",
        description: "Failed to delete report",
        variant: "destructive",
      });
    }
  };

  const getFormatBadgeColor = (format: string) => {
    switch (format.toLowerCase()) {
      case "pdf":
        return "bg-red-100 text-red-700";
      case "xlsx":
        return "bg-green-100 text-green-700";
      case "csv":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Reports</h2>
          <p className="text-sm text-gray-600 mt-1">
            Generate and download your business reports
          </p>
        </div>
        <Button
          className="bg-[#ab792e] hover:bg-[#8d6325] text-white"
          onClick={() => setIsGenerateReportOpen(true)}
        >
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#ab792e]" />
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 shadow-sm text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Reports Generated
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Click the &quot;Generate Report&quot; button to create your first
            report
          </p>
          <Button
            className="bg-[#ab792e] hover:bg-[#8d6325] text-white"
            onClick={() => setIsGenerateReportOpen(true)}
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Your First Report
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-[#ab792e]/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-[#ab792e]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {report.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center flex-wrap text-sm text-gray-600 gap-3 mb-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(report.createdAt)}
                </div>
                <div className="flex items-center">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${getFormatBadgeColor(
                      report.format
                    )}`}
                  >
                    {report.format}
                  </span>
                </div>
                {report.fileSize && <div>{report.fileSize}</div>}
              </div>

              <div className="text-xs text-gray-500 mb-4">
                Period: {report.period}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 hover:bg-[#ab792e] hover:text-white hover:border-[#ab792e]"
                  onClick={() => handleDownloadReport(report._id)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  className="hover:bg-red-500 hover:text-white hover:border-red-500"
                  onClick={() => handleDeleteReport(report._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

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
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#ab792e] hover:bg-[#8d6325] text-white"
              onClick={handleGenerateReport}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Report"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
