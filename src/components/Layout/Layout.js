import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useCRM } from '../../context/CRMContext';

const Layout = ({ children }) => {
  const { sidebarCollapsed } = useCRM();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-0' : ''
        }`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;