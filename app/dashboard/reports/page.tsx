'use client';

import { FileText, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReportsPage() {
  const reports = [
    {
      title: 'Monthly Revenue Report',
      description: 'Comprehensive revenue breakdown for the month',
      date: 'March 2024',
      format: 'PDF',
      size: '2.4 MB',
    },
    {
      title: 'Claims Analysis',
      description: 'Detailed analysis of processed claims',
      date: 'Q1 2024',
      format: 'XLSX',
      size: '1.8 MB',
    },
    {
      title: 'Client Activity Report',
      description: 'Overview of client engagement and policies',
      date: 'February 2024',
      format: 'PDF',
      size: '3.1 MB',
    },
    {
      title: 'Partner Performance',
      description: 'Insurance partner metrics and KPIs',
      date: 'Q1 2024',
      format: 'PDF',
      size: '2.7 MB',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Reports</h2>
          <p className="text-sm text-gray-600 mt-1">
            Access and download your business reports
          </p>
        </div>
        <Button className="bg-[#658C58] hover:bg-[#567a4a] text-white">
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
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
    </div>
  );
}
