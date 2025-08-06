import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import DataTable from '../components/Common/DataTable';
import Modal from '../components/Common/Modal';
import { UserCheck, UserX, Shield } from 'lucide-react';

const UserList = () => {
  const { users, getUsersByRole } = useCRM();
  const [selectedRole, setSelectedRole] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const roleFilters = [
    { key: 'all', label: 'All Users', count: users.length },
    { key: 'Coordinator', label: 'Coordinators', count: users.filter(u => u.role === 'Coordinator').length },
    { key: 'Engineer', label: 'Engineers', count: users.filter(u => u.role === 'Engineer').length },
    { key: 'Admin', label: 'Admins', count: users.filter(u => u.role === 'Admin').length },
    { key: 'Super Admin', label: 'Super Admins', count: users.filter(u => u.role === 'Super Admin').length },
  ];

  const filteredUsers = getUsersByRole(selectedRole);

  const columns = [
    { 
      key: 'avatar', 
      label: 'Photo',
      sortable: false,
      render: (avatar, user) => (
        <img 
          src={avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'} 
          alt={user.name} 
          className="w-10 h-10 rounded-full object-cover"
        />
      )
    },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { 
      key: 'role', 
      label: 'Role', 
      sortable: true,
      render: (role) => (
        <span className={`status-badge ${
          role === 'Super Admin' ? 'bg-purple-100 text-purple-800' :
          role === 'Admin' ? 'bg-red-100 text-red-800' :
          role === 'Coordinator' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {role}
        </span>
      )
    },
    { 
      key: 'active', 
      label: 'Status', 
      sortable: true,
      render: (active) => (
        <div className="flex items-center space-x-1">
          {active ? (
            <>
              <UserCheck className="w-4 h-4 text-green-600" />
              <span className="text-green-600 text-sm">Active</span>
            </>
          ) : (
            <>
              <UserX className="w-4 h-4 text-red-600" />
              <span className="text-red-600 text-sm">Inactive</span>
            </>
          )}
        </div>
      )
    },
    { key: 'tasksAssigned', label: 'Tasks', sortable: true },
    { key: 'leadsCreated', label: 'Leads', sortable: true },
    { 
      key: 'joinDate', 
      label: 'Join Date', 
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString()
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-1">
        <div className="flex flex-wrap gap-1">
          {roleFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedRole(filter.key)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedRole === filter.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {filter.label}
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                selectedRole === filter.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredUsers}
        onView={(user) => {
          setSelectedUser(user);
          setShowViewModal(true);
        }}
      />

      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <img
                src={selectedUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                alt={selectedUser.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h3>
                <p className="text-gray-600">{selectedUser.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`status-badge ${
                    selectedUser.role === 'Super Admin' ? 'bg-purple-100 text-purple-800' :
                    selectedUser.role === 'Admin' ? 'bg-red-100 text-red-800' :
                    selectedUser.role === 'Coordinator' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    <Shield className="w-3 h-3 mr-1" />
                    {selectedUser.role}
                  </span>
                  <span className={`status-badge ${
                    selectedUser.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedUser.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Account Information</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">User ID:</span> #{selectedUser.id}</p>
                  <p><span className="font-medium">Join Date:</span> {new Date(selectedUser.joinDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">Account Status:</span> 
                    <span className={selectedUser.active ? 'text-green-600' : 'text-red-600'}>
                      {selectedUser.active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Work Statistics</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Tasks Assigned:</span> {selectedUser.tasksAssigned}</p>
                  <p><span className="font-medium">Leads Created:</span> {selectedUser.leadsCreated}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserList;