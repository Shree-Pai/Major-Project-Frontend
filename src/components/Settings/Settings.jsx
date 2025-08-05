import React, { useState, useEffect } from 'react';
import { Save, Upload, Building, Mail, Phone, Globe, QrCode, Download, Database, Shield, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [clinicInfo, setClinicInfo] = useState({
    name: 'Advanced Maternal Care Center',
    address: '123 Medical Plaza, Suite 200',
    city: 'Medical City',
    state: 'State',
    zipCode: '12345',
    phone: '+1 (555) 123-4567',
    email: 'info@maternalcare.com',
    website: 'https://maternalcare.com',
    logo: null,
  });

  const [notifications, setNotifications] = useState({
    emailReports: true,
    smsAlerts: false,
    reportReady: true,
    weeklyDigest: true,
  });

  const [clinicalSettings, setClinicalSettings] = useState({
    autoSaveInterval: 5, // minutes
    sessionTimeout: 30, // minutes
    enableClinicalWarnings: true,
    enableDataExport: true,
    enableAuditLog: true,
    backupFrequency: 'daily',
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedClinicInfo = localStorage.getItem('clinicInfo');
    const savedNotifications = localStorage.getItem('notificationSettings');
    const savedClinicalSettings = localStorage.getItem('clinicalSettings');
    
    if (savedClinicInfo) {
      setClinicInfo(JSON.parse(savedClinicInfo));
    }
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    if (savedClinicalSettings) {
      setClinicalSettings(JSON.parse(savedClinicalSettings));
    }
  }, []);

  const handleClinicInfoChange = (field, value) => {
    setClinicInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field, value) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const handleClinicalSettingChange = (field, value) => {
    setClinicalSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setClinicInfo(prev => ({ ...prev, logo: file }));
    }
  };

  const handleSave = () => {
    // Save all settings to localStorage
    localStorage.setItem('clinicInfo', JSON.stringify(clinicInfo));
    localStorage.setItem('notificationSettings', JSON.stringify(notifications));
    localStorage.setItem('clinicalSettings', JSON.stringify(clinicalSettings));
    
    alert('Settings saved successfully!');
  };

  const handleExportData = () => {
    const reports = JSON.parse(localStorage.getItem('fetalReportsArchive') || '[]');
    const dataStr = JSON.stringify(reports, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fetal_reports_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBackupData = () => {
    const allData = {
      reports: JSON.parse(localStorage.getItem('fetalReportsArchive') || '[]'),
      clinicInfo: clinicInfo,
      settings: {
        notifications,
        clinicalSettings
      },
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ultrascan_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your clinic information and preferences
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportData}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
          <button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Clinic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <div className="flex items-center mb-4">
            <Building className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Clinic Information</h2>
          </div>
          
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
                Street Address
              </label>
              <input
                type="text"
                value={clinicInfo.address}
                onChange={(e) => handleClinicInfoChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={clinicInfo.city}
                  onChange={(e) => handleClinicInfoChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={clinicInfo.state}
                  onChange={(e) => handleClinicInfoChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                value={clinicInfo.zipCode}
                onChange={(e) => handleClinicInfoChange('zipCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <div className="flex items-center mb-4">
            <Phone className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Information</h2>
          </div>
          
          <div className="space-y-3 lg:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Phone className="h-4 w-4 inline mr-1" />
                Phone Number
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
                <Mail className="h-4 w-4 inline mr-1" />
                Email Address
              </label>
              <input
                type="email"
                value={clinicInfo.email}
                onChange={(e) => handleClinicInfoChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Globe className="h-4 w-4 inline mr-1" />
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Clinic Logo
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Upload your clinic logo for reports
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-400"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <QrCode className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-700 dark:text-blue-300">
                QR codes will automatically link to your website
              </span>
            </div>
          </div>
        </div>

        {/* Clinical Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Clinical Settings</h2>
          </div>
          
          <div className="space-y-3 lg:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Auto-save Interval (minutes)
              </label>
              <select
                value={clinicalSettings.autoSaveInterval}
                onChange={(e) => handleClinicalSettingChange('autoSaveInterval', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1}>1 minute</option>
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Session Timeout (minutes)
              </label>
              <select
                value={clinicalSettings.sessionTimeout}
                onChange={(e) => handleClinicalSettingChange('sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Clinical Warnings
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Show warnings for abnormal values
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={clinicalSettings.enableClinicalWarnings}
                    onChange={(e) => handleClinicalSettingChange('enableClinicalWarnings', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Data Export
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Allow exporting patient data
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={clinicalSettings.enableDataExport}
                    onChange={(e) => handleClinicalSettingChange('enableDataExport', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Audit Log
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Track all system activities
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={clinicalSettings.enableAuditLog}
                    onChange={(e) => handleClinicalSettingChange('enableAuditLog', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h2>
          
          <div className="space-y-3 lg:space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-start sm:items-center justify-between gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                    {key === 'emailReports' && 'Email new reports'}
                    {key === 'smsAlerts' && 'SMS alerts for urgent cases'}
                    {key === 'reportReady' && 'Notify when AI analysis is ready'}
                    {key === 'weeklyDigest' && 'Weekly activity digest'}
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {key === 'emailReports' && 'Send completed reports via email'}
                    {key === 'smsAlerts' && 'Receive SMS for high-risk cases'}
                    {key === 'reportReady' && 'Get notified when AI processing completes'}
                    {key === 'weeklyDigest' && 'Summary of weekly clinic activity'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleNotificationChange(key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">User Profile</h2>
          
          <div className="space-y-3 lg:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={user?.name || ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <input
                type="text"
                value={user?.role || ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white capitalize"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Clinic
              </label>
              <input
                type="text"
                value={user?.clinicName || ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Login
              </label>
              <input
                type="text"
                value={user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <div className="flex items-center mb-4">
            <Database className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Data Management</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Backup & Export</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Export your clinic data for backup or transfer purposes.
              </p>
              <button
                onClick={handleBackupData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Create Full Backup
              </button>
            </div>
            
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h3 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Data Statistics</h3>
              <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <p>Total Reports: {JSON.parse(localStorage.getItem('fetalReportsArchive') || '[]').length}</p>
                <p>Storage Used: ~{Math.round(JSON.stringify(localStorage.getItem('fetalReportsArchive') || '[]').length / 1024)} KB</p>
                <p>Last Backup: Never</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;