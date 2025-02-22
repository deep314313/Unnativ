import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/auth/Login';
import OrganizationRegister from './components/registration/OrganizationRegister';
import AthleteRegister from './components/registration/AthleteRegister';
import DonorRegister from './components/registration/DonorRegister';
import Navbar from './components/common/Navbar';

// Import dashboard components
import OrganizationDashboard from './components/dashboard/OrganizationDashboard';
import AthleteDashboard from './components/dashboard/AthleteDashboard';
import DonorDashboard from './components/dashboard/DonorDashboard';
import Athletes from './components/Athletes';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Only show main Navbar on non-dashboard and non-landing page routes */}
        {!['/organization/dashboard', '/athlete/dashboard', '/donor/dashboard', '/'].includes(window.location.pathname) && <Navbar />}
        <div className="main-content">
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Login Routes */}
            <Route path="/login/organization" element={<Login userType="Organization" />} />
            <Route path="/login/athlete" element={<Login userType="Athlete" />} />
            <Route path="/login/donor" element={<Login userType="Donor" />} />
            
            {/* Registration Routes */}
            <Route path="/register/organization" element={<OrganizationRegister />} />
            <Route path="/register/athlete" element={<AthleteRegister />} />
            <Route path="/register/donor" element={<DonorRegister />} />
            
            {/* Dashboard Routes */}
            <Route path="/organization/dashboard" element={<OrganizationDashboard />} />
            <Route path="/athlete/dashboard" element={<AthleteDashboard />} />
            <Route path="/donor/dashboard" element={<DonorDashboard />} />

            {/* Athletes List Route */}
            <Route path="/athletes" element={<Athletes />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;