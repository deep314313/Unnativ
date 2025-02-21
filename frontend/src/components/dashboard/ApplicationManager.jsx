import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';

const ApplicationManager = () => {
  const [applications, setApplications] = useState([]);
  const [selectedType, setSelectedType] = useState('all');

  const styles = {
    container: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '8px',
      width: '100%'
    },
    filters: {
      display: 'flex',
      gap: '15px',
      marginBottom: '20px'
    },
    filterButton: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: '#f1f1f1'
    },
    activeFilter: {
      backgroundColor: '#FF6B6B',
      color: 'white'
    },
    applicationCard: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '15px'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '15px'
    },
    actionButtons: {
      display: 'flex',
      gap: '10px'
    },
    acceptButton: {
      padding: '8px 16px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    rejectButton: {
      padding: '8px 16px',
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    details: {
      marginTop: '15px',
      padding: '15px',
      backgroundColor: '#f9f9f9',
      borderRadius: '4px'
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [selectedType]);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`/api/organizations/applications?type=${selectedType}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleAction = async (applicationId, action) => {
    try {
      await axios.put(`/api/organizations/applications/${applicationId}`, 
        { status: action },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchApplications();
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Registration Applications</h2>
      
      <div style={styles.filters}>
        {['all', 'events', 'sponsorships', 'transport'].map(type => (
          <button
            key={type}
            style={{
              ...styles.filterButton,
              ...(selectedType === type ? styles.activeFilter : {})
            }}
            onClick={() => setSelectedType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {applications.map(application => (
        <div key={application._id} style={styles.applicationCard}>
          <div style={styles.cardHeader}>
            <div>
              <h3>{application.applicant.name}</h3>
              <p>{application.type} Application</p>
            </div>
            <div style={styles.actionButtons}>
              <button
                style={styles.acceptButton}
                onClick={() => handleAction(application._id, 'accepted')}
              >
                Accept
              </button>
              <button
                style={styles.rejectButton}
                onClick={() => handleAction(application._id, 'rejected')}
              >
                Reject
              </button>
            </div>
          </div>

          <div style={styles.details}>
            <p><strong>Email:</strong> {application.applicant.email}</p>
            <p><strong>Applied For:</strong> {application.eventName || application.sponsorshipName || application.transportName}</p>
            <p><strong>Status:</strong> {application.status}</p>
            <p><strong>Application Date:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
            {application.message && (
              <p><strong>Message:</strong> {application.message}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationManager; 