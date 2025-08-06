import React, { useState } from 'react';
import { Menu, Bell, Sun, ChevronDown, User, Lock, LogOut } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

const Header = () => {
  const { currentUser, toggleSidebar } = useCRM();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">CRMPro</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search leads, contacts..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Sun className="w-6 h-6 text-gray-600" />
          </button>

          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-gray-700 font-medium">{currentUser.name}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowUserDropdown(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>View Profile</span>
                </button>
                <button
                  onClick={() => {
                    setShowPasswordModal(true);
                    setShowUserDropdown(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  <span>Change Password</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left transition-colors">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <h2 className="text-xl font-bold mb-4">User Profile</h2>
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={currentUser.avatar}
                alt="User Avatar"
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{currentUser.name}</h3>
                <p className="text-gray-600">{currentUser.role}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p><span className="font-medium">Email:</span> {currentUser.email}</p>
              <p><span className="font-medium">Join Date:</span> {currentUser.joinDate}</p>
              <p><span className="font-medium">Leads Created:</span> {currentUser.leadsCreated}</p>
              <p><span className="font-medium">Tasks Assigned:</span> {currentUser.tasksAssigned}</p>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowProfileModal(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full input-field"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full input-field"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full input-field"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="btn-primary"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;