import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialData } from '../data/initialData';

const CRMContext = createContext();

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};

export const CRMProvider = ({ children }) => {
  const [users, setUsers] = useState(initialData.users);
  const [leads, setLeads] = useState(initialData.leads);
  const [activityLogs, setActivityLogs] = useState(initialData.activityLogs);
  const [currentUser, setCurrentUser] = useState(initialData.users[0]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Add new lead
  const addLead = (leadData) => {
    const newLead = {
      id: leads.length + 1,
      ...leadData,
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      notes: []
    };

    setLeads([...leads, newLead]);

    // Add activity log
    const activity = {
      id: activityLogs.length + 1,
      type: 'lead_created',
      description: `Lead '${leadData.name}' created and assigned to ${leadData.assignedTo}`,
      user: currentUser.name,
      userId: currentUser.id,
      leadId: newLead.id,
      timestamp: new Date().toISOString(),
      details: {
        leadName: leadData.name,
        assignedTo: leadData.assignedTo
      }
    };

    setActivityLogs([activity, ...activityLogs]);
  };

  // Update lead status
  const updateLeadStatus = (leadId, newStatus, quoteAmount = null) => {
    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        const updatedLead = {
          ...lead,
          status: newStatus,
          lastModified: new Date().toISOString()
        };

        if (quoteAmount) {
          updatedLead.quoteAmount = quoteAmount;
        }

        // Add activity log
        const activity = {
          id: activityLogs.length + 1,
          type: 'status_change',
          description: `${lead.name} status changed from '${lead.status}' to '${newStatus}'`,
          user: currentUser.name,
          userId: currentUser.id,
          leadId: leadId,
          timestamp: new Date().toISOString(),
          details: {
            leadName: lead.name,
            fromStatus: lead.status,
            toStatus: newStatus
          }
        };

        setActivityLogs([activity, ...activityLogs]);

        return updatedLead;
      }
      return lead;
    }));
  };

  // Add note to lead
  const addNoteToLead = (leadId, noteText) => {
    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        const newNote = {
          id: lead.notes.length + 1,
          text: noteText,
          author: currentUser.name,
          timestamp: new Date().toISOString()
        };

        // Add activity log
        const activity = {
          id: activityLogs.length + 1,
          type: 'note_added',
          description: `Note added to ${lead.name}: '${noteText}'`,
          user: currentUser.name,
          userId: currentUser.id,
          leadId: leadId,
          timestamp: new Date().toISOString(),
          details: {
            leadName: lead.name,
            noteText: noteText
          }
        };

        setActivityLogs([activity, ...activityLogs]);

        return {
          ...lead,
          notes: [...lead.notes, newNote],
          lastModified: new Date().toISOString()
        };
      }
      return lead;
    }));
  };

  // Add new user
  const addUser = (userData) => {
    const newUser = {
      id: users.length + 1,
      ...userData,
      active: true,
      tasksAssigned: 0,
      leadsCreated: 0,
      joinDate: userData.startDate || new Date().toISOString().split('T')[0],
      lastLogin: null
    };

    setUsers([...users, newUser]);

    // Add activity log
    const activity = {
      id: activityLogs.length + 1,
      type: 'user_created',
      description: `New user '${userData.name}' created with role ${userData.role}`,
      user: currentUser.name,
      userId: currentUser.id,
      timestamp: new Date().toISOString(),
      details: {
        userName: userData.name,
        userRole: userData.role
      }
    };

    setActivityLogs([activity, ...activityLogs]);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Filter leads by status
  const getLeadsByStatus = (status) => {
    if (Array.isArray(status)) {
      return leads.filter(lead => status.includes(lead.status));
    }
    return leads.filter(lead => lead.status === status);
  };

  // Filter users by role
  const getUsersByRole = (role) => {
    if (role === 'all') return users;
    return users.filter(user => user.role === role);
  };

  const value = {
    users,
    leads,
    activityLogs,
    currentUser,
    sidebarCollapsed,
    addLead,
    updateLeadStatus,
    addNoteToLead,
    addUser,
    toggleSidebar,
    getLeadsByStatus,
    getUsersByRole,
    setCurrentUser
  };

  return (
    <CRMContext.Provider value={value}>
      {children}
    </CRMContext.Provider>
  );
};