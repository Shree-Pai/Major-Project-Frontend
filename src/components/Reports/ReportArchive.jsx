import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Calendar, User, CheckCircle, X } from 'lucide-react';

const ReportArchive = () => {
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
    const matchesSearch = (report.patient?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (report.patientId?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || (report.status?.toLowerCase() || '').includes(filterStatus.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  const promoteToFinal = (report) => {
    if (window.confirm('Are you sure you want to finalize this report? It will be moved to the Dashboard as a reviewed report.')) {
      // Add to final reports
      const savedFinalReports = JSON.parse(localStorage.getItem('fetalFinalReports') || '[]');
      const finalReport = {
        ...report,
        status: 'Reviewed',
        reviewedAt: new Date().toISOString()
      };
      savedFinalReports.push(finalReport);
      localStorage.setItem('fetalFinalReports', JSON.stringify(savedFinalReports));
      
      // Remove from drafts
      const updatedReports = reports.filter(r => r.id !== report.id);
      setReports(updatedReports);
      localStorage.setItem('fetalReportsArchive', JSON.stringify(updatedReports));
      
      alert('Report finalized and moved to Dashboard!');
    }
  };

  const deleteReport = (reportId) => {
    if (window.confirm('Are you sure you want to delete this draft? This action cannot be undone.')) {
      console.log('Attempting to delete report with ID:', reportId);
      console.log('Current reports:', reports);
      
      // Find the report to delete using multiple possible ID fields
      const reportToDelete = reports.find(report => 
        report.id === reportId || 
        report.timestamp === reportId ||
        report.patient?.patientId === reportId
      );
      
      console.log('Found report to delete:', reportToDelete);
      
      if (reportToDelete) {
        // Remove the specific report from the array using a more precise filter
        const updatedReports = reports.filter(report => {
          // Check if this is the same report we want to delete
          const isSameReport = (
            (report.id && reportToDelete.id && report.id === reportToDelete.id) ||
            (report.timestamp && reportToDelete.timestamp && report.timestamp === reportToDelete.timestamp) ||
            (report.patient?.patientId && reportToDelete.patient?.patientId && 
             report.patient.patientId === reportToDelete.patient.patientId)
          );
          
          // Keep the report if it's NOT the same report we want to delete
          return !isSameReport;
        });
        
        console.log('Updated reports after deletion:', updatedReports);
        
        // Update state
        setReports(updatedReports);
        
        // Update localStorage
        localStorage.setItem('fetalReportsArchive', JSON.stringify(updatedReports));
        
        alert('Report deleted successfully!');
      } else {
        console.log('Report not found for ID:', reportId);
        alert('Report not found!');
      }
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Report Archive</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Access and manage draft reports (pending review)
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
        {filteredReports.map((report, idx) => (
          <div key={report.id || idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow">
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
                  {report.patient?.name || ''}
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
                    // Generate and download PDF for this report
                    import("jspdf").then((jsPDFModule) => {
                      const { jsPDF } = jsPDFModule;
                      // Create PDF with A4 size and proper margins for printing
                      const doc = new jsPDF('p', 'mm', 'a4');
                      
                      // Use the report data for PDF generation
                      const reportData = report.reportData || report;
                      const clinicInfo = reportData.clinicInfo;
                      const patient = reportData.patient;
                      const scanParameters = reportData.scanParameters;
                      const aiModelOutput = reportData.aiModelOutput;
                      const clinicalNotes = reportData.clinicalNotes;
                      
                      // Set margins for print-friendly layout
                      const margin = 15;
                      const pageWidth = doc.internal.pageSize.width;
                      const contentWidth = pageWidth - (2 * margin);
                      let y = margin;
                      
                      // Header with clinic information
                      doc.setFontSize(18);
                      doc.setFont("helvetica", "bold");
                      doc.text(clinicInfo.name, pageWidth / 2, y, { align: 'center' });
                      y += 8;
                      
                      doc.setFontSize(12);
                      doc.setFont("helvetica", "normal");
                      doc.text(clinicInfo.department, pageWidth / 2, y, { align: 'center' });
                      y += 6;
                      doc.text(clinicInfo.address, pageWidth / 2, y, { align: 'center' });
                      y += 6;
                      doc.text(`Phone: ${clinicInfo.phone} | Email: ${clinicInfo.email}`, pageWidth / 2, y, { align: 'center' });
                      y += 6;
                      doc.text(`Website: ${clinicInfo.website}`, pageWidth / 2, y, { align: 'center' });
                      
                      // Separator line
                      y += 8;
                      doc.line(margin, y, pageWidth - margin, y);
                      y += 8;
                      
                      // Report Title
                      doc.setFontSize(16);
                      doc.setFont("helvetica", "bold");
                      doc.text("OBSTETRIC ULTRASOUND REPORT", pageWidth / 2, y, { align: 'center' });
                      y += 10;
                      
                      // Patient Information Section
                      doc.setFontSize(12);
                      doc.setFont("helvetica", "bold");
                      doc.text("PATIENT INFORMATION", margin, y);
                      y += 6;
                      
                      doc.setFont("helvetica", "normal");
                      doc.setFontSize(10);
                      
                      // Patient info in two columns
                      const col1 = margin;
                      const col2 = margin + contentWidth / 2;
                      
                      doc.text(`Name: ${patient.name}`, col1, y);
                      doc.text(`Age: ${patient.age} Years`, col2, y);
                      y += 5;
                      
                      doc.text(`Patient ID: ${patient.patientId}`, col1, y);
                      doc.text(`Sex: ${patient.sex}`, col2, y);
                      y += 5;
                      
                      doc.text(`Visit Date: ${patient.visitDate}`, col1, y);
                      doc.text(`Referred By: ${patient.referredBy}`, col2, y);
                      y += 5;
                      
                      doc.text(`LMP: ${patient.lmp}`, col1, y);
                      doc.text(`Gestational Age: ${patient.gestationalAge}`, col2, y);
                      y += 8;
                      
                      // Clinical Information
                      doc.setFont("helvetica", "bold");
                      doc.text("CLINICAL INFORMATION", margin, y);
                      y += 6;
                      
                      doc.setFont("helvetica", "normal");
                      doc.text(`Indications: ${aiModelOutput.indications}`, margin, y);
                      y += 5;
                      doc.text(`Scan Type: ${aiModelOutput.scanType}`, margin, y);
                      y += 5;
                      doc.text(`Route: ${aiModelOutput.route}`, margin, y);
                      y += 5;
                      doc.text(`Gestation: ${aiModelOutput.gestation}`, margin, y);
                      y += 8;
                      
                      // Scan Parameters
                      doc.setFont("helvetica", "bold");
                      doc.text("SCAN PARAMETERS", margin, y);
                      y += 6;
                      
                      doc.setFont("helvetica", "normal");
                      doc.text(`CRL: ${scanParameters.crl} mm`, col1, y);
                      doc.text(`BPD: ${scanParameters.bpd} mm`, col2, y);
                      y += 5;
                      doc.text(`HC: ${scanParameters.hc} mm`, col1, y);
                      doc.text(`AC: ${scanParameters.ac} mm`, col2, y);
                      y += 5;
                      doc.text(`FL: ${scanParameters.fl} mm`, col1, y);
                      doc.text(`FHR: ${scanParameters.fhr} bpm`, col2, y);
                      y += 5;
                      doc.text(`Uterine Artery PI: ${scanParameters.uterineArteryPI}`, col1, y);
                      y += 8;
                      
                      // Fetal Survey
                      doc.setFont("helvetica", "bold");
                      doc.text("FETAL SURVEY", margin, y);
                      y += 6;
                      
                      doc.setFont("helvetica", "normal");
                      doc.text(aiModelOutput.placentaLocation, margin, y);
                      y += 5;
                      doc.text(aiModelOutput.liquorStatus, margin, y);
                      y += 5;
                      doc.text(aiModelOutput.fetalActivity, margin, y);
                      y += 5;
                      doc.text(aiModelOutput.cardiacActivity, margin, y);
                      y += 8;
                      
                      // AI Detected Structures
                      doc.setFont("helvetica", "bold");
                      doc.text("AI DETECTED STRUCTURES", margin, y);
                      y += 6;
                      
                      doc.setFont("helvetica", "normal");
                      Object.entries(aiModelOutput.detectedStructures).forEach(([structure, confidence]) => {
                        doc.text(`${structure}: ${confidence}% confidence`, margin, y);
                        y += 4;
                      });
                      y += 6;
                      
                      // Add image beside AI Detected Structures
                      const image = report.image || report.aiImage;
                      if (image && image !== 'https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg') {
                        try {
                          // Add image on the right side of AI Detected Structures
                          const imageWidth = 80;
                          const imageHeight = 60;
                          const imageX = pageWidth - margin - imageWidth;
                          const imageY = y - 45; // Position higher, at the beginning of AI structures
                          doc.addImage(image, "JPEG", imageX, imageY, imageWidth, imageHeight);
                          
                          // Add image caption
                          doc.setFontSize(8);
                          doc.setFont("helvetica", "bold");
                          doc.text("SCAN IMAGE", imageX + (imageWidth / 2), imageY + imageHeight + 3, { align: 'center' });
                        } catch (error) {
                          // console.log("Could not add image to PDF");
                        }
                      }
                      
                      // Clinical Notes
                      if (clinicalNotes && clinicalNotes.trim()) {
                        doc.setFont("helvetica", "bold");
                        doc.text("CLINICAL NOTES", margin, y);
                        y += 6;
                        
                        doc.setFont("helvetica", "normal");
                        const notesLines = doc.splitTextToSize(clinicalNotes, contentWidth);
                        doc.text(notesLines, margin, y);
                        y += notesLines.length * 4;
                        y += 6;
                      }
                      
                      // Footer
                      y += 10;
                      doc.line(margin, y, pageWidth - margin, y);
                      y += 5;
                      
                      doc.setFontSize(8);
                      doc.setFont("helvetica", "normal");
                      doc.text(`Report generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, margin, y);
                      doc.text(`Report ID: ${report.id || report.timestamp}`, pageWidth - margin, y, { align: 'right' });
                      y += 4;
                      doc.text("FOR APPOINTMENTS CONTACT: 7904513421 / 7358771733", pageWidth / 2, y, { align: 'center' });
                      
                      // Save the PDF
                      const fileName = `Fetal_Scan_Report_${patient.name || patient.patientId || 'Unknown'}_${new Date().toISOString().split('T')[0]}.pdf`;
                      doc.save(fileName);
                    });
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Download className="h-3 w-3 mr-1" />
                  PDF
                </button>
                <button 
                  onClick={() => deleteReport(report.id || report.timestamp)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <X className="h-3 w-3 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No draft reports found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Draft reports will appear here before being finalized
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportArchive;
