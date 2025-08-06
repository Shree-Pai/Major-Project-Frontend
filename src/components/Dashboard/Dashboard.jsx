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
  const [finalReports, setFinalReports] = useState([]);
  const [stats, setStats] = useState([]);

  // Load reports from localStorage
  useEffect(() => {
    const savedDraftReports = JSON.parse(localStorage.getItem('fetalReportsArchive') || '[]');
    const savedFinalReports = JSON.parse(localStorage.getItem('fetalFinalReports') || '[]');
    setReports(savedDraftReports);
    setFinalReports(savedFinalReports);
    
    // Calculate real statistics
    const totalReports = savedFinalReports.length;
    const thisMonth = savedFinalReports.filter(report => {
      const reportDate = new Date(report.date);
      const now = new Date();
      return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
    }).length;
    
    const pendingReview = savedDraftReports.length; // All drafts are pending review
    const completedReports = savedFinalReports.length; // All final reports are completed
    
    setStats([
      { title: 'Total Reports', value: totalReports.toString(), icon: FileText, color: 'blue', change: '+12%' },
      { title: 'This Month', value: thisMonth.toString(), icon: Calendar, color: 'green', change: '+8%' },
      { title: 'Pending Review', value: pendingReview.toString(), icon: Clock, color: 'yellow', change: '-5%' },
      { title: 'Completed', value: completedReports.toString(), icon: Users, color: 'purple', change: '+15%' },
    ]);
  }, []);

  const filteredReports = finalReports.filter(report =>
    (report.patient?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (report.patientId?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleGenerateNewReport = () => {
    navigate('/generate-report');
  };

  const handleDeleteReport = (reportId) => {
    if (window.confirm('Are you sure you want to delete this final report? This action cannot be undone.')) {
      const updatedReports = finalReports.filter(report => report.id !== reportId);
      setFinalReports(updatedReports);
      localStorage.setItem('fetalFinalReports', JSON.stringify(updatedReports));
      
      // Update stats
      const totalReports = updatedReports.length;
      const thisMonth = updatedReports.filter(report => {
        const reportDate = new Date(report.date);
        const now = new Date();
        return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
      }).length;
      
      const pendingReview = reports.length;
      const completedReports = updatedReports.length;
      
      setStats([
        { title: 'Total Reports', value: totalReports.toString(), icon: FileText, color: 'blue', change: '+12%' },
        { title: 'This Month', value: thisMonth.toString(), icon: Calendar, color: 'green', change: '+8%' },
        { title: 'Pending Review', value: pendingReview.toString(), icon: Clock, color: 'yellow', change: '-5%' },
        { title: 'Completed', value: completedReports.toString(), icon: Users, color: 'purple', change: '+15%' },
      ]);
    }
  };

  const handleDownloadReport = (report) => {
    // Generate and download PDF for this report using the same format as GenerateReport
    import("jspdf").then((jsPDFModule) => {
      const { jsPDF } = jsPDFModule;
      const doc = new jsPDF();
      
      const reportData = report.reportData;
      const clinicInfo = reportData.clinicInfo;
      const patient = reportData.patient;
      const aiModelOutput = reportData.aiModelOutput;
      const scanParameters = reportData.scanParameters;
      const clinicalNotes = reportData.clinicalNotes;
      
      // Header
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(clinicInfo.name, 105, 15, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(clinicInfo.department, 105, 23, { align: 'center' });
      doc.text(clinicInfo.address, 105, 31, { align: 'center' });
      
      // Patient Info Table
      doc.setFontSize(10);
      let y = 45;
      
      // Table borders and content
      doc.rect(10, y, 190, 25);
      doc.line(70, y, 70, y + 25);
      doc.line(130, y, 130, y + 25);
      doc.line(10, y + 8, 200, y + 8);
      doc.line(10, y + 16, 200, y + 16);
      
      doc.text("Patient name", 12, y + 6);
      doc.text(patient.name || "", 72, y + 6);
      doc.text(`Age/Sex: ${patient.age} Years / ${patient.sex || ""}`, 132, y + 6);
      
      doc.text("Patient ID", 12, y + 14);
      doc.text(patient.patientId || "", 72, y + 14);
      doc.text("Visit date", 132, y + 14);
      
      doc.text("Referred by", 12, y + 22);
      doc.text(patient.referredBy || "", 72, y + 22);
      doc.text(patient.visitDate || "", 155, y + 14);
      
      // LMP Info
      y += 30;
      doc.text(`LMP date: ${patient.lmp}, LMP EDD: ${patient.lmp}[${patient.gestationalAge}]`, 12, y);
      
      // Report Title
      y += 10;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("OB - First Trimester Scan Report", 105, y, { align: 'center' });
      
      // Add image if available
      if (report.image) {
        try {
          doc.addImage(report.image, "JPEG", 130, 80, 60, 60);
        } catch (error) {
          console.log("Could not add image to PDF");
        }
      }
      
      // Continue with rest of content...
      y += 15;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Indication(s)", 12, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.text(aiModelOutput.indications, 12, y);
      
      // AI Detected Structures
      y += 20;
      doc.setFont("helvetica", "bold");
      doc.text("AI Detected Structures", 12, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      
      Object.entries(aiModelOutput.detectedStructures).forEach(([structure, confidence]) => {
        doc.text(`${structure}: ${confidence}% confidence`, 12, y);
        y += 5;
      });
      
      // Clinical Notes
      if (clinicalNotes) {
        y += 5;
        doc.setFont("helvetica", "bold");
        doc.text("Additional Clinical Notes", 12, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(clinicalNotes, 180);
        doc.text(lines, 12, y);
      }
      
      // Footer
      doc.setFontSize(8);
      doc.text(`Page #1 - ${new Date().toLocaleString()}`, 12, 280);
      doc.text(`FOR APPOINTMENTS KINDLY CONTACT US AT 7904513421 / 7358771733`, 105, 280, { align: 'center' });
      
      doc.save(`final_report_${report.patientId || report.id}.pdf`);
    });
  };

  // Get recent reports (last 5)
  const recentReports = finalReports.slice(0, 5);

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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Final Reports (Reviewed)</h2>
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
                  Reviewed Date
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
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDownloadReport(report)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-4"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 lg:px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No final reports found</p>
                    <p className="text-sm">Final reports will appear here after being reviewed</p>
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