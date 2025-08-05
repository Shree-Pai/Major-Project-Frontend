import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color, change }) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  };

  const isPositive = change.startsWith('+');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`p-2 lg:p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
        </div>
      </div>
      <div className="flex items-center">
        {isPositive ? (
          <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-green-500" />
        ) : (
          <TrendingDown className="h-3 w-3 lg:h-4 lg:w-4 text-red-500" />
        )}
        <span className={`text-xs lg:text-sm font-medium ml-1 ${
          isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {change}
        </span>
        <span className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 ml-2 hidden sm:inline">from last month</span>
      </div>
    </div>
  );
};

export default StatsCard;