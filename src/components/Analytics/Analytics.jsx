import React, { useState } from 'react';
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
  ScatterChart,
  Scatter,
} from 'recharts';
import { Calendar, TrendingUp, Users, Activity } from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('6months');

  // Mock data for various analytics
  const performanceData = [
    { month: 'Jan', accuracy: 94, processingTime: 2.3, reports: 65 },
    { month: 'Feb', accuracy: 96, processingTime: 2.1, reports: 78 },
    { month: 'Mar', accuracy: 95, processingTime: 2.0, reports: 89 },
    { month: 'Apr', accuracy: 97, processingTime: 1.9, reports: 95 },
    { month: 'May', accuracy: 98, processingTime: 1.8, reports: 102 },
    { month: 'Jun', accuracy: 97, processingTime: 1.7, reports: 118 },
  ];

  const riskDistribution = [
    { name: 'Low Risk', value: 68, color: '#10B981' },
    { name: 'Moderate Risk', value: 22, color: '#F59E0B' },
    { name: 'High Risk', value: 8, color: '#EF4444' },
    { name: 'Critical', value: 2, color: '#DC2626' },
  ];

  const parameterAccuracy = [
    { parameter: 'CRL', aiAccuracy: 96, doctorAgreement: 94 },
    { parameter: 'BPD', aiAccuracy: 94, doctorAgreement: 92 },
    { parameter: 'HC', aiAccuracy: 95, doctorAgreement: 93 },
    { parameter: 'AC', aiAccuracy: 93, doctorAgreement: 91 },
    { parameter: 'FL', aiAccuracy: 97, doctorAgreement: 95 },
    { parameter: 'FHR', aiAccuracy: 99, doctorAgreement: 98 },
  ];

  const gestationalTrends = [
    { week: 12, normal: 45, abnormal: 5 },
    { week: 16, normal: 78, abnormal: 8 },
    { week: 20, normal: 95, abnormal: 12 },
    { week: 24, normal: 87, abnormal: 15 },
    { week: 28, normal: 65, abnormal: 18 },
    { week: 32, normal: 42, abnormal: 12 },
  ];

  const correlationData = [
    { maternalAge: 22, riskScore: 15 },
    { maternalAge: 25, riskScore: 18 },
    { maternalAge: 28, riskScore: 22 },
    { maternalAge: 31, riskScore: 28 },
    { maternalAge: 34, riskScore: 35 },
    { maternalAge: 37, riskScore: 42 },
    { maternalAge: 40, riskScore: 55 },
    { maternalAge: 43, riskScore: 68 },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            AI performance metrics and clinical insights
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Accuracy</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">97.2%</p>
            </div>
            <div className="p-3 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-sm text-green-600 dark:text-green-400 ml-1">+2.1%</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Processing Time</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">1.7s</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <Activity className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-sm text-green-600 dark:text-green-400 ml-1">-0.3s</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">improvement</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Doctor Agreement</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">94.8%</p>
            </div>
            <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-sm text-green-600 dark:text-green-400 ml-1">+1.5%</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Risk Cases</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">10%</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Within normal range</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* AI Performance Over Time */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            AI Performance Metrics
          </h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Accuracy (%)"
                />
                <Line
                  type="monotone"
                  dataKey="processingTime"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Processing Time (s)"
                  yAxisId="right"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Parameter Accuracy Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Parameter Accuracy Analysis
          </h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={parameterAccuracy}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="parameter" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, '']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar 
                  dataKey="aiAccuracy" 
                  fill="#3B82F6" 
                  name="AI Accuracy"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="doctorAgreement" 
                  fill="#10B981" 
                  name="Doctor Agreement"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Risk Stratification Distribution
          </h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
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

        {/* Maternal Age vs Risk Correlation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Maternal Age vs Risk Score
          </h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={correlationData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="maternalAge" 
                  name="Maternal Age"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  dataKey="riskScore" 
                  name="Risk Score"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name) => [
                    value, 
                    name === 'maternalAge' ? 'Age' : 'Risk Score'
                  ]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Scatter 
                  dataKey="riskScore" 
                  fill="#EF4444"
                  name="Risk Score"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gestational Age Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Gestational Age Trends
        </h3>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={gestationalTrends}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="week" 
                tick={{ fontSize: 12 }}
                label={{ value: 'Gestational Week', position: 'insideBottom', offset: -5 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
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
                dataKey="normal"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
                name="Normal Cases"
              />
              <Area
                type="monotone"
                dataKey="abnormal"
                stackId="1"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.6}
                name="Abnormal Cases"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;