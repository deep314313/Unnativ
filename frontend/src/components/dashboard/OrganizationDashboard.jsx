import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../utils/axios';
import EventForm from './EventForm';
import SponsorshipForm from './SponsorshipForm';
import TransportForm from './TransportForm';
import OrganizationProfile from './OrganizationProfile';
import ApplicationManager from './ApplicationManager';

const OrganizationDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [organizationData, setOrganizationData] = useState(null);
  const [eventsList, setEventsList] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    eventType: '',
    sport: '',
    level: '',
    ageGroup: {
      min: '',
      max: ''
    },
    date: '',
    endDate: '',
    location: {
      venue: '',
      city: '',
      state: '',
      country: ''
    },
    sponsorship: {
      title: '',
      category: '',
      amount: {
        min: '',
        max: ''
      },
      details: ''
    },
    travelAllowance: {
      provided: false,
      amount: {
        min: '',
        max: ''
      },
      details: ''
    },
    eventBanner: ''
  });
  const [applications, setApplications] = useState([]);

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    },
    sidebar: {
      width: '250px',
      backgroundColor: 'white',
      padding: '20px',
      boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
      position: 'fixed',
      height: '100vh',
      overflowY: 'auto'
    },
    mainContent: {
      flex: 1,
      marginLeft: '250px',
      padding: '30px',
      maxWidth: 'calc(100% - 250px)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    createButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.3s'
    },
    listingCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: '1px solid #eee'
    },
    listingHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '15px'
    },
    listingTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '8px'
    },
    listingDetails: {
      color: '#4a5568',
      fontSize: '14px'
    },
    listingGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
      marginTop: '20px'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '8px',
      width: '60%',
      maxHeight: '80vh',
      overflowY: 'auto',
      position: 'relative'
    },
    closeButton: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      border: 'none',
      background: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#666'
    },
    sidebarItem: {
      padding: '12px 15px',
      marginBottom: '8px',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.3s ease',
      fontSize: '14px',
      color: '#4a5568'
    },
    activeSidebarItem: {
      backgroundColor: '#FF6B6B',
      color: 'white',
      fontWeight: '500'
    },
    sidebarIcon: {
      fontSize: '18px',
      width: '24px',
      textAlign: 'center'
    },
    eventStatus: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '500'
    },
    eventDate: {
      color: '#718096',
      fontSize: '14px',
      marginBottom: '10px'
    }
  };

  const sidebarItems = [
    { id: 'profile', label: 'Organization Profile', icon: '👤' },
    { id: 'events', label: 'Events', icon: '🎯' },
    { id: 'sponsorships', label: 'Sponsorships', icon: '💰' },
    { id: 'travel', label: 'Travel Support', icon: '✈️' },
    { id: 'applications', label: 'Applications', icon: '📝' }
  ];

  const handleSubmit = useCallback(async (formData) => {
    try {
      const response = await axios.put('/api/organizations/profile', formData);
      setOrganizationData(response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setOrganizationData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleImageUpload = useCallback(async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await axios.post('/api/organizations/upload-image', formData);
      setOrganizationData(prev => ({
        ...prev,
        imageUrl: response.data.imageUrl
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }, []);

  const fetchOrganizationData = useCallback(async () => {
    try {
      const response = await axios.get('/api/organizations/profile');
      setOrganizationData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching organization data:', error);
      setLoading(false);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get('/api/organizations/events');
      setEventsList(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      const response = await axios.get('/api/organizations/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  }, []);

  const handleApplicationStatus = async (applicationId, status) => {
    try {
      await axios.put(`/api/organizations/applications/${applicationId}`, 
        { status },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchApplications(); // Refresh applications
      alert(`Application ${status} successfully`);
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application status');
    }
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/organizations/events', newEvent, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchEvents();
      setNewEvent({
        title: '',
        description: '',
        eventType: '',
        sport: '',
        level: '',
        ageGroup: {
          min: '',
          max: ''
        },
        date: '',
        endDate: '',
        location: {
          venue: '',
          city: '',
          state: '',
          country: ''
        },
        sponsorship: {
          title: '',
          category: '',
          amount: {
            min: '',
            max: ''
          },
          details: ''
        },
        travelAllowance: {
          provided: false,
          amount: {
            min: '',
            max: ''
          },
          details: ''
        },
        eventBanner: ''
      });
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleChangeEvent = (e) => {
    setNewEvent({
      ...newEvent,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUploadEvent = (e) => {
    // Implementation for image upload
  };

  const renderForm = () => {
    if (!showForm) return null;

    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <button 
            style={styles.closeButton}
            onClick={() => setShowForm(false)}
          >
            ×
          </button>
          {activeTab === 'events' && <EventForm onClose={() => setShowForm(false)} />}
          {activeTab === 'sponsorships' && <SponsorshipForm onClose={() => setShowForm(false)} />}
          {activeTab === 'travel' && <TransportForm onClose={() => setShowForm(false)} />}
        </div>
      </div>
    );
  };

  const renderEventCard = (event) => (
    <div key={event._id} style={styles.listingCard}>
      <div style={styles.listingHeader}>
        <div>
          <h3 style={styles.listingTitle}>{event.title}</h3>
          <p style={styles.eventDate}>
            {new Date(event.date).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
          </p>
        </div>
        <span style={{
          ...styles.eventStatus,
          backgroundColor: event.status === 'upcoming' ? '#48BB78' : '#F56565',
          color: 'white'
        }}>
          {event.status}
        </span>
      </div>
      <div style={styles.listingDetails}>
        <p><strong>Sport:</strong> {event.sport}</p>
        <p><strong>Level:</strong> {event.level}</p>
        <p><strong>Location:</strong> {event.location.city}, {event.location.state}</p>
        <p>{event.description}</p>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) return <div>Loading...</div>;

    return (
      <>
        <div style={styles.header}>
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          {activeTab !== 'profile' && activeTab !== 'applications' && (
            <button 
              style={styles.createButton}
              onClick={() => setShowForm(true)}
            >
              Create New
            </button>
          )}
        </div>

        {activeTab === 'profile' && <OrganizationProfile />}
        {activeTab === 'applications' && <ApplicationManager />}
        {activeTab === 'events' && (
          <div style={styles.listingGrid}>
            {eventsList.map(event => renderEventCard(event))}
          </div>
        )}
        {/* Add similar sections for sponsorships and travel support */}
      </>
    );
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchOrganizationData();
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (activeTab === 'events') {
      fetchEvents();
    } else if (activeTab === 'applications') {
      fetchApplications();
    }
  }, [activeTab]);

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={{ marginBottom: '20px' }}>Dashboard</h2>
        {sidebarItems.map(item => (
          <div
            key={item.id}
            style={{
              ...styles.sidebarItem,
              ...(activeTab === item.id ? styles.activeSidebarItem : {})
            }}
            onClick={() => setActiveTab(item.id)}
          >
            <span style={styles.sidebarIcon}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {renderContent()}
      </div>

      {/* Modal Form */}
      {renderForm()}
    </div>
  );
};

export default OrganizationDashboard; 