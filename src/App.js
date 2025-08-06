import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CRMProvider } from './context/CRMContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Opportunities from './pages/Opportunities';
import Enquiry from './pages/Enquiry';
import Quotation from './pages/Quotation';
import FollowUp from './pages/FollowUp';
import Converted from './pages/Converted';
import Failed from './pages/Failed';
import CreateUser from './pages/CreateUser';
import UserList from './pages/UserList';
import LeadsHistory from './pages/LeadsHistory';
import ActivityLogs from './pages/ActivityLogs';

function App() {
  return (
    <CRMProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/enquiry" element={<Enquiry />} />
            <Route path="/quotation" element={<Quotation />} />
            <Route path="/follow-up" element={<FollowUp />} />
            <Route path="/converted" element={<Converted />} />
            <Route path="/failed" element={<Failed />} />
            <Route path="/create-user" element={<CreateUser />} />
            <Route path="/user-list" element={<UserList />} />
            <Route path="/leads-history" element={<LeadsHistory />} />
            <Route path="/activity-logs" element={<ActivityLogs />} />
          </Routes>
        </Layout>
      </Router>
    </CRMProvider>
  );
}

export default App;