import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import DataTable from '../components/Common/DataTable';
import Modal from '../components/Common/Modal';
import ConfirmationModal from '../components/Common/ConfirmationModal';
import { Phone, Calendar, Clock, AlertCircle } from 'lucide-react';

const FollowUp = () => {
  const { getLeadsByStatus, updateLeadStatus, addNoteToLead } = useCRM();
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFailReasonModal, setShowFailReasonModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [statusChangeData, setStatusChangeData] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [failReason, setFailReason] = useState('');
  const [failMessage, setFailMessage] = useState('');

  const followUps = getLeadsByStatus('Follow-up');

  const failReasons = [
    'Budget constraints',
    'Went with competitor', 
    'Project cancelled',
    'No response',
    'Other'
  ];

  const columns = [
    { key: 'name', label: 'Lead Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: false },
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
      render: (date) => {
        const daysSince = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
        return (
          <div className="text-sm">
            <p>{new Date(date).toLocaleDateString()}</p>
            <p className={`text-xs flex items-center ${
              daysSince > 7 ? 'text-red-600' : daysSince > 3 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {daysSince > 7 && <AlertCircle className="w-3 h-3 mr-1" />}
              {daysSince} days ago
              {daysSince > 7 && ' (Overdue)'}
            </p>
          </div>
        );
      }
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

  const handleAddNote = () => {
    if (newNote.trim() && selectedLead) {
      addNoteToLead(selectedLead.id, newNote.trim());
      setNewNote('');
      const updatedLead = getLeadsByStatus('Follow-up').find(l => l.id === selectedLead.id);
      if (updatedLead) {
        setSelectedLead(updatedLead);
      }
    }
  };

  const overdueLeads = followUps.filter(lead => {
    const daysSince = Math.floor((new Date() - new Date(lead.lastModified)) / (1000 * 60 * 60 * 24));
    return daysSince > 7;
  });

  const dueSoonLeads = followUps.filter(lead => {
    const daysSince = Math.floor((new Date() - new Date(lead.lastModified)) / (1000 * 60 * 60 * 24));
    return daysSince >= 3 && daysSince <= 7;
  });

  const recentLeads = followUps.filter(lead => {
    const daysSince = Math.floor((new Date() - new Date(lead.lastModified)) / (1000 * 60 * 60 * 24));
    return daysSince < 3;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Follow-up Leads</h1>
          <p className="text-gray-600 mt-1">Track and manage leads requiring follow-up actions</p>
        </div>
        <div className="text-sm text-gray-500">
          {followUps.length} leads requiring follow-up
        </div>
      </div>

      {/* Follow-up Priority Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Overdue (7+ days)</p>
              <p className="text-2xl font-semibold text-red-600">{overdueLeads.length}</p>
              <p className="text-xs text-red-500 mt-1">Immediate attention needed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Due Soon (3-7 days)</p>
              <p className="text-2xl font-semibold text-yellow-600">{dueSoonLeads.length}</p>
              <p className="text-xs text-yellow-600 mt-1">Schedule follow-up</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Recent (&lt;3 days)</p>
              <p className="text-2xl font-semibold text-green-600">{recentLeads.length}</p>
              <p className="text-xs text-green-600 mt-1">On track</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {overdueLeads.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="text-sm font-medium text-red-800">
              {overdueLeads.length} overdue follow-up{overdueLeads.length !== 1 ? 's' : ''} require immediate attention
            </h3>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={followUps}
        onView={(lead) => {
          setSelectedLead(lead);
          setShowViewModal(true);
        }}
      />

      {/* View Follow-up Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Follow-up Lead Details"
        size="xl"
      >
        {selectedLead && (
          <div className="space-y-6">
            {/* Follow-up Status Alert */}
            {(() => {
              const daysSince = Math.floor((new Date() - new Date(selectedLead.lastModified)) / (1000 * 60 * 60 * 24));
              if (daysSince > 7) {
                return (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                      <span className="text-red-800 font-medium">
                        Overdue! Last contact was {daysSince} days ago
                      </span>
                    </div>
                  </div>
                );
              } else if (daysSince > 3) {
                return (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                      <span className="text-yellow-800 font-medium">
                        Due for follow-up - Last contact was {daysSince} days ago
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Lead Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedLead.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedLead.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedLead.phone}</p>
                  <p><span className="font-medium">Company:</span> {selectedLead.company}</p>
                  <p><span className="font-medium">Priority:</span> {selectedLead.priority}</p>
                  <p><span className="font-medium">Assigned To:</span> {selectedLead.assignedTo}</p>
                  {selectedLead.quoteAmount && (
                    <p><span className="font-medium">Quote Amount:</span> 
                      <span className="text-green-600 font-semibold ml-1">
                        ${selectedLead.quoteAmount.toLocaleString()}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Follow-up Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setStatusChangeData({
                        leadId: selectedLead.id,
                        currentStatus: selectedLead.status,
                        newStatus: 'Converted'
                      });
                      setShowConfirmModal(true);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full flex items-center justify-center"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Mark as Converted
                  </button>

                  <button
                    onClick={() => {
                      setStatusChangeData({
                        leadId: selectedLead.id,
                        currentStatus: selectedLead.status,
                        newStatus: 'Quotation'
                      });
                      setShowConfirmModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
                  >
                    Move Back to Quotation
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
              <h3 className="text-lg font-semibold text-gray-900">Follow-up Notes</h3>

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
                  <p className="text-gray-500 text-sm">No follow-up notes yet</p>
                )}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add follow-up note (call result, next steps, etc.)..."
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
                  You are about to mark this follow-up lead as <strong>Failed</strong>. Please provide a reason and optional message.
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
              placeholder="Add any additional details about why this follow-up failed..."
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

export default FollowUp;
