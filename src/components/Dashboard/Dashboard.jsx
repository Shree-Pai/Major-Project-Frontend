import React, { useState, useEffect } from 'react';
import { FileText, Users, TrendingUp, Clock, Calendar, Search, BarChart3, AlertTriangle } from 'lucide-react';
import StatsCard from './StatsCard';
import AnalyticsCharts from './AnalyticsCharts';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState([]);

  // Load reports from localStorage
  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem('fetalReportsArchive') || '[]');
    setReports(savedReports);
    
    // Calculate real statistics
    const totalReports = savedReports.length;
    const thisMonth = savedReports.filter(report => {
      const reportDate = new Date(report.date);
      const now = new Date();
      return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
    }).length;
    
    const pendingReview = savedReports.filter(report => report.status === 'Pending Review').length;
    const completedReports = savedReports.filter(report => report.status === 'Completed').length;
    
    setStats([
      { title: 'Total Reports', value: totalReports.toString(), icon: FileText, color: 'blue', change: '+12%' },
      { title: 'This Month', value: thisMonth.toString(), icon: Calendar, color: 'green', change: '+8%' },
      { title: 'Pending Review', value: pendingReview.toString(), icon: Clock, color: 'yellow', change: '-5%' },
      { title: 'Completed', value: completedReports.toString(), icon: Users, color: 'purple', change: '+15%' },
    ]);
  }, []);

  const filteredReports = reports.filter(report =>
    report.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateNewReport = () => {
    navigate('/generate-report');
  };

  const handleViewReport = (report) => {
    // Save the selected report to localStorage so GenerateReport can load it
    localStorage.setItem('selectedReportForEdit', JSON.stringify(report));
    navigate('/generate-report');
  };

  const handleDownloadReport = (report) => {
    const doc = new jsPDF();
    doc.text('Ultrasound Fetal Scan Report', 10, 10);
    doc.text(`Patient Name: ${report.patient}`, 10, 20);
    doc.text(`Patient ID: ${report.patientId}`, 10, 30);
    doc.text(`Gestational Age: ${report.gestationalAge}`, 10, 40);
    doc.text(`Date: ${report.date}`, 10, 50);
    doc.text(`Status: ${report.status}`, 10, 60);
    doc.save(`report_${report.patientId || report.id}.pdf`);
  };

  // Get recent reports (last 5)
  const recentReports = reports.slice(0, 5);

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Overview of your fetal scan reports and clinic activity
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleGenerateNewReport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 lg:px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Generate New Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Analytics Charts */}
      <AnalyticsCharts />

      {/* Recent Reports */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Reports</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                  ID
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Gestational Age
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Date
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      <div>
                        {report.patient}
                        <div className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">
                          ID: {report.patientId} • {report.date}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                      {report.patientId}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {report.gestationalAge}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {report.date}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        report.status === 'Completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : report.status === 'Pending Review'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : report.status === 'Draft'
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewReport(report)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDownloadReport(report)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 lg:px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No reports found</p>
                    <p className="text-sm">Start by generating your first report</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;