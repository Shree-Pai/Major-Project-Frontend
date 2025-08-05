import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Eye, Calendar, User } from 'lucide-react';

const ReportArchive = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [reports, setReports] = useState([]);

  // Load reports from localStorage on component mount
  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem('fetalReportsArchive') || '[]');
    setReports(savedReports);
  }, []);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status.toLowerCase().includes(filterStatus.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Report Archive</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Access and manage all previous ultrasound reports
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search patients or IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending Review</option>
              <option value="ai">AI Generated</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-10 pr-8 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow">
            <div className="aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <img 
                src={report.image} 
                alt="Fetal scan" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-3 lg:p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {report.patient}
                </h3>
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
              </div>
              
              <div className="space-y-1 text-xs lg:text-sm text-gray-500 dark:text-gray-400 mb-3">
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  ID: {report.patientId}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {report.date} • {report.gestationalAge}
                </div>
                <p className="text-xs truncate">Created by: {report.createdBy}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <button 
                  onClick={() => {
                    // Save the selected report to localStorage so GenerateReport can load it
                    localStorage.setItem('selectedReportForEdit', JSON.stringify(report));
                    // Navigate to GenerateReport page using React Router
                    navigate('/generate-report');
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </button>
                <button 
                  onClick={() => {
                    // Generate and download PDF for this report
                    import("jspdf").then((jsPDFModule) => {
                      const { jsPDF } = jsPDFModule;
                      const doc = new jsPDF();
                      
                      // Use the report data for PDF generation
                      const reportData = report.reportData;
                      const clinicInfo = reportData.clinicInfo;
                      
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
                      doc.line(70, y, 70, y + 25); // Vertical line
                      doc.line(130, y, 130, y + 25); // Vertical line
                      doc.line(10, y + 8, 200, y + 8); // Horizontal line
                      doc.line(10, y + 16, 200, y + 16); // Horizontal line
                      
                      doc.text("Patient name", 12, y + 6);
                      doc.text(reportData.patient.name || "", 72, y + 6);
                      doc.text(`Age/Sex: ${reportData.patient.age} Years / ${reportData.patient.sex || ""}`, 132, y + 6);
                      
                      doc.text("Patient ID", 12, y + 14);
                      doc.text(reportData.patient.patientId || "", 72, y + 14);
                      doc.text("Visit date", 132, y + 14);
                      
                      doc.text("Referred by", 12, y + 22);
                      doc.text(reportData.patient.referredBy || "", 72, y + 22);
                      doc.text(reportData.patient.visitDate || "", 155, y + 14);
                      
                      // LMP Info
                      y += 30;
                      doc.text(`LMP date: ${reportData.patient.lmp}, LMP EDD: ${reportData.patient.lmp}[${reportData.patient.gestationalAge}]`, 12, y);
                      
                      // Report Title
                      y += 10;
                      doc.setFontSize(14);
                      doc.setFont("helvetica", "bold");
                      doc.text("OB - First Trimester Scan Report", 105, y, { align: 'center' });
                      
                      // Indications Section
                      y += 15;
                      doc.setFontSize(10);
                      doc.setFont("helvetica", "bold");
                      doc.text("Indication(s)", 12, y);
                      y += 5;
                      doc.setFont("helvetica", "normal");
                      doc.text(reportData.aiModelOutput.indications, 12, y);
                      y += 5;
                      doc.text(reportData.aiModelOutput.scanType, 12, y);
                      y += 5;
                      doc.text(`Route: ${reportData.aiModelOutput.route}`, 12, y);
                      y += 5;
                      doc.text(reportData.aiModelOutput.gestation, 12, y);
                      
                      // Medical Notes
                      y += 10;
                      doc.setFont("helvetica", "bold");
                      doc.text("Medical notes", 12, y);
                      y += 5;
                      doc.setFont("helvetica", "normal");
                      doc.text(`Blood group: A1B+ve Height: 159 cms Weight: 48.2kgs`, 12, y);
                      y += 5;
                      doc.text(`Marital History: 4 years Consanguity: NCM`, 12, y);
                      y += 5;
                      doc.text(`Menstrual History: Regular`, 12, y);
                      y += 5;
                      doc.text(`Gravida: 2 Para: 1 Live: 1 Abortion: 0`, 12, y);
                  
                      
                      // Fetal Survey
                      y += 5;
                      doc.setFont("helvetica", "bold");
                      doc.text("Fetal Survey", 12, y);
                      y += 5;
                      doc.setFont("helvetica", "normal");
                      doc.text(reportData.aiModelOutput.placentaLocation, 12, y);
                      y += 5;
                      doc.text(reportData.aiModelOutput.liquorStatus, 12, y);
                      y += 5;
                      doc.text(reportData.aiModelOutput.fetalActivity, 12, y);
                      y += 5;
                      doc.text(reportData.aiModelOutput.cardiacActivity, 12, y);
                      y += 5;
                      doc.text(`Fetal heart rate - ${reportData.scanParameters.fhr} bpm`, 12, y);
                      
                    
                      
                      // AI Detected Structures
                      y += 10;
                      doc.setFont("helvetica", "bold");
                      doc.text("AI Detected Structures", 12, y);
                      y += 5;
                      doc.setFont("helvetica", "normal");
                      
                      Object.entries(reportData.aiModelOutput.detectedStructures).forEach(([structure, confidence]) => {
                        doc.text(`${structure}: ${confidence}% confidence`, 12, y);
                        y += 5;
                      });
                      
                      // Clinical Notes
                      if (reportData.clinicalNotes) {
                        y += 5;
                        doc.setFont("helvetica", "bold");
                        doc.text("Additional Clinical Notes", 12, y);
                        y += 5;
                        doc.setFont("helvetica", "normal");
                        const lines = doc.splitTextToSize(reportData.clinicalNotes, 180);
                        doc.text(lines, 12, y);
                        y += lines.length * 5;
                      }
                      
                      // Footer
                      doc.setFontSize(8);
                      doc.text(`Page #1 - ${new Date().toLocaleString()}`, 12, 280);
                      doc.text(`FOR APPOINTMENTS KINDLY CONTACT US AT 7904513421 / 7358771733`, 105, 280, { align: 'center' });
                      
                      // Add image if available
                      if (report.image) {
                        try {
                          doc.addImage(report.image, "JPEG", 130, 80, 60, 60);
                        } catch (error) {
                          console.log("Could not add image to PDF");
                        }
                      }
                      
                      doc.save(`fetal_scan_report_${report.patientId || report.id}.pdf`);
                    });
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Download className="h-3 w-3 mr-1" />
                  PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No reports found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportArchive;
