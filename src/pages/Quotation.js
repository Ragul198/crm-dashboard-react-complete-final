import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import DataTable from '../components/Common/DataTable';
import Modal from '../components/Common/Modal';
import ConfirmationModal from '../components/Common/ConfirmationModal';

const Quotation = () => {
  const { getLeadsByStatus, updateLeadStatus, addNoteToLead } = useCRM();
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [statusChangeData, setStatusChangeData] = useState(null);
  const [newNote, setNewNote] = useState('');

  const quotations = getLeadsByStatus('Quotation');

  const columns = [
    { key: 'name', label: 'Lead Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { 
      key: 'quoteAmount', 
      label: 'Quote Amount', 
      sortable: true,
      render: (amount) => amount ? `$${amount.toLocaleString()}` : 'N/A'
    },
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
      setSelectedLead(getLeadsByStatus('Quotation').find(l => l.id === selectedLead.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
        <div className="text-sm text-gray-500">
          {quotations.length} quotations • Total Value: ${quotations.reduce((sum, q) => sum + (q.quoteAmount || 0), 0).toLocaleString()}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={quotations}
        onView={(lead) => {
          setSelectedLead(lead);
          setShowViewModal(true);
        }}
      />

      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Quotation Details"
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
                  <p><span className="font-medium">Quote Amount:</span> 
                    <span className="text-green-600 font-semibold ml-1">
                      {selectedLead.quoteAmount ? `$${selectedLead.quoteAmount.toLocaleString()}` : 'N/A'}
                    </span>
                  </p>
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
                        newStatus: 'Follow-up'
                      });
                      setShowConfirmModal(true);
                    }}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors w-full"
                  >
                    Move to Follow-up
                  </button>
                  <button
                    onClick={() => {
                      setStatusChangeData({
                        leadId: selectedLead.id,
                        currentStatus: selectedLead.status,
                        newStatus: 'Converted'
                      });
                      setShowConfirmModal(true);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full"
                  >
                    Mark as Converted
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Notes</h3>

              <div className="space-y-3 max-h-60 overflow-y-auto">
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
                  placeholder="Add a note about quote discussion..."
                  className="input-field flex-1"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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

export default Quotation;