import React, { useState, useEffect } from 'react';
import { Save, Download, Eye, Upload, QrCode, X, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

const GenerateReport = () => {
  const saveDraftToArchive = () => {
  const archive = {
    patient,
    scanParameters,
    clinicInfo,
    clinicalNotes,
    aiModelOutput,
    timestamp: new Date().toISOString(),
  };

  const existing = JSON.parse(localStorage.getItem('archivedReports') || '[]');
  existing.push(archive);
  localStorage.setItem('archivedReports', JSON.stringify(existing));
  alert('Draft saved to archive!');
};

  const [patient, setPatient] = useState({
    id: '',
    name: '',
    age: 0,
    patientId: '',
    lmp: '',
    gestationalAge: '',
    sex: '',
    visitDate: new Date().toISOString().split('T')[0],
    referredBy: ''
  });

  const [scanParameters, setScanParameters] = useState({
    crl: 0,
    bpd: 0,
    hc: 0,
    ac: 0,
    fl: 0,
    fhr: 0,
    uterineArteryPI: 0,
  });

  const [clinicInfo, setClinicInfo] = useState({
    name: 'JAMMI SCANS',
    department: 'DEPARTMENT OF FETAL MEDICINE',
    address: 'No:16 Vaidhyaraman Street, Tnagar',
    phone: '+1 (555) 123-4567',
    email: 'info@jammiscans.com',
    website: 'https://jammiscans.com',
  });

  const [clinicalNotes, setClinicalNotes] = useState('');
  const [aiImage, setAiImage] = useState('https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg');
  const [showPreview, setShowPreview] = useState(false);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // AI Model Output State
  const [aiModelOutput, setAiModelOutput] = useState({
    detectedStructures: {
      palate: 52.96,
      'nasal skin': 52.79,
      'nasal bone': 48.64,
      'CM': 41.83,
      'nasal tip': 27.39
    },
    indications: 'First trimester screening',
    scanType: 'Real time B-mode ultrasonography of gravid uterus done',
    route: 'Transabdominal and Transvaginal',
    gestation: 'Single intrauterine gestation',
    fetalActivity: 'Fetal activity present',
    cardiacActivity: 'Cardiac activity present',
    placentaLocation: 'Placenta - Anterior',
    liquorStatus: 'Liquor - Normal'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [clinicalWarnings, setClinicalWarnings] = useState([]);

  // Clinical warning system
  const checkClinicalWarnings = () => {
    const warnings = [];
    
    // Check for abnormal fetal heart rate
    if (scanParameters.fhr < 110 || scanParameters.fhr > 160) {
      warnings.push({
        type: 'warning',
        message: `Abnormal fetal heart rate: ${scanParameters.fhr} bpm (Normal range: 110-160 bpm)`,
        field: 'fhr'
      });
    }
    
    // Check for extreme gestational age
    if (patient.gestationalAge) {
      const weeks = parseInt(patient.gestationalAge.match(/(\d+)w/)?.[1] || '0');
      if (weeks < 8 || weeks > 42) {
        warnings.push({
          type: 'warning',
          message: `Unusual gestational age: ${patient.gestationalAge} (Normal range: 8-42 weeks)`,
          field: 'gestationalAge'
        });
      }
    }
    
    // Check maternal age
    if (patient.age > 35) {
      warnings.push({
        type: 'info',
        message: `Advanced maternal age: ${patient.age} years (Consider additional screening)`,
        field: 'age'
      });
    }
    
    setClinicalWarnings(warnings);
  };

  // Validation functions
  const validatePatientData = () => {
    const errors = {};
    
    if (!patient.name.trim()) {
      errors.patientName = 'Patient name is required';
    }
    
    if (!patient.patientId.trim()) {
      errors.patientId = 'Patient ID is required';
    }
    
    if (patient.age < 12 || patient.age > 60) {
      errors.age = 'Age must be between 12 and 60 years';
    }
    
    if (!patient.sex) {
      errors.sex = 'Sex selection is required';
    }
    
    if (!patient.visitDate) {
      errors.visitDate = 'Visit date is required';
    }
    
    if (!patient.gestationalAge.trim()) {
      errors.gestationalAge = 'Gestational age is required';
    }
    
    if (!patient.lmp) {
      errors.lmp = 'LMP date is required';
    }
    
    return errors;
  };

  const validateScanParameters = () => {
    const errors = {};
    
    if (scanParameters.fhr < 100 || scanParameters.fhr > 200) {
      errors.fhr = 'Fetal heart rate should be between 100-200 bpm';
    }
    
    if (scanParameters.crl < 0 || scanParameters.crl > 100) {
      errors.crl = 'CRL should be between 0-100 mm';
    }
    
    if (scanParameters.bpd < 0 || scanParameters.bpd > 100) {
      errors.bpd = 'BPD should be between 0-100 mm';
    }
    
    return errors;
  };

  const validateForm = () => {
    const patientErrors = validatePatientData();
    const scanErrors = validateScanParameters();
    
    const allErrors = { ...patientErrors, ...scanErrors };
    setValidationErrors(allErrors);
    
    return Object.keys(allErrors).length === 0;
  };

  // Load saved data from localStorage on component mount
  useEffect(() => {
    // First check if there's a selected report from the archive
    const selectedReport = localStorage.getItem('selectedReportForEdit');
    if (selectedReport) {
      try {
        const report = JSON.parse(selectedReport);
        // Load the report data into the form
        if (report.reportData) {
          const reportData = report.reportData;
          if (reportData.patient) setPatient(reportData.patient);
          if (reportData.scanParameters) setScanParameters(reportData.scanParameters);
          if (reportData.clinicInfo) setClinicInfo(reportData.clinicInfo);
          if (reportData.clinicalNotes) setClinicalNotes(reportData.clinicalNotes);
          if (reportData.aiModelOutput) setAiModelOutput(reportData.aiModelOutput);
        }
        // Remove the selected report from localStorage so it's not loaded again
        localStorage.removeItem('selectedReportForEdit');
      } catch (error) {
        console.error('Error parsing selected report:', error);
      }
    } else {
      // If no selected report, load the regular draft
      const savedDraft = localStorage.getItem('fetalReportDraft');
      if (savedDraft) {
        try {
          const draftData = JSON.parse(savedDraft);
          if (draftData.patient) setPatient(draftData.patient);
          if (draftData.scanParameters) setScanParameters(draftData.scanParameters);
          if (draftData.clinicInfo) setClinicInfo(draftData.clinicInfo);
          if (draftData.clinicalNotes) setClinicalNotes(draftData.clinicalNotes);
          if (draftData.aiModelOutput) setAiModelOutput(draftData.aiModelOutput);
          setHasSavedDraft(true);
        } catch (error) {
          console.error('Error parsing saved draft:', error);
        }
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const draftData = {
      patient,
      scanParameters,
      clinicInfo,
      clinicalNotes,
      aiModelOutput
    };
    localStorage.setItem('fetalReportDraft', JSON.stringify(draftData));
    setHasSavedDraft(true);
  }, [patient, scanParameters, clinicInfo, clinicalNotes, aiModelOutput]);

  // Check for clinical warnings when data changes
  useEffect(() => {
    checkClinicalWarnings();
  }, [patient, scanParameters]);

  const handlePatientChange = (field, value) => {
    setPatient(prev => ({ ...prev, [field]: value }));
  };

  const handleScanParameterChange = (field, value) => {
    setScanParameters(prev => ({ ...prev, [field]: value }));
  };

  const handleClinicInfoChange = (field, value) => {
    setClinicInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleAiOutputChange = (field, value) => {
    setAiModelOutput(prev => ({ ...prev, [field]: value }));
  };

  const processImageWithAI = () => {
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setAiModelOutput({
        detectedStructures: {
          palate: 52.96,
          'nasal skin': 52.79,
          'nasal bone': 48.64,
          'CM': 41.83,
          'nasal tip': 27.39
        },
        indications: 'First trimester screening',
        scanType: 'Real time B-mode ultrasonography of gravid uterus done',
        route: 'Transabdominal and Transvaginal',
        gestation: 'Single intrauterine gestation',
        fetalActivity: 'Fetal activity present',
        cardiacActivity: 'Cardiac activity present',
        placentaLocation: 'Placenta - Anterior',
        liquorStatus: 'Liquor - Normal'
      });
      setIsProcessing(false);
    }, 2000);
  };

  const generatePDF = () => {
    if (!validateForm()) {
      alert('Please fix the validation errors before generating the report.');
      return;
    }
    
    setIsSubmitting(true);
    
    import("jspdf").then((jsPDFModule) => {
      const { jsPDF } = jsPDFModule;
      const doc = new jsPDF();
      
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
      
      // Indications Section
      y += 15;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Indication(s)", 12, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.text(aiModelOutput.indications, 12, y);
      
      y += 5;
      doc.text(aiModelOutput.scanType, 12, y);
      y += 5;
      doc.text(`Route: ${aiModelOutput.route}`, 12, y);
      y += 5;
      doc.text(aiModelOutput.gestation, 12, y);
      
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
      doc.text(aiModelOutput.placentaLocation, 12, y);
      y += 5;
      doc.text(aiModelOutput.liquorStatus, 12, y);
      y += 5;
      doc.text(aiModelOutput.fetalActivity, 12, y);
      y += 5;
      doc.text(aiModelOutput.cardiacActivity, 12, y);
      y += 5;
      doc.text(`Fetal heart rate - ${scanParameters.fhr} bpm`, 12, y);
      
    
      
      // AI Detected Structures
      y += 10;
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
        y += lines.length * 5;
      }
      
      // Footer
      doc.setFontSize(8);
      doc.text(`Page #1 - ${new Date().toLocaleString()}`, 12, 280);
      doc.text(`FOR APPOINTMENTS KINDLY CONTACT US AT 7904513421 / 7358771733`, 105, 280, { align: 'center' });
      
      // Add image if available
      if (aiImage) {
        try {
          doc.addImage(aiImage, "JPEG", 130, 80, 60, 60);
        } catch (error) {
          console.log("Could not add image to PDF");
        }
      }
      
      doc.save("fetal_scan_report.pdf");
    });
  };

  const ReportPreview = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Report Preview</h3>
          <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="text-center border-b pb-4">
            <h1 className="text-xl font-bold">{clinicInfo.name}</h1>
            <p className="text-sm">{clinicInfo.department}</p>
            <p className="text-sm">{clinicInfo.address}</p>
          </div>
          
          {/* Patient Info */}
          <div className="grid grid-cols-2 gap-4 p-4 border rounded">
            <div>
              <strong>Patient Name:</strong> {patient.name}
            </div>
            <div>
              <strong>Age/Sex:</strong> {patient.age} Years / {patient.sex}
            </div>
            <div>
              <strong>Patient ID:</strong> {patient.patientId}
            </div>
            <div>
              <strong>Visit Date:</strong> {patient.visitDate}
            </div>
          </div>
          
          {/* AI Results */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
            <h3 className="font-semibold mb-2">AI Detected Structures</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(aiModelOutput.detectedStructures).map(([structure, confidence]) => (
                <div key={structure}>
                  {structure}: {confidence}% confidence
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {showPreview && <ReportPreview />}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Generate Professional Report</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Create a professional ultrasound fetal scan report with AI assistance
            </p>
            {hasSavedDraft && (
              <div className="mt-2 flex items-center text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4 mr-1" />
                Draft auto-saved
              </div>
            )}
          </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowPreview(true)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </button>
          <button
            onClick={generatePDF}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Generate PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Patient Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Patient Information</h2>
          <div className="space-y-3 lg:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={patient.name}
                  onChange={(e) => handlePatientChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter patient name"
                />
                {validationErrors.patientName && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.patientName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Patient ID
                </label>
                <input
                  type="text"
                  value={patient.patientId}
                  onChange={(e) => handlePatientChange('patientId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter patient ID"
                />
                {validationErrors.patientId && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.patientId}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={patient.age || ''}
                  onChange={(e) => handlePatientChange('age', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Age"
                />
                {validationErrors.age && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.age}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sex
                </label>
                <select
                  value={patient.sex}
                  onChange={(e) => handlePatientChange('sex', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
                {validationErrors.sex && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.sex}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Visit Date
                </label>
                <input
                  type="date"
                  value={patient.visitDate}
                  onChange={(e) => handlePatientChange('visitDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {validationErrors.visitDate && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.visitDate}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gestational Age
                </label>
                <input
                  type="text"
                  value={patient.gestationalAge}
                  onChange={(e) => handlePatientChange('gestationalAge', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 20w 3d"
                />
                {validationErrors.gestationalAge && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.gestationalAge}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Referred By
                </label>
                <input
                  type="text"
                  value={patient.referredBy}
                  onChange={(e) => handlePatientChange('referredBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Doctor name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Menstrual Period (LMP)
              </label>
              <input
                type="date"
                value={patient.lmp}
                onChange={(e) => handlePatientChange('lmp', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {validationErrors.lmp && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.lmp}</p>
              )}
            </div>
          </div>
        </div>

        {/* Upload and Process Image */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Upload & Process Scan Image</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              {aiImage ? (
                <div>
                  <img src={aiImage} alt="Uploaded Fetal Scan" className="mx-auto rounded-lg shadow-md mb-4 max-h-48" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Uploaded fetal scan image</p>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No image uploaded yet</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setAiImage(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg"
            />
            <button
              onClick={processImageWithAI}
              disabled={!aiImage || isProcessing}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <AlertCircle className="h-4 w-4 mr-2 animate-spin" />
                  Processing with AI...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Process with AI Model
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Model Output */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">AI Model Output</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Detected Structures
              </label>
              <div className="space-y-2">
                {Object.entries(aiModelOutput.detectedStructures).map(([structure, confidence]) => (
                  <div key={structure} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm font-medium">{structure}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        value={confidence}
                        onChange={(e) => {
                          const newStructures = { ...aiModelOutput.detectedStructures };
                          newStructures[structure] = parseFloat(e.target.value) || 0;
                          setAiModelOutput(prev => ({ ...prev, detectedStructures: newStructures }));
                        }}
                        className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                      />
                      <span className="text-sm text-gray-500">% confidence</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Indications
                </label>
                <input
                  type="text"
                  value={aiModelOutput.indications}
                  onChange={(e) => handleAiOutputChange('indications', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Scan Type
                </label>
                <input
                  type="text"
                  value={aiModelOutput.scanType}
                  onChange={(e) => handleAiOutputChange('scanType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        
        {/* Clinic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Clinic Information</h2>
          <div className="space-y-3 lg:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Clinic Name
              </label>
              <input
                type="text"
                value={clinicInfo.name}
                onChange={(e) => handleClinicInfoChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <textarea
                value={clinicInfo.address}
                onChange={(e) => handleClinicInfoChange('address', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={clinicInfo.phone}
                  onChange={(e) => handleClinicInfoChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={clinicInfo.email}
                  onChange={(e) => handleClinicInfoChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Website URL
              </label>
              <input
                type="url"
                value={clinicInfo.website}
                onChange={(e) => handleClinicInfoChange('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://yourwebsite.com"
              />
            </div>
            <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <QrCode className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-700 dark:text-blue-300">
                QR code will be automatically generated for clinic location/website
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Warnings */}
      {clinicalWarnings.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            Clinical Warnings
          </h2>
          <div className="space-y-2">
            {clinicalWarnings.map((warning, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${
                warning.type === 'warning' 
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 text-yellow-800 dark:text-yellow-200'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 text-blue-800 dark:text-blue-200'
              }`}>
                <p className="text-sm font-medium">{warning.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clinical Notes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Clinical Notes</h2>
        <textarea
          value={clinicalNotes}
          onChange={(e) => setClinicalNotes(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter any additional clinical observations or notes..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
        <button
          onClick={() => {
            // Clear the saved draft
            localStorage.removeItem('fetalReportDraft');
            // Reset all form data
            setPatient({
              id: '',
              name: '',
              age: 0,
              patientId: '',
              lmp: '',
              gestationalAge: '',
              sex: '',
              visitDate: new Date().toISOString().split('T')[0],
              referredBy: ''
            });
            setScanParameters({
              crl: 0,
              bpd: 0,
              hc: 0,
              ac: 0,
              fl: 0,
              fhr: 0,
              uterineArteryPI: 0,
            });
            setClinicalNotes('');
            setAiModelOutput({
              detectedStructures: {
                palate: 52.96,
                'nasal skin': 52.79,
                'nasal bone': 48.64,
                'CM': 41.83,
                'nasal tip': 27.39
              },
              indications: 'First trimester screening',
              scanType: 'Real time B-mode ultrasonography of gravid uterus done',
              route: 'Transabdominal and Transvaginal',
              gestation: 'Single intrauterine gestation',
              fetalActivity: 'Fetal activity present',
              cardiacActivity: 'Cardiac activity present',
              placentaLocation: 'Placenta - Anterior',
              liquorStatus: 'Liquor - Normal'
            });
            setHasSavedDraft(false);
            alert('Draft cleared successfully!');
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          <X className="h-4 w-4 mr-2" />
          Clear Draft
        </button>
        <button
          onClick={saveDraftToArchive}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </button>
        <button
          onClick={saveAsFinalReport}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Save Final Report
        </button>
        <button
          onClick={generatePDF}
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          <Download className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Generating...' : 'Generate PDF'}
        </button>
      </div>
    </div>
  );
};

export default GenerateReport;