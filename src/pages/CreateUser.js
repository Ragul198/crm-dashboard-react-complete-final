import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { UserPlus, User, Mail, Shield, Calendar, Check, AlertCircle } from 'lucide-react';

const CreateUser = () => {
  const { addUser, users } = useCRM();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Engineer',
    avatar: '',
    department: '',
    phone: '',
    startDate: '',
    manager: '',
    permissions: {
      canCreateLeads: false,
      canAssignLeads: false,
      canViewAllLeads: false,
      canManageUsers: false,
      canAccessReports: false,
      canModifySettings: false
    }
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const roles = [
    {
      value: 'Super Admin',
      label: 'Super Admin',
      description: 'Full system access and user management',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      value: 'Admin',
      label: 'Admin',
      description: 'Administrative access and reporting',
      color: 'bg-red-100 text-red-800'
    },
    {
      value: 'Coordinator',
      label: 'Coordinator',
      description: 'Lead creation and assignment',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      value: 'Engineer',
      label: 'Engineer',
      description: 'Handle assigned leads and opportunities',
      color: 'bg-green-100 text-green-800'
    }
  ];

  const defaultPermissions = {
    'Super Admin': {
      canCreateLeads: true,
      canAssignLeads: true,
      canViewAllLeads: true,
      canManageUsers: true,
      canAccessReports: true,
      canModifySettings: true
    },
    'Admin': {
      canCreateLeads: true,
      canAssignLeads: true,
      canViewAllLeads: true,
      canManageUsers: false,
      canAccessReports: true,
      canModifySettings: false
    },
    'Coordinator': {
      canCreateLeads: true,
      canAssignLeads: true,
      canViewAllLeads: false,
      canManageUsers: false,
      canAccessReports: false,
      canModifySettings: false
    },
    'Engineer': {
      canCreateLeads: false,
      canAssignLeads: false,
      canViewAllLeads: false,
      canManageUsers: false,
      canAccessReports: false,
      canModifySettings: false
    }
  };

  const avatarOptions = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    } else if (users.some(user => user.email.toLowerCase() === formData.email.toLowerCase())) {
      newErrors.email = 'Email already exists';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRoleChange = (newRole) => {
    setFormData({
      ...formData,
      role: newRole,
      permissions: { ...defaultPermissions[newRole] }
    });
  };

  const handlePermissionChange = (permission) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [permission]: !formData.permissions[permission]
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Add the user
    addUser({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      avatar: formData.avatar || avatarOptions[0],
      department: formData.department,
      phone: formData.phone,
      startDate: formData.startDate,
      manager: formData.manager,
      permissions: formData.permissions
    });

    // Show success message
    setShowSuccess(true);

    // Reset form
    setFormData({
      name: '',
      email: '',
      role: 'Engineer',
      avatar: '',
      department: '',
      phone: '',
      startDate: '',
      manager: '',
      permissions: { ...defaultPermissions['Engineer'] }
    });

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const getSelectedRoleInfo = () => {
    return roles.find(role => role.value === formData.role);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
          <p className="text-gray-600 mt-1">Add a new team member to the CRM system</p>
        </div>
        <div className="text-sm text-gray-500">
          Total users: {users.length}
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">User created successfully!</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`input-field w-full ${errors.name ? 'border-red-300' : ''}`}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`input-field w-full ${errors.email ? 'border-red-300' : ''}`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field w-full"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="input-field w-full"
                >
                  <option value="">Select Department</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Customer Success">Customer Success</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Operations">Operations</option>
                  <option value="Administration">Administration</option>
                </select>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Employment Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className={`input-field w-full ${errors.startDate ? 'border-red-300' : ''}`}
                />
                {errors.startDate && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reporting Manager
                </label>
                <select
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  className="input-field w-full"
                >
                  <option value="">Select Manager</option>
                  {users.filter(user => user.role === 'Admin' || user.role === 'Super Admin').map((manager) => (
                    <option key={manager.id} value={manager.name}>
                      {manager.name} ({manager.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Role & Permissions
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Role *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {roles.map((role) => (
                    <div
                      key={role.value}
                      onClick={() => handleRoleChange(role.value)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.role === role.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${role.color}`}>
                            {role.label}
                          </span>
                          <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          formData.role === role.value
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.role === role.value && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role-specific Permissions */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">
                  Permissions for {getSelectedRoleInfo()?.label}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(formData.permissions).map(([permission, value]) => (
                    <div key={permission} className="flex items-center">
                      <input
                        type="checkbox"
                        id={permission}
                        checked={value}
                        onChange={() => handlePermissionChange(permission)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={permission} className="ml-2 text-sm text-gray-700">
                        {permission.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Picture */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Profile Picture
            </h3>

            <div className="space-y-3">
              <p className="text-sm text-gray-600">Choose a profile picture:</p>
              <div className="grid grid-cols-7 gap-3">
                {avatarOptions.map((avatar, index) => (
                  <div
                    key={index}
                    onClick={() => setFormData({ ...formData, avatar })}
                    className={`cursor-pointer rounded-full border-2 transition-all ${
                      formData.avatar === avatar || (!formData.avatar && index === 0)
                        ? 'border-blue-500'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={avatar}
                      alt={`Avatar ${index + 1}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <img
                  src={formData.avatar || avatarOptions[0]}
                  alt="Profile preview"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {formData.name || 'New User'}
                  </h4>
                  <p className="text-gray-600">{formData.email || 'email@company.com'}</p>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                    getSelectedRoleInfo()?.color
                  }`}>
                    {formData.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: '',
                  email: '',
                  role: 'Engineer',
                  avatar: '',
                  department: '',
                  phone: '',
                  startDate: '',
                  manager: '',
                  permissions: { ...defaultPermissions['Engineer'] }
                });
                setErrors({});
              }}
              className="btn-secondary"
            >
              Reset Form
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;