import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import DataTable from '../components/Common/DataTable';
import Modal from '../components/Common/Modal';
import ConfirmationModal from '../components/Common/ConfirmationModal';

const Enquiry = () => {
  const { getLeadsByStatus, updateLeadStatus, addNoteToLead } = useCRM();
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [statusChangeData, setStatusChangeData] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [quoteAmount, setQuoteAmount] = useState('');

  const enquiries = getLeadsByStatus('Enquiry');

  const columns = [
    { key: 'name', label: 'Lead Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: false },
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

  // FIXED: Separate function for handling quotation with amount
  const handleMoveToQuotation = () => {
    if (quoteAmount && parseFloat(quoteAmount) > 0 && selectedLead) {
      // Directly update the lead status with quote amount
      updateLeadStatus(selectedLead.id, 'Quotation', parseFloat(quoteAmount));
      
      // Close modals and reset
      setShowQuoteModal(false);
      setShowViewModal(false);
      setQuoteAmount('');
      
      console.log(`Moving lead ${selectedLead.name} to Quotation with amount $${quoteAmount}`);
    }
  };

  const handleAddNote = () => {
    if (newNote.trim() && selectedLead) {
      addNoteToLead(selectedLead.id, newNote.trim());
      setNewNote('');
      // Refresh the selected lead to show the new note
      const updatedLead = getLeadsByStatus('Enquiry').find(l => l.id === selectedLead.id);
      if (updatedLead) {
        setSelectedLead(updatedLead);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Enquiry</h1>
        <div className="text-sm text-gray-500">
          {enquiries.length} enquiries
        </div>
      </div>

      <DataTable
        columns={columns}
        data={enquiries}
        onView={(lead) => {
          setSelectedLead(lead);
          setShowViewModal(true);
        }}
      />

      {/* View Enquiry Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Enquiry Details"
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
                    onClick={() => setShowQuoteModal(true)}
                    className="btn-primary w-full"
                  >
                    Move to Quotation
                  </button>
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

            {/* Notes Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Notes & Activities</h3>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedLead.notes && selectedLead.notes.length > 0 ? (
                  selectedLead.notes.map((note) => (
                    <div key={note.id} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-900">{note.text}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        By {note.author} on {new Date(note.timestamp).toLocaleDateString()} at {new Date(note.timestamp).toLocaleTimeString()}
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
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Quote Amount Modal */}
      <Modal
        isOpen={showQuoteModal}
        onClose={() => {
          setShowQuoteModal(false);
          setQuoteAmount('');
        }}
        title="Add Quotation Amount"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quotation Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                value={quoteAmount}
                onChange={(e) => setQuoteAmount(e.target.value)}
                className="input-field w-full pl-8"
                placeholder="Enter amount"
                min="0"
                step="0.01"
                required
                autoFocus
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter the quotation amount to move this lead to quotation stage
            </p>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => {
                setShowQuoteModal(false);
                setQuoteAmount('');
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleMoveToQuotation}
              disabled={!quoteAmount || parseFloat(quoteAmount) <= 0}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Move to Quotation
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal for other status changes */}
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

export default Enquiry;
