import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Target, 
  MessageCircle, 
  FileText, 
  Phone, 
  CheckCircle, 
  XCircle, 
  UserPlus, 
  UserCheck, 
  History, 
  Activity,
  LogOut
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

const Sidebar = () => {
  const { sidebarCollapsed } = useCRM();

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Leads', path: '/leads', icon: Users },
    { name: 'Opportunities', path: '/opportunities', icon: Target },
    { name: 'Enquiry', path: '/enquiry', icon: MessageCircle },
    { name: 'Quotation', path: '/quotation', icon: FileText },
    { name: 'Follow-up', path: '/follow-up', icon: Phone },
    { name: 'Converted', path: '/converted', icon: CheckCircle },
    { name: 'Failed', path: '/failed', icon: XCircle },
    { name: 'Create User', path: '/create-user', icon: UserPlus },
    { name: 'User List', path: '/user-list', icon: UserCheck },
    { name: 'Leads History', path: '/leads-history', icon: History },
    { name: 'Activity Logs', path: '/activity-logs', icon: Activity },
  ];

  return (
    <aside className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    } flex flex-col`}>
      <div className="p-6">
        {!sidebarCollapsed && (
          <h2 className="text-xl font-semibold text-gray-900">Navigation</h2>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                } ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`
              }
              title={sidebarCollapsed ? item.name : ''}
            >
              <IconComponent className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button className={`flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
          sidebarCollapsed ? 'justify-center' : 'space-x-3'
        }`}>
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;