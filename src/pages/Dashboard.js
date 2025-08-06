import React from 'react';
import { Users, Target, TrendingUp, UserCheck } from 'lucide-react';
import { useCRM } from '../context/CRMContext';

const Dashboard = () => {
  const { leads, users, currentUser } = useCRM();

  // Calculate metrics
  const totalLeads = leads.length;
  const followupsToday = leads.filter(lead => lead.status === 'Follow-up').length;
  const convertedLeads = leads.filter(lead => lead.status === 'Converted').length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;
  const activeUsers = users.filter(user => user.active).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {currentUser.name}!
        </h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Leads</p>
              <p className="text-2xl font-semibold text-gray-900">{totalLeads}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Follow-ups Today</p>
              <p className="text-2xl font-semibold text-gray-900">{followupsToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{conversionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserCheck className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-semibold text-gray-900">{activeUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Status Distribution</h3>
          <div className="space-y-3">
            {['New', 'Opportunity', 'Enquiry', 'Quotation', 'Follow-up', 'Converted', 'Failed'].map((status) => {
              const count = leads.filter(lead => lead.status === status).length;
              const percentage = totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(1) : 0;
              return (
                <div key={status} className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full status-${status.toLowerCase().replace('-', '')}`}>
                    {status}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Lead "{lead.name}" created by {lead.createdBy}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(lead.dateCreated).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;