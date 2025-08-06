import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import DataTable from '../components/Common/DataTable';
import Modal from '../components/Common/Modal';
import ConfirmationModal from '../components/Common/ConfirmationModal';

const Opportunities = () => {
  const { getLeadsByStatus, updateLeadStatus, addNoteToLead } = useCRM();
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFailReasonModal, setShowFailReasonModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [statusChangeData, setStatusChangeData] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [failReason, setFailReason] = useState('');
  const [failMessage, setFailMessage] = useState('');

  const opportunities = getLeadsByStatus('Opportunity');

  const failReasons = [
    'Budget constraints',
    'Went with competitor', 
    'Project cancelled',
    'No response',
    'Other'
  ];

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
      if (newStatus === 'Failed') {
        // Open fail reason modal instead of confirming immediately
        setShowConfirmModal(false);
        setShowFailReasonModal(true);
      } else {
        updateLeadStatus(statusChangeData.leadId, newStatus);
        setStatusChangeData(null);
        setShowViewModal(false);
        setShowConfirmModal(false);
      }
    }
  };

  // Handler for confirming failed status with reason and message
  const handleConfirmFailed = () => {
    if (failReason && statusChangeData) {
      // Update lead status to Failed with failure details
      updateLeadStatus(statusChangeData.leadId, 'Failed', null, {
        reason: failReason,
        message: failMessage.trim() || null,
        failedDate: new Date().toISOString()
      });
      
      // Close all modals and reset states
      setShowFailReasonModal(false);
      setShowViewModal(false);
      setStatusChangeData(null);
      setFailReason('');
      setFailMessage('');
      
      console.log(`Lead ${selectedLead?.name} marked as failed. Reason: ${failReason}`);
    }
  };

  // FIXED: Add a note and immediately update the selectedLead state
  const handleAddNote = () => {
    if (newNote.trim() && selectedLead) {
      // Add the note to the lead in the context
      addNoteToLead(selectedLead.id, newNote.trim());
      
      // Create the new note object that will be added
      const newNoteObj = {
        id: (selectedLead.notes?.length || 0) + 1,
        text: newNote.trim(),
        author: 'Current User', // You might want to get this from context
        timestamp: new Date().toISOString()
      };
      
      // Immediately update the selectedLead state to show the new note
      setSelectedLead({
        ...selectedLead,
        notes: [...(selectedLead.notes || []), newNoteObj],
        lastModified: new Date().toISOString()
      });
      
      // Clear the input
      setNewNote('');
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

      {/* View Opportunity Modal */}
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
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newNote.trim()) {
                      handleAddNote();
                    }
                  }}
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

      {/* Failure Reason Modal */}
      <Modal
        isOpen={showFailReasonModal}
        onClose={() => {
          setShowFailReasonModal(false);
          setFailReason('');
          setFailMessage('');
        }}
        title="Reason for Failure"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  You are about to mark this opportunity as <strong>Failed</strong>. Please provide a reason and optional message.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Reason *
            </label>
            <select
              value={failReason}
              onChange={(e) => setFailReason(e.target.value)}
              className="input-field w-full"
              required
              autoFocus
            >
              <option value="">-- Select a reason --</option>
              {failReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Message (Optional)
            </label>
            <textarea
              rows={3}
              value={failMessage}
              onChange={(e) => setFailMessage(e.target.value)}
              className="input-field w-full"
              placeholder="Add any additional details about why this opportunity failed..."
            />
            <p className="text-xs text-gray-500 mt-1">
              This message will be stored with the failed lead for future reference
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={() => {
                setShowFailReasonModal(false);
                setFailReason('');
                setFailMessage('');
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmFailed}
              disabled={!failReason}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mark as Failed
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal for other status changes (Enquiry) */}
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
