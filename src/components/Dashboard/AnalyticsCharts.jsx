import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AnalyticsCharts = () => {
  // Mock data for charts
  const monthlyReports = [
    { month: 'Jan', reports: 65, aiGenerated: 45, doctorReviewed: 20 },
    { month: 'Feb', reports: 78, aiGenerated: 52, doctorReviewed: 26 },
    { month: 'Mar', reports: 89, aiGenerated: 61, doctorReviewed: 28 },
    { month: 'Apr', reports: 95, aiGenerated: 68, doctorReviewed: 27 },
    { month: 'May', reports: 102, aiGenerated: 74, doctorReviewed: 28 },
    { month: 'Jun', reports: 118, aiGenerated: 85, doctorReviewed: 33 },
  ];

  const gestationalAgeDistribution = [
    { range: '12-16w', count: 45, percentage: 18 },
    { range: '16-20w', count: 78, percentage: 31 },
    { range: '20-24w', count: 65, percentage: 26 },
    { range: '24-28w', count: 42, percentage: 17 },
    { range: '28-32w', count: 20, percentage: 8 },
  ];

  const riskStratification = [
    { name: 'Low Risk', value: 68, color: '#10B981' },
    { name: 'Moderate Risk', value: 22, color: '#F59E0B' },
    { name: 'High Risk', value: 8, color: '#EF4444' },
    { name: 'Critical', value: 2, color: '#DC2626' },
  ];

  const fetalParameters = [
    { parameter: 'CRL', normal: 85, abnormal: 15 },
    { parameter: 'BPD', normal: 92, abnormal: 8 },
    { parameter: 'HC', normal: 88, abnormal: 12 },
    { parameter: 'AC', normal: 90, abnormal: 10 },
    { parameter: 'FL', normal: 87, abnormal: 13 },
    { parameter: 'FHR', normal: 95, abnormal: 5 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      {/* Monthly Reports Trend */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Monthly Reports Trend
        </h3>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyReports}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area
                type="monotone"
                dataKey="reports"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
                name="Total Reports"
              />
              <Area
                type="monotone"
                dataKey="aiGenerated"
                stackId="2"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
                name="AI Generated"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Stratification */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Risk Stratification
        </h3>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskStratification}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {riskStratification.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Percentage']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gestational Age Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Gestational Age Distribution
        </h3>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gestationalAgeDistribution}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="range" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#8B5CF6" 
                radius={[4, 4, 0, 0]}
                name="Number of Scans"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fetal Parameters Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Fetal Parameters Analysis
        </h3>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fetalParameters} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                type="number" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                type="category" 
                dataKey="parameter" 
                className="text-xs"
                tick={{ fontSize: 12 }}
                width={40}
              />
              <Tooltip 
                formatter={(value, name) => [`${value}%`, name === 'normal' ? 'Normal' : 'Abnormal']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar 
                dataKey="normal" 
                stackId="a" 
                fill="#10B981" 
                name="Normal"
                radius={[0, 2, 2, 0]}
              />
              <Bar 
                dataKey="abnormal" 
                stackId="a" 
                fill="#EF4444" 
                name="Abnormal"
                radius={[0, 2, 2, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;