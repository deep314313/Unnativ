import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../utils/axios';
import EventForm from './EventForm';
import SponsorshipForm from './SponsorshipForm';
import TransportForm from './TransportForm';
import OrganizationProfile from './OrganizationProfile';
import ApplicationManager from './ApplicationManager';

const OrganizationDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
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

  const styles = {
    container: {
      display: 'flex',
      minHeight: 'calc(100vh - 64px)',
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
      padding: '30px'
    },
    categoryItem: {
      padding: '12px 15px',
      marginBottom: '8px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    activeCategoryItem: {
      backgroundColor: '#FF6B6B',
      color: 'white'
    },
    categoryIcon: {
      marginRight: '10px',
      fontSize: '18px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px'
    },
    tabs: {
      display: 'flex',
      gap: '20px',
      marginBottom: '30px',
      borderBottom: '1px solid #ddd'
    },
    tab: {
      padding: '10px 20px',
      cursor: 'pointer',
      borderBottom: '2px solid transparent',
      color: '#666'
    },
    activeTab: {
      borderBottom: '2px solid #FF6B6B',
      color: '#FF6B6B'
    },
    addButton: {
      padding: '10px 20px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer'
    },
    eventGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px'
    },
    eventCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    form: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '600px',
      margin: '0 auto'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      color: '#444'
    },
    input: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px'
    },
    submitButton: {
      padding: '10px 20px',
      backgroundColor: '#FF6B6B',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      marginTop: '10px'
    },
    sectionTitle: {
      marginBottom: '10px'
    },
    row: {
      display: 'flex',
      gap: '20px'
    }
  };

  const categories = [
    {
      id: 'events',
      name: 'Sports Events',
      icon: '🎯',
      description: 'Create and manage sports events'
    },
    {
      id: 'sponsorships',
      name: 'Sponsorships',
      icon: '💰',
      description: 'Manage sponsorship opportunities'
    },
    {
      id: 'transport',
      name: 'Transport Support',
      icon: '🚌',
      description: 'Manage travel allowances'
    },
    {
      id: 'profile',
      name: 'Organization Profile',
      icon: '👤',
      description: 'View and edit organization profile'
    },
    {
      id: 'applications',
      name: 'Applications',
      icon: '📝',
      description: 'Manage registration requests'
    }
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

  useEffect(() => {
    fetchOrganizationData();
  }, [fetchOrganizationData]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/organizations/events', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setEventsList(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
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

  const renderContent = () => {
    switch (activeTab) {
      case 'events':
        return <EventForm />;
      case 'sponsorships':
        return <SponsorshipForm />;
      case 'transport':
        return <TransportForm />;
      case 'profile':
        return <OrganizationProfile />;
      case 'applications':
        return <ApplicationManager />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={{ marginBottom: '20px', color: '#2d3748' }}>Dashboard</h2>
        {categories.map(category => (
          <div
            key={category.id}
            style={{
              ...styles.categoryItem,
              ...(activeTab === category.id ? styles.activeCategoryItem : {})
            }}
            onClick={() => setActiveTab(category.id)}
            onMouseOver={(e) => {
              if (activeTab !== category.id) {
                e.currentTarget.style.backgroundColor = '#f7f7f7';
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== category.id) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={styles.categoryIcon}>{category.icon}</span>
            {category.name}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {renderContent()}
      </div>
    </div>
  );
};

export default OrganizationDashboard; 