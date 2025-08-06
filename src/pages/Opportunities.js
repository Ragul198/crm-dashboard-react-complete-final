import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import DataTable from '../components/Common/DataTable';
import Modal from '../components/Common/Modal';
import ConfirmationModal from '../components/Common/ConfirmationModal';

const Opportunities = () => {
  const { getLeadsByStatus, updateLeadStatus, addNoteToLead } = useCRM();
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [statusChangeData, setStatusChangeData] = useState(null);
  const [newNote, setNewNote] = useState('');

  const opportunities = getLeadsByStatus('Opportunity');

  const columns = [
    { key: 'name', label: 'Lead Name', sortable: true },
    { key: 'email', label: 'Contact Info', sortable: true },
    { key: 'source', label: 'Source', sortable: true },
    { 
      key: 'priority', 
      label: 'Priority', 
      sortable: true,
      render: (priority) => (
        <span className={`status-badge priority-${priority.toLowerCase()}`}>
          {priority}
        </span>
      )
    },
    { key: 'assignedTo', label: 'Assigned To', sortable: true },
    { 
      key: 'lastModified', 
      label: 'Last Contact', 
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString()
    },
  ];

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
      setSelectedLead(getLeadsByStatus('Opportunity').find(l => l.id === selectedLead.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
        <div className="text-sm text-gray-500">
          {opportunities.length} opportunities
        </div>
      </div>

      <DataTable
        columns={columns}
        data={opportunities}
        onView={(lead) => {
          setSelectedLead(lead);
          setShowViewModal(true);
        }}
      />

      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Opportunity Details"
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
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setStatusChangeData({
                        leadId: selectedLead.id,
                        currentStatus: selectedLead.status,
                        newStatus: 'Enquiry'
                      });
                      setShowConfirmModal(true);
                    }}
                    className="btn-primary w-full"
                  >
                    Move to Enquiry
                  </button>
                  <button
                    onClick={() => {
                      setStatusChangeData({
                        leadId: selectedLead.id,
                        currentStatus: selectedLead.status,
                        newStatus: 'Failed'
                      });
                      setShowConfirmModal(true);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors w-full"
                  >
                    Mark as Failed
                  </button>
                </div>
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
          `Are you sure you want to change "${selectedLead?.name}" from "${statusChangeData.currentStatus}" to "${statusChangeData.newStatus}"?` : 
          ''
        }
      />
    </div>
  );
};

export default Opportunities;