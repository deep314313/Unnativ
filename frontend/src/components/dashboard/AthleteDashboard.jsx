import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from '../../utils/axios';
import AthleteProfile from './AthleteProfile';
import AthleteNavbar from './AthleteNavbar';
import { Calendar, Trophy, Users, Target, MapPin } from 'lucide-react';

const AthleteDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [sponsorships, setSponsorships] = useState([]);
  const [travelSupports, setTravelSupports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myApplications, setMyApplications] = useState([]);
  
  // Filter states
  const [filters, setFilters] = useState({
    events: {
      location: '',
      sport: '',
      level: ''
    },
    sponsorships: {
      type: 'all', // all, partial, full
      minAmount: '',
      maxAmount: ''
    },
    travel: {
      minAmount: '',
      maxAmount: '',
      location: ''
    }
  });

  // Application form state
  const [applicationForm, setApplicationForm] = useState({
    isOpen: false,
    type: '',
    itemId: '',
    message: '',
    requirements: ''
  });

  // Add these new state variables at the top with other states
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    events: {
      location: '',
      sport: '',
      level: ''
    },
    sponsorships: {
      type: 'all',
      minAmount: '',
      maxAmount: ''
    },
    travel: {
      minAmount: '',
      maxAmount: '',
      location: ''
    }
  });

  const tabs = [
    { id: 'events', label: 'Events', icon: '🎯' },
    { id: 'sponsorships', label: 'Sponsorships', icon: '💰' },
    { id: 'travel', label: 'Travel Support', icon: '✈️' },
    { id: 'applications', label: 'My Applications', icon: '📝' },
    { id: 'profile', label: 'My Profile', icon: '👤' }
  ];

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    },
    header: {
      marginBottom: '30px'
    },
    tabs: {
      display: 'flex',
      gap: '20px',
      marginBottom: '30px'
    },
    tab: {
      padding: '15px 25px',
      borderRadius: '12px',
      cursor: 'pointer',
      backgroundColor: 'white',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    activeTab: {
      backgroundColor: '#FF6B6B',
      color: 'white'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease',
      transform: 'translateY(0)'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px'
    },
    applyButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    tag: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      backgroundColor: '#e2e8f0',
      color: '#4a5568'
    },
    cardContent: {
      marginTop: '15px',
      color: '#666'
    },
    tagsContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '10px'
    },
    filterSection: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    filterGroup: {
      display: 'flex',
      gap: '15px',
      marginBottom: '15px'
    },
    filterInput: {
      padding: '8px 12px',
      borderRadius: '6px',
      border: '1px solid #ddd',
      flex: 1
    },
    modal: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      width: '90%',
      maxWidth: '500px',
      zIndex: 1000
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 999
    },
    filterButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    applyFilterButton: {
      backgroundColor: '#1a73e8',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer'
    },
    resetFilterButton: {
      backgroundColor: '#dc2626',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      marginRight: '10px'
    },
    applicationCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease',
      transform: 'translateY(0)'
    },
    applicationHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px'
    },
    status: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: '500'
    },
    applicationActions: {
      display: 'flex',
      gap: '10px',
      marginTop: '10px'
    },
    applicationContent: {
      marginTop: '15px'
    }
  };

  // Add this after your state declarations and before useEffect
  const fetchApplications = useCallback(async () => {
    try {
      const response = await axios.get('/api/athletes/applications');
      // You can add a state for applications if you need to display them
      // setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  }, []);

  // Move fetchData definition before useEffect
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      switch (activeTab) {
        case 'events':
          response = await axios.get('/api/athletes/events', { headers });
          console.log('Events response:', response.data); // Add this for debugging
          setEvents(response.data);
          break;
        case 'sponsorships':
          response = await axios.get('/api/athletes/sponsorships', { headers });
          setSponsorships(response.data);
          break;
        case 'travel':
          response = await axios.get('/api/athletes/travel-supports', { headers });
          setTravelSupports(response.data);
          break;
        default:
          console.log('Unknown tab selected');
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
    setLoading(false);
  }, [activeTab]);

  // Now use fetchData in useEffect
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchFilteredData = async () => {
    setLoading(true);
    try {
      let response;
      switch (activeTab) {
        case 'events':
          response = await axios.get('/api/athletes/events', {
            params: appliedFilters.events
          });
          setEvents(response.data);
          break;
        case 'sponsorships':
          response = await axios.get('/api/athletes/sponsorships', {
            params: appliedFilters.sponsorships
          });
          setSponsorships(response.data);
          break;
        case 'travel':
          response = await axios.get('/api/athletes/travel-supports', {
            params: appliedFilters.travel
          });
          setTravelSupports(response.data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
    setLoading(false);
  };

  const handleApply = async (id, type) => {
    setApplicationForm({
      isOpen: true,
      type,
      itemId: id,
      message: '',
      requirements: ''
    });
  };

  const submitApplication = async () => {
    try {
      await axios.post(`/api/athletes/apply/${applicationForm.type}/${applicationForm.itemId}`, {
        message: applicationForm.message,
        requirements: applicationForm.requirements
      });
      setApplicationForm({ isOpen: false, type: '', itemId: '', message: '', requirements: '' });
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying:', error);
      alert('Failed to submit application');
    }
  };

  const renderApplicationModal = () => {
    if (!applicationForm.isOpen) return null;

    return (
      <>
        <div style={styles.overlay} onClick={() => setApplicationForm({ ...applicationForm, isOpen: false })} />
        <div style={styles.modal}>
          <h2>Submit Application</h2>
          <textarea
            placeholder="Why are you applying? Tell us about yourself..."
            style={{ ...styles.filterInput, minHeight: '100px', marginBottom: '15px' }}
            value={applicationForm.message}
            onChange={(e) => setApplicationForm({ ...applicationForm, message: e.target.value })}
          />
          <textarea
            placeholder="Any specific requirements or requests?"
            style={{ ...styles.filterInput, minHeight: '100px', marginBottom: '15px' }}
            value={applicationForm.requirements}
            onChange={(e) => setApplicationForm({ ...applicationForm, requirements: e.target.value })}
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              style={{ ...styles.applyButton, backgroundColor: '#dc2626' }}
              onClick={() => setApplicationForm({ ...applicationForm, isOpen: false })}
            >
              Cancel
            </button>
            <button
              style={styles.applyButton}
              onClick={submitApplication}
            >
              Submit Application
            </button>
          </div>
        </div>
      </>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>;
    }

    switch (activeTab) {
      case 'events':
        if (!events || events.length === 0) {
          return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              No events available at this time
            </div>
          );
        }
        return events.map(event => (
          <div key={event._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3>{event.title}</h3>
              <button
                style={styles.applyButton}
                onClick={() => handleApply(event._id, 'event')}
              >
                Apply Now
              </button>
            </div>
            <div style={styles.tagsContainer}>
              <span style={styles.tag}>{event.sport}</span>
              <span style={styles.tag}>{event.level}</span>
              <span style={styles.tag}>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <p>{event.description}</p>
            <div style={styles.cardContent}>
              <p><strong>Venue:</strong> {event.location.venue}, {event.location.city}</p>
              <p><strong>Organization:</strong> {event.organization?.name || 'Unknown Organization'}</p>
              {event.travelAllowance?.amount > 0 && (
                <p><strong>Travel Allowance:</strong> ₹{event.travelAllowance.amount}</p>
              )}
            </div>
          </div>
        ));

      case 'sponsorships':
        return sponsorships.map(sponsorship => (
          <div 
            key={sponsorship._id} 
            style={styles.card}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={styles.cardHeader}>
              <h3>{sponsorship.title}</h3>
              <button
                style={styles.applyButton}
                onClick={() => handleApply(sponsorship._id, 'sponsorship')}
              >
                Apply Now
              </button>
            </div>
            <div style={styles.tagsContainer}>
              <span style={styles.tag}>{sponsorship.category}</span>
              <span style={styles.tag}>
                ₹{sponsorship.amount.min} - ₹{sponsorship.amount.max}
              </span>
            </div>
            <p>{sponsorship.details}</p>
          </div>
        ));

      case 'travel':
        return travelSupports.map(support => (
          <div 
            key={support._id} 
            style={styles.card}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={styles.cardHeader}>
              <h3>{support.title}</h3>
              <button
                style={styles.applyButton}
                onClick={() => handleApply(support._id, 'travel')}
              >
                Apply Now
              </button>
            </div>
            <div style={styles.tagsContainer}>
              <span style={styles.tag}>
                ₹{support.amount.min} - ₹{support.amount.max}
              </span>
            </div>
            <p>{support.details}</p>
          </div>
        ));

      case 'applications':
        return renderApplications();

      case 'profile':
        return <AthleteProfile />;

      default:
        return <div>Select a tab to view content</div>;
    }
  };

  // Add this function to handle filter application
  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    fetchFilteredData();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AthleteNavbar />
      <div style={styles.container}>
        <div style={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.tab,
                ...(activeTab === tab.id ? styles.activeTab : {})
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter Button */}
        {activeTab !== 'profile' && activeTab !== 'applications' && (
          <button
            style={styles.filterButton}
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filters
          </button>
        )}

        {/* Filters Section */}
        {showFilters && (
          <div style={styles.filterSection}>
            {/* Add your filter inputs here based on activeTab */}
            <div style={styles.filterGroup}>
              {/* Filter inputs will go here */}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                style={styles.resetFilterButton}
                onClick={() => {
                  setFilters({
                    events: { location: '', sport: '', level: '' },
                    sponsorships: { type: 'all', minAmount: '', maxAmount: '' },
                    travel: { minAmount: '', maxAmount: '', location: '' }
                  });
                  setAppliedFilters({
                    events: { location: '', sport: '', level: '' },
                    sponsorships: { type: 'all', minAmount: '', maxAmount: '' },
                    travel: { minAmount: '', maxAmount: '', location: '' }
                  });
                  fetchData();
                }}
              >
                Reset Filters
              </button>
              <button
                style={styles.applyFilterButton}
                onClick={handleApplyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {renderContent()}
        {renderApplicationModal()}
      </div>
    </div>
  );
};

export default AthleteDashboard;