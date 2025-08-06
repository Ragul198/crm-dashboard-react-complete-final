import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import DataTable from '../components/Common/DataTable';
import Modal from '../components/Common/Modal';
import ConfirmationModal from '../components/Common/ConfirmationModal';

const Leads = () => {
  const { getLeadsByStatus, users, addLead, updateLeadStatus, addNoteToLead } = useCRM();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [statusChangeData, setStatusChangeData] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'Website',
    priority: 'Medium',
    assignedTo: '',
    notes: ''
  });

  const leads = getLeadsByStatus(['New']);
  const engineers = users.filter(user => user.role === 'Engineer');

  const columns = [
    { key: 'name', label: 'Lead Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: false },
    { key: 'source', label: 'Source', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (status) => (
        <span className={`status-badge status-${status.toLowerCase().replace('-', '').replace(' ', '')}`}>
          {status}
        </span>
      )
    },
    { key: 'assignedTo', label: 'Assigned To', sortable: true },
    { 
      key: 'dateCreated', 
      label: 'Date Created', 
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString()
    },
  ];

  const handleAddLead = (e) => {
    e.preventDefault();
    addLead({
      ...formData,
      status: 'New',
      createdBy: 'Current User'
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      source: 'Website',
      priority: 'Medium',
      assignedTo: '',
      notes: ''
    });
    setShowAddModal(false);
  };

  const handleStatusChange = (newStatus) => {
    if (statusChangeData) {
      updateLeadStatus(statusChangeData.leadId, newStatus);
      setStatusChangeData(null);
      setShowViewModal(false);
    }
  };

  const handleAddNote = () => {
    if (newNote.trim() && selectedLead) {
      addNoteToLead(selectedLead.id, newNote.trim());
      setNewNote('');
      setSelectedLead(getLeadsByStatus(['New']).find(l => l.id === selectedLead.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Lead</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={leads}
        onView={(lead) => {
          setSelectedLead(lead);
          setShowViewModal(true);
        }}
      />

      {/* Add Lead Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Lead"
        size="lg"
      >
        <form onSubmit={handleAddLead} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company/Lead Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="input-field w-full"
              >
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Email Campaign">Email Campaign</option>
                <option value="Trade Show">Trade Show</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="input-field w-full"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign to Engineer *
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="input-field w-full"
                required
              >
                <option value="">Select Engineer</option>
                {engineers.map((engineer) => (
                  <option key={engineer.id} value={engineer.name}>
                    {engineer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Lead
            </button>
          </div>
        </form>
      </Modal>

      {/* View Lead Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Lead Details"
        size="xl"
      >
        {selectedLead && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Lead Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedLead.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedLead.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedLead.phone}</p>
                  <p><span className="font-medium">Company:</span> {selectedLead.company}</p>
                  <p><span className="font-medium">Source:</span> {selectedLead.source}</p>
                  <p><span className="font-medium">Priority:</span> {selectedLead.priority}</p>
                  <p><span className="font-medium">Assigned To:</span> {selectedLead.assignedTo}</p>
                  <p><span className="font-medium">Status:</span> {selectedLead.status}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
                {selectedLead.status === 'New' && (
                  <button
                    onClick={() => {
                      setStatusChangeData({
                        leadId: selectedLead.id,
                        currentStatus: selectedLead.status,
                        newStatus: 'Opportunity'
                      });
                      setShowConfirmModal(true);
                    }}
                    className="btn-primary w-full"
                  >
                    Move to Opportunity
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Notes</h3>

              <div className="space-y-3">
                {selectedLead.notes && selectedLead.notes.length > 0 ? (
                  selectedLead.notes.map((note) => (
                    <div key={note.id} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-900">{note.text}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        By {note.author} on {new Date(note.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No notes yet</p>
                )}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="input-field flex-1"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="btn-primary"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => handleStatusChange(statusChangeData?.newStatus)}
        title="Confirm Status Change"
        message={statusChangeData ? 
          `Are you sure you want to change this lead from "${statusChangeData.currentStatus}" to "${statusChangeData.newStatus}"?` : 
          ''
        }
      />
    </div>
  );
};

export default Leads;