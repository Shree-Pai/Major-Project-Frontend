# UltraScan AI - Fetal Parameter Detection & Risk Stratification

A comprehensive clinical ultrasound reporting system with AI-assisted fetal parameter detection and risk stratification capabilities.

## 🏥 Clinical Features

### Core Functionality
- **AI-Powered Fetal Parameter Detection**: Automatic measurement and analysis of fetal structures
- **Clinical Report Generation**: Professional PDF reports with medical standards compliance
- **Risk Stratification**: AI-driven assessment of fetal development risks
- **Data Persistence**: Auto-save functionality with draft recovery
- **Clinical Validation**: Real-time validation of medical parameters
- **Session Management**: Secure session handling with automatic timeout

### Clinical Safety Features
- **Data Validation**: Comprehensive validation of patient and scan data
- **Clinical Warnings**: Real-time alerts for abnormal values
- **Audit Trail**: Complete activity logging for compliance
- **Data Export**: Secure backup and export capabilities
- **Session Security**: Automatic logout and data protection

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fetal-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open `http://localhost:5173` in your browser
   - Login with: `admin@clinic.com` (any password)

## 📋 Clinical Setup Guide

### 1. Initial Configuration

#### Clinic Information Setup
1. Navigate to **Settings** → **Clinic Information**
2. Enter your clinic details:
   - Clinic name and address
   - Contact information
   - Website URL
3. Upload clinic logo for reports
4. Save settings

#### Clinical Settings Configuration
1. Go to **Settings** → **Clinical Settings**
2. Configure:
   - Auto-save interval (1-15 minutes)
   - Session timeout (15-120 minutes)
   - Enable clinical warnings
   - Enable data export
   - Enable audit logging

### 2. User Management
- **Single Admin User**: System configured for single admin access
- **Session Management**: 30-minute default session timeout
- **Security**: Automatic logout on inactivity

### 3. Data Management
- **Local Storage**: All data stored locally in browser
- **Backup**: Export functionality for data backup
- **Privacy**: No external data transmission

## 🏥 Clinical Workflow

### 1. Patient Registration
1. Navigate to **Generate Report**
2. Enter patient information:
   - Patient name and ID (required)
   - Age, sex, visit date
   - Gestational age and LMP date
   - Referring physician

### 2. Scan Image Upload
1. Upload ultrasound scan image
2. Process with AI model
3. Review AI-detected structures
4. Adjust confidence levels if needed

### 3. Report Generation
1. Review all patient and scan data
2. Check for clinical warnings
3. Add clinical notes
4. Generate professional PDF report
5. Save to archive

### 4. Report Management
- **Archive**: Access all previous reports
- **Search**: Find reports by patient name or ID
- **Export**: Download individual or bulk reports
- **Edit**: Modify existing reports

## 📊 Analytics & Monitoring

### Dashboard Features
- **Real-time Statistics**: Live count of reports and activities
- **Performance Metrics**: AI accuracy and processing times
- **Clinical Insights**: Risk distribution and trends
- **Activity Monitoring**: Recent reports and status tracking

### Analytics Dashboard
- **AI Performance**: Accuracy metrics over time
- **Parameter Analysis**: Comparison of AI vs doctor agreement
- **Risk Stratification**: Distribution of risk categories
- **Gestational Trends**: Age-specific analysis

## 🔒 Security & Compliance

### Data Protection
- **Local Storage**: All data stored locally
- **Session Management**: Automatic timeout protection
- **No External Transmission**: Complete privacy control
- **Audit Logging**: Complete activity tracking

### Clinical Validation
- **Parameter Validation**: Medical range checking
- **Clinical Warnings**: Abnormal value alerts
- **Required Fields**: Mandatory data validation
- **Data Integrity**: Comprehensive error handling

## 📁 Project Structure

```
fetal-frontend/
├── src/
│   ├── components/
│   │   ├── Auth/           # Authentication components
│   │   ├── Dashboard/      # Dashboard and analytics
│   │   ├── Reports/        # Report generation and archive
│   │   ├── Analytics/      # Analytics and charts
│   │   ├── Settings/       # System configuration
│   │   └── Layout/         # Header and sidebar
│   ├── contexts/           # React contexts
│   └── main.jsx           # Application entry point
├── package.json
└── README.md
```

## 🛠️ Technical Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with dark mode
- **Charts**: Recharts for analytics
- **PDF Generation**: jsPDF for report creation
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Clinical Deployment Considerations

1. **HTTPS**: Ensure secure connection for clinical use
2. **Backup**: Regular data export and backup procedures
3. **Training**: Staff training on system usage
4. **Support**: Establish support procedures
5. **Updates**: Plan for system updates and maintenance

## 📈 Clinical Benefits

### For Healthcare Providers
- **Efficiency**: Streamlined report generation
- **Accuracy**: AI-assisted parameter detection
- **Compliance**: Standardized reporting format
- **Time Savings**: Automated data entry and validation

### For Patients
- **Quality**: Professional, detailed reports
- **Consistency**: Standardized reporting format
- **Accessibility**: Clear, readable documentation
- **Safety**: Comprehensive validation and warnings

## 🔧 Customization

### Clinic Branding
- Upload clinic logo in Settings
- Customize clinic information
- Configure contact details
- Set up website integration

### Clinical Parameters
- Adjust validation ranges in code
- Modify clinical warning thresholds
- Customize report templates
- Configure AI model parameters

## 📞 Support

### Clinical Support
- **Training**: Comprehensive user training available
- **Documentation**: Detailed clinical workflow guides
- **Updates**: Regular system updates and improvements
- **Backup**: Data backup and recovery procedures

### Technical Support
- **Installation**: Step-by-step setup guidance
- **Configuration**: System customization support
- **Troubleshooting**: Common issue resolution
- **Maintenance**: Regular system maintenance

## 📄 License

This software is designed for clinical use and should be deployed in accordance with local healthcare regulations and data protection requirements.

## ⚠️ Clinical Disclaimer

This software is designed to assist healthcare professionals in fetal ultrasound reporting. It should not replace clinical judgment or professional medical expertise. All reports should be reviewed and validated by qualified healthcare professionals before clinical use.

---

**UltraScan AI** - Empowering healthcare professionals with AI-assisted fetal ultrasound reporting. 