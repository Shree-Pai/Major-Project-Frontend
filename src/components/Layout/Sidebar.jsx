import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Archive, BarChart3, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen = true, onClose }) => {
  const { user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'generate-report', label: 'Generate Report', icon: FileText, path: '/generate-report' },
    { id: 'archive', label: 'Report Archive', icon: Archive, path: '/archive' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 shadow-lg h-full w-64 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } fixed lg:static z-30`}>
      <nav className="mt-4 lg:mt-8 px-4">
        <div className="lg:hidden mb-4">
          <button onClick={onClose} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="sr-only">Close sidebar</span>
            ✕
          </button>
        </div>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
