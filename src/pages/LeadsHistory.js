import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import DataTable from '../components/Common/DataTable';
import { Filter } from 'lucide-react';

const LeadsHistory = () => {
  const { leads } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const allCreators = [...new Set(leads.map(lead => lead.createdBy))];
  const allStatuses = [...new Set(leads.map(lead => lead.status))];

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === '' || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { key: 'name', label: 'Lead Name', sortable: true },
    { 
      key: 'narrative', 
      label: 'Lead History', 
      sortable: false,
      render: (_, lead) => {
        const createdDate = new Date(lead.dateCreated).toLocaleDateString();
        const modifiedDate = new Date(lead.lastModified).toLocaleDateString();
        const daysSinceCreated = Math.floor((new Date() - new Date(lead.dateCreated)) / (1000 * 60 * 60 * 24));

        return (
          <div className="text-sm">
            <p className="font-medium text-gray-900">
              Lead "{lead.name}" was created by coordinator {lead.createdBy} and assigned to engineer {lead.assignedTo} on {createdDate}.
            </p>
            <p className="text-gray-600 mt-1">
              Current status: <span className="font-medium">{lead.status}</span>. 
              Last modified: {modifiedDate} ({daysSinceCreated} days ago).
              {lead.quoteAmount && (
                <span> Quote amount: <span className="text-green-600 font-medium">${lead.quoteAmount.toLocaleString()}</span>.</span>
              )}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Source: {lead.source} • Priority: {lead.priority} • Company: {lead.company}
              {lead.notes && lead.notes.length > 0 && (
                <span> • {lead.notes.length} note{lead.notes.length !== 1 ? 's' : ''}</span>
              )}
            </p>
          </div>
        );
      }
    },
    { 
      key: 'status', 
      label: 'Current Status', 
      sortable: true,
      render: (status) => (
        <span className={`status-badge status-${status.toLowerCase().replace('-', '').replace(' ', '')}`}>
          {status}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads History</h1>
          <p className="text-gray-600 mt-1">Complete timeline and narrative of all leads in the system</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search leads..."
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-full"
            >
              <option value="all">All Statuses</option>
              {allStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredLeads}
        searchable={false}
      />
    </div>
  );
};

export default LeadsHistory;