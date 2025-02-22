import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import EventForm from './EventForm';
import SponsorshipForm from './SponsorshipForm';
import TransportForm from './TransportForm';
import OrganizationProfile from './OrganizationProfile';
import ApplicationManager from './ApplicationManager';
import { Medal, Bell } from 'lucide-react';

const OrganizationDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [organizationData, setOrganizationData] = useState(null);
  const [eventsList, setEventsList] = useState([]);
  const [applications, setApplications] = useState([]);
  const [sponsorships, setSponsorships] = useState([]);
  const [travelSupports, setTravelSupports] = useState([]);
  const sidebarItems = [
    { id: 'profile', label: 'Organization Profile', icon: '👤' },
    { id: 'events', label: 'Events', icon: '🎯' },
    { id: 'sponsorships', label: 'Sponsorships', icon: '💰' },
    { id: 'travel', label: 'Travel Support', icon: '✈️' },
    { id: 'applications', label: 'Applications', icon: '📝' }
  ];
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

  const fetchSponsorships = useCallback(async () => {
    try {
      const response = await axios.get('/api/organizations/sponsorships');
      setSponsorships(response.data);
    } catch (error) {
      console.error('Error fetching sponsorships:', error);
    }
  }, []);

  const fetchTravelSupports = useCallback(async () => {
    try {
      const response = await axios.get('/api/travel-supports');
      setTravelSupports(response.data);
    } catch (error) {
      console.error('Error fetching travel supports:', error);
    }
  }, []);

  const renderSponsorshipCard = (sponsorship) => (
    <div key={sponsorship._id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{sponsorship.title}</h3>
          <p className="text-sm text-gray-300 mb-2">{sponsorship.sport}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${sponsorship.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>
          {sponsorship.status}
        </span>
      </div>
      <div className="text-sm text-gray-300 space-y-3">
        <p><span className="font-medium text-blue-400">Amount:</span> ₹{sponsorship.amount}</p>
        <p className="mt-3 text-gray-400 leading-relaxed">{sponsorship.description}</p>
      </div>
    </div>
  );

  const renderTravelSupportCard = (support) => (
    <div key={support._id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{support.title}</h3>
          <p className="text-sm text-gray-300 mb-2">
            Valid till: {new Date(support.validTill).toLocaleDateString()}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
          {support.coverageType}
        </span>
      </div>
      <div className="text-sm text-gray-300 space-y-3">
        <p><span className="font-medium text-blue-400">Amount Range:</span> ₹{support.amount?.min || 0} - ₹{support.amount?.max || 0}</p>
        <p className="mt-3 text-gray-400 leading-relaxed">{support.details}</p>
      </div>
    </div>
  );

  const renderForm = () => {
    if (!showForm) return null;

    const handleFormClose = async () => {
      setShowForm(false);
      if (activeTab === 'events') {
        await fetchEvents();
      } else if (activeTab === 'sponsorships') {
        await fetchSponsorships();
      } else if (activeTab === 'travel') {
        await fetchTravelSupports();
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-[100] pt-20">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg w-11/12 md:w-3/5 max-h-[80vh] overflow-y-auto relative p-4">
          <button 
            className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-lg font-medium z-[101] transition-colors duration-200 flex items-center justify-center shadow-lg"
            onClick={handleFormClose}
          >
            Close
          </button>
          {activeTab === 'events' && <EventForm onClose={handleFormClose} />}
          {activeTab === 'sponsorships' && <SponsorshipForm onClose={handleFormClose} />}
          {activeTab === 'travel' && <TransportForm onClose={handleFormClose} />}
        </div>
      </div>
    );
  };

  const renderEventCard = (event) => (
    <div key={event._id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{event.title}</h3>
          <p className="text-sm text-gray-300 mb-2">
            {new Date(event.date).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.status === 'upcoming' ? 'bg-green-500/20 text-green-300' : event.status === 'rejected' ? 'bg-red-500/20 text-red-300' : 'bg-orange-400/20 text-orange-300'}`}>
          {event.status}
        </span>
      </div>
      <div className="text-sm text-gray-300 space-y-3">
        <p><span className="font-medium text-blue-400">Sport:</span> {event.sport}</p>
        <p><span className="font-medium text-blue-400">Level:</span> {event.level}</p>
        <p><span className="font-medium text-blue-400">Location:</span> {event.location.city}, {event.location.state}</p>
        <p className="mt-3 text-gray-400 leading-relaxed">{event.description}</p>
      </div>
    </div>
  );

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
    } else if (activeTab === 'sponsorships') {
      fetchSponsorships();
    } else if (activeTab === 'travel') {
      fetchTravelSupports();
    }
  }, [activeTab, fetchEvents, fetchApplications, fetchSponsorships, fetchTravelSupports]);

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden relative">
      {/* Background gradient circles */}
      <div className="fixed top-0 left-0 w-[800px] h-[800px] bg-blue-500 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-[800px] h-[800px] bg-purple-500 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />

      {/* Top Navigation Bar */}
      <nav className="bg-white/10 backdrop-blur-lg shadow-lg fixed w-full z-50 top-0">
        <div className="w-full px-4">
          <div className="flex justify-between h-16">
            {/* Left side - Logo */}
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <Medal className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">UnnatiVeer</span>
              </div>
            </div>

            {/* Right side - Bell and Logout */}
            <div className="flex items-center gap-6">
              <button className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200 relative">
                <Bell className="w-6 h-6 text-white" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={() => {
                  localStorage.clear();
                  navigate('/');
                }}
                className="text-white/80 hover:text-white transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white/10 backdrop-blur-lg shadow-lg z-40 overflow-y-auto">
        <div className="p-4 space-y-2">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.id ? 'bg-blue-500/20 text-blue-400' : 'text-white/80 hover:bg-white/5'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 pt-16 min-h-screen relative z-30 pb-8">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
              {activeTab !== 'profile' && activeTab !== 'applications' && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Create New
                </button>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {activeTab === 'profile' && <OrganizationProfile />}
                {activeTab === 'applications' && <ApplicationManager />}
                {activeTab === 'events' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eventsList.map(event => renderEventCard(event))}
                  </div>
                )}
                {activeTab === 'sponsorships' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sponsorships.map(sponsorship => renderSponsorshipCard(sponsorship))}
                  </div>
                )}
                {activeTab === 'travel' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {travelSupports.map(support => renderTravelSupportCard(support))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Modal Form */}
      {renderForm()}
    </div>
  );
};

export default OrganizationDashboard;