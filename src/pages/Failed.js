import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import DataTable from '../components/Common/DataTable';
import Modal from '../components/Common/Modal';
import ConfirmationModal from '../components/Common/ConfirmationModal';
import { XCircle, AlertTriangle, RefreshCw, TrendingDown, Users, Calendar } from 'lucide-react';

const Failed = () => {
  const { getLeadsByStatus, updateLeadStatus, addNoteToLead } = useCRM();
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [statusChangeData, setStatusChangeData] = useState(null);
  const [newNote, setNewNote] = useState('');

  const failedLeads = getLeadsByStatus('Failed');

  // Calculate failure analytics
  const thisMonthFailed = failedLeads.filter(lead => {
    const leadDate = new Date(lead.lastModified);
    const now = new Date();
    return leadDate.getMonth() === now.getMonth() && leadDate.getFullYear() === now.getFullYear();
  });

  const lostRevenue = failedLeads.reduce((sum, lead) => sum + (lead.quoteAmount || 0), 0);

  const failureReasons = [
    { reason: 'Budget constraints', count: Math.floor(failedLeads.length * 0.35) },
    { reason: 'Went with competitor', count: Math.floor(failedLeads.length * 0.25) },
    { reason: 'Project cancelled', count: Math.floor(failedLeads.length * 0.20) },
    { reason: 'No response', count: Math.floor(failedLeads.length * 0.15) },
    { reason: 'Other', count: Math.floor(failedLeads.length * 0.05) }
  ];

  const columns = [
    { key: 'name', label: 'Lead Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: false },
    { 
      key: 'quoteAmount', 
      label: 'Lost Value', 
      sortable: true,
      render: (amount) => (
        <span className="text-red-600 font-medium">
          {amount ? `$${amount.toLocaleString()}` : 'N/A'}
        </span>
      )
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
    { key: 'source', label: 'Source', sortable: true },
    { key: 'assignedTo', label: 'Handled By', sortable: true },
    { 
      key: 'lastModified', 
      label: 'Failed Date', 
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString()
    },
    { 
      key: 'dateCreated', 
      label: 'Lead Duration', 
      sortable: true,
      render: (dateCreated, lead) => {
        const created = new Date(dateCreated);
        const failed = new Date(lead.lastModified);
        const daysDiff = Math.floor((failed - created) / (1000 * 60 * 60 * 24));
        return (
          <div className="text-sm">
            <span className="text-gray-900">{daysDiff} days</span>
          </div>
        );
      }
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
      setSelectedLead(getLeadsByStatus('Failed').find(l => l.id === selectedLead.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Failed Leads</h1>
          <p className="text-gray-600 mt-1">Analyze unsuccessful conversions and learn from them</p>
        </div>
        <div className="text-sm text-gray-500">
          {failedLeads.length} failed conversions
        </div>
      </div>

      {/* Failure Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Failed</p>
              <p className="text-2xl font-semibold text-red-600">{failedLeads.length}</p>
              <p className="text-xs text-red-500 mt-1">Unsuccessful conversions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingDown className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Lost Revenue</p>
              <p className="text-2xl font-semibold text-orange-600">${lostRevenue.toLocaleString()}</p>
              <p className="text-xs text-orange-600 mt-1">Potential value lost</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-semibold text-yellow-600">{thisMonthFailed.length}</p>
              <p className="text-xs text-yellow-600 mt-1">Recent failures</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Recovery Rate</p>
              <p className="text-2xl font-semibold text-blue-600">12%</p>
              <p className="text-xs text-blue-600 mt-1">Successfully recovered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Failure Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Failure Reasons</h3>
          <div className="space-y-3">
            {failureReasons.map((reason, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{reason.reason}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{reason.count}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${(reason.count / failedLeads.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Improvement Opportunities</h3>
          <div className="space-y-3">
            <div className="bg-yellow-50 p-3 rounded-lg">
              <h4 className="font-medium text-yellow-900 text-sm">Budget Concerns</h4>
              <p className="text-yellow-700 text-xs mt-1">Consider flexible pricing options or payment plans</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-900 text-sm">Competitor Analysis</h4>
              <p className="text-blue-700 text-xs mt-1">Study competitor offerings and differentiate better</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <h4 className="font-medium text-purple-900 text-sm">Follow-up Strategy</h4>
              <p className="text-purple-700 text-xs mt-1">Improve response rates with better follow-up timing</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-medium text-green-900 text-sm">Value Proposition</h4>
              <p className="text-green-700 text-xs mt-1">Strengthen unique value proposition presentation</p>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={failedLeads}
        onView={(lead) => {
          setSelectedLead(lead);
          setShowViewModal(true);
        }}
      />

      {/* View Failed Lead Details Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Failed Lead Analysis"
        size="xl"
      >
        {selectedLead && (
          <div className="space-y-6">
            {/* Failure Status Header */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <XCircle className="w-6 h-6 text-red-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900">Lead Failed to Convert</h3>
                  <p className="text-red-700 text-sm">
                    This lead was marked as failed on {new Date(selectedLead.lastModified).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

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
                  <p><span className="font-medium">Handled By:</span> {selectedLead.assignedTo}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Failure Analysis</h3>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-center">
                    <TrendingDown className="w-12 h-12 text-red-600 mx-auto mb-2" />
                    <p className="text-xl font-bold text-red-600">
                      {selectedLead.quoteAmount ? `$${selectedLead.quoteAmount.toLocaleString()}` : 'No Quote'}
                    </p>
                    <p className="text-red-700 text-sm">Potential Value Lost</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Lead Created:</span> {new Date(selectedLead.dateCreated).toLocaleDateString()}</p>
                  <p><span className="font-medium">Failed Date:</span> {new Date(selectedLead.lastModified).toLocaleDateString()}</p>
                  <p><span className="font-medium">Duration:</span> {
                    Math.floor((new Date(selectedLead.lastModified) - new Date(selectedLead.dateCreated)) / (1000 * 60 * 60 * 24))
                  } days in pipeline</p>
                </div>

                {/* Recovery Actions */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Recovery Actions</h4>
                  <button
                    onClick={() => {
                      setStatusChangeData({
                        leadId: selectedLead.id,
                        currentStatus: selectedLead.status,
                        newStatus: 'New'
                      });
                      setShowConfirmModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full flex items-center justify-center"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry as New Lead
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
                </div>
              </div>
            </div>

            {/* Failure Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Lead Journey</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</div>
                    <p className="mt-1 text-blue-700">New Lead</p>
                    <p className="text-xs text-blue-600">{new Date(selectedLead.dateCreated).toLocaleDateString()}</p>
                  </div>
                  <div className="flex-1 h-px bg-gray-300 mx-2"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs">2</div>
                    <p className="mt-1 text-gray-700">Processing</p>
                    <p className="text-xs text-gray-600">...</p>
                  </div>
                  <div className="flex-1 h-px bg-gray-300 mx-2"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-xs">✗</div>
                    <p className="mt-1 text-red-700">Failed</p>
                    <p className="text-xs text-red-600">{new Date(selectedLead.lastModified).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Communication History */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Communication History</h3>

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
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
                    <p className="text-yellow-700 font-medium">Limited Communication</p>
                    <p className="text-yellow-600 text-sm">This may have contributed to the failure. Consider improving follow-up processes.</p>
                  </div>
                )}
              </div>

              {/* Add Post-Failure Note */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Post-Failure Analysis</h4>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add failure reason or analysis note..."
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

            {/* Lessons Learned */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Lessons Learned</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Key Takeaways for Future Leads:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Identify early warning signs of disengagement</li>
                  <li>• Improve qualification process for similar leads</li>
                  <li>• Enhance follow-up strategy timing</li>
                  <li>• Better understand budget constraints upfront</li>
                  <li>• Strengthen competitive positioning</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => handleStatusChange(statusChangeData?.newStatus)}
        title="Confirm Lead Recovery"
        message={statusChangeData ? 
          `Are you sure you want to move "${selectedLead?.name}" from "${statusChangeData.currentStatus}" back to "${statusChangeData.newStatus}"? This will give the lead another chance.` : 
          ''
        }
      />
    </div>
  );
};

export default Failed;