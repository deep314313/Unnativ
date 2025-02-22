import React, { useState, useEffect, useCallback } from 'react';
<<<<<<< HEAD
import axios from '../../utils/axios';
import AthleteProfile from './AthleteProfile';
=======
import { Calendar, Trophy, Users, Target, MapPin, Filter, Menu, Bell } from 'lucide-react';
>>>>>>> 3a5df6b18b1b2c6f24f49c0c4467ace1e2f3162f

const AthleteDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [sponsorships, setSponsorships] = useState([]);
  const [travelSupports, setTravelSupports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const tabs = [
    { id: 'events', label: 'Events', icon: Target },
    { id: 'sponsorships', label: 'Sponsorships', icon: Trophy },
    { id: 'travel', label: 'Travel Support', icon: MapPin },
    { id: 'applications', label: 'My Applications', icon: Calendar },
    { id: 'profile', label: 'My Profile', icon: Users }
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    // Simulated data fetch
    setTimeout(() => {
      setEvents([
        { _id: '1', title: 'Marathon 2025', date: '2025-03-15', location: 'New York' },
        { _id: '2', title: 'Track & Field Championship', date: '2025-04-01', location: 'Los Angeles' }
      ]);
      setLoading(false);
    }, 1000);
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Sidebar */}
      <div className="w-72 bg-black/30 backdrop-blur-xl p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          <div>
            <h2 className="text-xl font-bold text-white">Athlete portal</h2>
            <p className="text-gray-400 text-sm">Welcome back, Alex</p>
          </div>
        </div>

<<<<<<< HEAD
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

  // Add this function to handle filter reset
  const handleResetFilters = () => {
    const resetFilters = {
      events: { location: '', sport: '', level: '' },
      sponsorships: { type: 'all', minAmount: '', maxAmount: '' },
      travel: { minAmount: '', maxAmount: '', location: '' }
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
    fetchData();
  };

  // Update the renderFilters function
  const renderFilters = () => {
    if (!showFilters) return null;

    const filterContent = () => {
      switch (activeTab) {
        case 'events':
          return (
            <div style={styles.filterGroup}>
              <input
                type="text"
                placeholder="Search by city"
                style={styles.filterInput}
                value={filters.events.location}
                onChange={(e) => setFilters({
                  ...filters,
                  events: { ...filters.events, location: e.target.value }
                })}
              />
              <select
                style={styles.filterInput}
                value={filters.events.sport}
                onChange={(e) => setFilters({
                  ...filters,
                  events: { ...filters.events, sport: e.target.value }
                })}
              >
                <option value="">All Sports</option>
                <option value="cricket">Cricket</option>
                <option value="football">Football</option>
                <option value="basketball">Basketball</option>
                <option value="athletics">Athletics</option>
              </select>
              <select
                style={styles.filterInput}
                value={filters.events.level}
                onChange={(e) => setFilters({
                  ...filters,
                  events: { ...filters.events, level: e.target.value }
                })}
              >
                <option value="">All Levels</option>
                <option value="district">District</option>
                <option value="state">State</option>
                <option value="national">National</option>
              </select>
            </div>
          );

        case 'sponsorships':
          return (
            <div style={styles.filterGroup}>
              <select
                style={styles.filterInput}
                value={filters.sponsorships.type}
                onChange={(e) => setFilters({
                  ...filters,
                  sponsorships: { ...filters.sponsorships, type: e.target.value }
                })}
              >
                <option value="all">All Types</option>
                <option value="full">Full Sponsorship</option>
                <option value="partial">Partial Sponsorship</option>
              </select>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Min Amount"
                style={styles.filterInput}
                value={filters.sponsorships.minAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setFilters({
                    ...filters,
                    sponsorships: { ...filters.sponsorships, minAmount: value }
                  });
                }}
              />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Max Amount"
                style={styles.filterInput}
                value={filters.sponsorships.maxAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setFilters({
                    ...filters,
                    sponsorships: { ...filters.sponsorships, maxAmount: value }
                  });
                }}
              />
            </div>
          );

        case 'travel':
          return (
            <div style={styles.filterGroup}>
              <input
                type="text"
                placeholder="Search by location"
                style={styles.filterInput}
                value={filters.travel.location}
                onChange={(e) => setFilters({
                  ...filters,
                  travel: { ...filters.travel, location: e.target.value }
                })}
              />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Min Amount"
                style={styles.filterInput}
                value={filters.travel.minAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setFilters({
                    ...filters,
                    travel: { ...filters.travel, minAmount: value }
                  });
                }}
              />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Max Amount"
                style={styles.filterInput}
                value={filters.travel.maxAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setFilters({
                    ...filters,
                    travel: { ...filters.travel, maxAmount: value }
                  });
                }}
              />
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div style={styles.filterSection}>
        {filterContent()}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
          <button
            style={styles.resetFilterButton}
            onClick={handleResetFilters}
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
=======
        <div className="space-y-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full
                ${activeTab === id 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-white/5'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">{tabs.find(t => t.id === activeTab)?.label}</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-300"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
              <Bell className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'events' && events.map(event => (
              <div 
                key={event._id} 
                className="bg-black/30 backdrop-blur-xl border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300"
              >
                <div className="flex flex-col gap-3">
                  <div className="w-full h-32 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Target className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
>>>>>>> 3a5df6b18b1b2c6f24f49c0c4467ace1e2f3162f
      </div>
    );
  };

  // Update fetchMyApplications function
  const fetchMyApplications = useCallback(async () => {
    try {
      const response = await axios.get('/api/athletes/applications');
      console.log('Applications response:', response.data); // For debugging
      setMyApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      if (error.response) {
        console.error('Server error:', error.response.data);
      }
    }
  }, []);

  // Update the applications rendering
  const renderApplications = () => {
    if (!myApplications || myApplications.length === 0) {
      return <div>No applications found</div>;
    }

    return myApplications.map(app => (
      <div key={app._id} style={styles.applicationCard}>
        <div style={styles.applicationHeader}>
          <h4>{app.event?.title || app.itemId?.title || 'Unknown Event'}</h4>
          <span style={{
            ...styles.status,
            backgroundColor: 
              app.status === 'accepted' ? '#4CAF50' :
              app.status === 'rejected' ? '#f44336' :
              '#ffa726',
            color: 'white'
          }}>
            {app.status}
          </span>
        </div>
        <div style={styles.applicationContent}>
          <p><strong>Type:</strong> {app.type}</p>
          {app.event?.organization && (
            <p><strong>Organization:</strong> {app.event.organization.name}</p>
          )}
          <p><strong>Applied on:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>
          <p><strong>Message:</strong> {app.message}</p>
          {app.requirements && (
            <p><strong>Requirements:</strong> {app.requirements}</p>
          )}
        </div>
      </div>
    ));
  };

  // Add useEffect to fetch applications
  useEffect(() => {
    fetchMyApplications();
  }, [fetchMyApplications]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Welcome, Athlete!</h1>
        <p>Find and apply for opportunities that match your needs</p>
      </div>

      <div style={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <button 
        style={styles.filterButton}
        onClick={() => setShowFilters(!showFilters)}
      >
        <span>🔍</span>
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {renderFilters()}
      {renderContent()}
      {renderApplicationModal()}
    </div>
  );
};

export default AthleteDashboard; 