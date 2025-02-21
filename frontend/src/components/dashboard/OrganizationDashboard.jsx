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
      const response = await axios.get('/api/sponsorships');
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
    <div key={sponsorship._id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{sponsorship.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{sponsorship.sport}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${sponsorship.status === 'active' ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
          {sponsorship.status}
        </span>
      </div>
      <div className="text-sm text-gray-700 space-y-2">
        <p><span className="font-medium">Amount:</span> ₹{sponsorship.amount}</p>
        <p className="mt-2 text-gray-600">{sponsorship.description}</p>
      </div>
    </div>
  );

  const renderTravelSupportCard = (support) => (
    <div key={support._id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{support.title}</h3>
          <p className="text-sm text-gray-600 mb-2">
            Valid till: {new Date(support.validTill).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white`}>
          {support.coverageType}
        </span>
      </div>
      <div className="text-sm text-gray-700 space-y-2">
        <p><span className="font-medium">Amount Range:</span> ₹{support.amount?.min || 0} - ₹{support.amount?.max || 0}</p>
        <p className="mt-2 text-gray-600">{support.details}</p>
      </div>
    </div>
  );

  const renderForm = () => {
    if (!showForm) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg w-3/5 max-h-[80vh] overflow-y-auto relative p-8">
          <button 
            className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-800"
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
    <div key={event._id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.title}</h3>
          <p className="text-sm text-gray-600 mb-2">
            {new Date(event.date).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.status === 'upcoming' ? 'bg-green-500' : event.status === 'rejected' ? 'bg-red-500' : 'bg-orange-400'} text-white`}>
          {event.status}
        </span>
      </div>
      <div className="text-sm text-gray-700 space-y-2">
        <p><span className="font-medium">Sport:</span> {event.sport}</p>
        <p><span className="font-medium">Level:</span> {event.level}</p>
        <p><span className="font-medium">Location:</span> {event.location.city}, {event.location.state}</p>
        <p className="mt-2 text-gray-600">{event.description}</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-800">Sports Connect</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, Organization</span>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white shadow-lg z-10 overflow-y-auto">
        <div className="p-4 space-y-2">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.id ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 pt-16 min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
              {activeTab !== 'profile' && activeTab !== 'applications' && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-sm"
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