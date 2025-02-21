import React from 'react';

const DonorDashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Donor Dashboard</h1>
      <div style={{ marginTop: '20px' }}>
        <h2>Welcome to your dashboard</h2>
        <div style={{ marginTop: '20px' }}>
          <h3>Quick Actions</h3>
          <ul>
            <li>Make Donation</li>
            <li>View History</li>
            <li>Manage Profile</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard; 