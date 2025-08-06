import React, { useState, useMemo } from 'react';
import { useCRM } from '../context/CRMContext';
import DataTable from '../components/Common/DataTable';
import Modal from '../components/Common/Modal';
import { Filter } from 'lucide-react';

const LeadsHistory = () => {
  const { leads } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);

  const allCreators = useMemo(() => [...new Set(leads.map(lead => lead.createdBy))], [leads]);
  const allStatuses = useMemo(() => [...new Set(leads.map(lead => lead.status))], [leads]);

  // Generate list of all months in which leads were created
  // Format: YYYY-MM, option label: e.g. "August 2025"
  const allMonths = useMemo(() => {
    const monthsSet = new Set();
    leads.forEach(lead => {
      const d = new Date(lead.dateCreated);
      const monthKey = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      monthsSet.add(monthKey);
    });

    // Sort descending (most recent first)
    const monthArr = Array.from(monthsSet);
    monthArr.sort((a, b) => (a < b ? 1 : -1));
    return monthArr;
  }, [leads]);

  // Utility to convert YYYY-MM to Month Year string
  const formatMonthYear = (ym) => {
    const [year, month] = ym.split('-');
    const date = new Date(year, parseInt(month, 10) - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === '' ||
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    const leadMonth = (() => {
      const d = new Date(lead.dateCreated);
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    })();
    const matchesMonth = monthFilter === 'all' || leadMonth === monthFilter;

    return matchesSearch && matchesStatus && matchesMonth;
  });

  const columns = [
    {
      key: 'name',
      label: 'Lead Name',
      sortable: true,
      // Make name clickable to open modal
      render: (text, lead) => (
        <button
          className="text-blue-600 hover:underline"
          onClick={() => setSelectedLead(lead)}
          type="button"
        >
          {text}
        </button>
      )
    },
    {
      key: 'narrative',
      label: 'Lead History',
      sortable: false,
      render: (_, lead) => {
        const createdDate = new Date(lead.dateCreated).toLocaleDateString();
        const modifiedDate = new Date(lead.lastModified).toLocaleDateString();
        const daysSinceCreated = Math.floor((new Date() - new Date(lead.dateCreated)) / (1000 * 60 * 60 * 24));

        return (
          <div>
            <p className="font-medium text-gray-900">
              Lead &quot;{lead.name}&quot; was created by coordinator {lead.createdBy} and assigned to engineer {lead.assignedTo} on {createdDate}.
            </p>
            <p className="text-gray-600 mt-1">
              Current status: <span className="font-medium">{lead.status}</span>. Last modified: {modifiedDate} ({daysSinceCreated} days ago).
              {lead.quoteAmount && (
                <> Quote amount: <span className="text-green-600 font-medium">${lead.quoteAmount.toLocaleString()}</span>.</>
              )}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Source: {lead.source} • Priority: {lead.priority} • Company: {lead.company}
              {lead.notes && lead.notes.length > 0 && <> • {lead.notes.length} note{lead.notes.length !== 1 ? 's' : ''}</>}
            </p>
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Current Status',
      sortable: true,
      render: status => (
        <span className={`status-badge status-${status.toLowerCase().replace(/[- ]/g,'')}`}>
          {status}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leads History</h1>
          <p className="text-gray-600">Complete timeline of all leads in the system</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="search">Search</label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search leads..."
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="status-filter">Status</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="input-field w-full"
            >
              <option value="all">All Statuses</option>
              {allStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="month-filter">Created Month</label>
            <select
              id="month-filter"
              value={monthFilter}
              onChange={e => setMonthFilter(e.target.value)}
              className="input-field w-full"
            >
              <option value="all">All Months</option>
              {allMonths.map(monthKey => (
                <option key={monthKey} value={monthKey}>{formatMonthYear(monthKey)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredLeads}
        searchable={false}
        // optionally you can provide onRowClick too, but since we added clickable name button it's not necessary
      />

      {/* Lead Details Modal */}
      <Modal
        isOpen={selectedLead !== null}
        onClose={() => setSelectedLead(null)}
        title={selectedLead ? `Details for ${selectedLead.name}` : ''}
        size="lg"
      >
        {selectedLead && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Lead Information</h3>
              <dl className="grid grid-cols-1 gap-y-2 text-sm text-gray-700">
                <div><dt className="font-medium">Name:</dt> <dd>{selectedLead.name}</dd></div>
                <div><dt className="font-medium">Email:</dt> <dd>{selectedLead.email}</dd></div>
                <div><dt className="font-medium">Phone:</dt> <dd>{selectedLead.phone}</dd></div>
                <div><dt className="font-medium">Company:</dt> <dd>{selectedLead.company}</dd></div>
                <div><dt className="font-medium">Created By:</dt> <dd>{selectedLead.createdBy}</dd></div>
                <div><dt className="font-medium">Assigned To:</dt> <dd>{selectedLead.assignedTo}</dd></div>
                <div><dt className="font-medium">Status:</dt> <dd>{selectedLead.status}</dd></div>
                <div><dt className="font-medium">Source:</dt> <dd>{selectedLead.source}</dd></div>
                <div><dt className="font-medium">Priority:</dt> <dd>{selectedLead.priority}</dd></div>
                <div><dt className="font-medium">Created Date:</dt> <dd>{new Date(selectedLead.dateCreated).toLocaleDateString()}</dd></div>
                <div><dt className="font-medium">Last Modified:</dt> <dd>{new Date(selectedLead.lastModified).toLocaleDateString()}</dd></div>
                {selectedLead.quoteAmount && (
                  <div><dt className="font-medium">Quote Amount:</dt> <dd>${selectedLead.quoteAmount.toLocaleString()}</dd></div>
                )}
                {selectedLead.failedReason && (
                  <>
                    <div><dt className="font-medium">Failed Reason:</dt> <dd>{selectedLead.failedReason}</dd></div>
                    {selectedLead.failedMessage && (
                      <div><dt className="font-medium">Failed Message:</dt> <dd>{selectedLead.failedMessage}</dd></div>
                    )}
                  </>
                )}
              </dl>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Notes ({selectedLead.notes ? selectedLead.notes.length : 0})</h3>
              {selectedLead.notes && selectedLead.notes.length > 0 ? (
                <ul className="max-h-60 overflow-y-auto space-y-2 text-sm text-gray-700">
                  {selectedLead.notes
                    .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map(note => (
                      <li key={note.id} className="p-3 bg-gray-50 rounded-md">
                        <p>{note.text}</p>
                        <p className="text-xs text-gray-500">
                          By {note.author} on {new Date(note.timestamp).toLocaleDateString()} at {new Date(note.timestamp).toLocaleTimeString()}
                        </p>
                      </li>
                    ))
                  }
                </ul>
              ) : (
                <p className="text-gray-500 text-sm italic">No notes for this lead.</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LeadsHistory;
