import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import DataTable from '../components/Common/DataTable';
import Modal from '../components/Common/Modal';
import { CheckCircle, DollarSign, Calendar, TrendingUp, Award, Users } from 'lucide-react';

const Converted = () => {
  const { getLeadsByStatus } = useCRM();
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const convertedLeads = getLeadsByStatus('Converted');

  // Calculate conversion metrics
  const totalRevenue = convertedLeads.reduce((sum, lead) => sum + (lead.quoteAmount || 0), 0);
  const averageDealSize = convertedLeads.length > 0 ? totalRevenue / convertedLeads.length : 0;
  const thisMonthConverted = convertedLeads.filter(lead => {
    const leadDate = new Date(lead.lastModified);
    const now = new Date();
    return leadDate.getMonth() === now.getMonth() && leadDate.getFullYear() === now.getFullYear();
  });

  const columns = [
    { key: 'name', label: 'Client Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: false },
    { 
      key: 'quoteAmount', 
      label: 'Deal Value', 
      sortable: true,
      render: (amount) => (
        <span className="text-green-600 font-semibold">
          {amount ? `$${amount.toLocaleString()}` : 'N/A'}
        </span>
      )
    },
    { key: 'source', label: 'Source', sortable: true },
    { key: 'assignedTo', label: 'Closed By', sortable: true },
    { 
      key: 'lastModified', 
      label: 'Conversion Date', 
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString()
    },
    { 
      key: 'dateCreated', 
      label: 'Lead Age', 
      sortable: true,
      render: (dateCreated, lead) => {
        const created = new Date(dateCreated);
        const converted = new Date(lead.lastModified);
        const daysDiff = Math.floor((converted - created) / (1000 * 60 * 60 * 24));
        return (
          <div className="text-sm">
            <span className="text-gray-900">{daysDiff} days</span>
            {daysDiff < 30 && <span className="text-green-600 text-xs ml-1">Fast!</span>}
          </div>
        );
      }
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Converted Leads</h1>
          <p className="text-gray-600 mt-1">Successfully closed deals and converted clients</p>
        </div>
        <div className="text-sm text-gray-500">
          {convertedLeads.length} successful conversions
        </div>
      </div>

      {/* Success Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Converted</p>
              <p className="text-2xl font-semibold text-green-600">{convertedLeads.length}</p>
              <p className="text-xs text-green-600 mt-1">Successful deals</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-blue-600">${totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-blue-600 mt-1">Closed deals value</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Deal Size</p>
              <p className="text-2xl font-semibold text-yellow-600">${averageDealSize.toLocaleString()}</p>
              <p className="text-xs text-yellow-600 mt-1">Per conversion</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-semibold text-purple-600">{thisMonthConverted.length}</p>
              <p className="text-xs text-purple-600 mt-1">New conversions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Celebration Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center">
          <Award className="w-8 h-8 text-green-600 mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">Congratulations on Your Success! 🎉</h3>
            <p className="text-green-700 mt-1">
              These {convertedLeads.length} converted leads represent ${totalRevenue.toLocaleString()} in successful business. 
              Keep up the excellent work!
            </p>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={convertedLeads}
        onView={(lead) => {
          setSelectedLead(lead);
          setShowViewModal(true);
        }}
      />

      {/* View Converted Lead Details Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Converted Lead Details"
        size="xl"
      >
        {selectedLead && (
          <div className="space-y-6">
            {/* Success Header */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900">Successfully Converted! 🎉</h3>
                  <p className="text-green-700 text-sm">
                    This lead was successfully converted on {new Date(selectedLead.lastModified).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Client Information</h3>
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
                <h3 className="text-lg font-semibold text-gray-900">Deal Summary</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-center">
                    <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">
                      {selectedLead.quoteAmount ? `$${selectedLead.quoteAmount.toLocaleString()}` : 'N/A'}
                    </p>
                    <p className="text-green-700 text-sm">Final Deal Value</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Lead Created:</span> {new Date(selectedLead.dateCreated).toLocaleDateString()}</p>
                  <p><span className="font-medium">Conversion Date:</span> {new Date(selectedLead.lastModified).toLocaleDateString()}</p>
                  <p><span className="font-medium">Time to Convert:</span> {
                    Math.floor((new Date(selectedLead.lastModified) - new Date(selectedLead.dateCreated)) / (1000 * 60 * 60 * 24))
                  } days</p>
                </div>
              </div>
            </div>

            {/* Conversion Journey */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Conversion Journey</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</div>
                    <p className="mt-1 text-blue-700">New Lead</p>
                    <p className="text-xs text-blue-600">{new Date(selectedLead.dateCreated).toLocaleDateString()}</p>
                  </div>
                  <div className="flex-1 h-px bg-blue-300 mx-2"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">2</div>
                    <p className="mt-1 text-blue-700">Qualification</p>
                    <p className="text-xs text-blue-600">✓</p>
                  </div>
                  <div className="flex-1 h-px bg-blue-300 mx-2"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">3</div>
                    <p className="mt-1 text-blue-700">Proposal</p>
                    <p className="text-xs text-blue-600">✓</p>
                  </div>
                  <div className="flex-1 h-px bg-blue-300 mx-2"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">✓</div>
                    <p className="mt-1 text-green-700">Converted</p>
                    <p className="text-xs text-green-600">{new Date(selectedLead.lastModified).toLocaleDateString()}</p>
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
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <p className="text-green-700 font-medium">Success Story!</p>
                    <p className="text-green-600 text-sm">This lead was successfully converted through excellent relationship management.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Next Steps for Converted Client */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Client Success Actions</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Recommended Next Steps:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Send welcome package and onboarding materials</li>
                  <li>• Schedule kick-off meeting</li>
                  <li>• Set up regular check-in schedule</li>
                  <li>• Add to customer success program</li>
                  <li>• Request testimonial/case study</li>
                  <li>• Identify upselling opportunities</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Converted;