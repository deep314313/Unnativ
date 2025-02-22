import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Trophy, Users, Target, MapPin, Filter, Menu, Bell, Medal } from 'lucide-react';
import axios from '../../utils/axios';
import AthleteProfile from './AthleteProfile';
import { useAuth } from '../../context/AuthContext';

const AthleteDashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [sponsorships, setSponsorships] = useState([]);
  const [travelSupports, setTravelSupports] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [athleteProfile, setAthleteProfile] = useState(null);

  const handleApply = async (id, type) => {
    try {
      const response = await axios.post(`/api/athletes/apply/${type}/${id}`, {
        message: `I am interested in this ${type} opportunity and would like to apply.`,
        requirements: 'No specific requirements'
      });
      
      const applicationsResponse = await axios.get('/api/athletes/applications');
      setApplications(applicationsResponse.data);
      
      alert('Application submitted successfully!');
      setActiveTab('applications');
    } catch (error) {
      console.error('Error submitting application:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit application. Please try again.';
      alert(errorMessage);
    }
  };

  const tabs = [
    { id: 'events', label: 'Events', icon: Target },
    { id: 'sponsorships', label: 'Sponsorships', icon: Trophy },
    { id: 'travel', label: 'Travel Support', icon: MapPin },
    { id: 'applications', label: 'My Applications', icon: Calendar },
    { id: 'profile', label: 'My Profile', icon: Users }
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'events') {
        const response = await axios.get('/api/events');
        setEvents(response.data);
      } else if (activeTab === 'sponsorships') {
        const response = await axios.get('/api/sponsorships');
        setSponsorships(response.data);
      } else if (activeTab === 'travel') {
        const response = await axios.get('/api/athletes/travel-supports');
        setTravelSupports(response.data);
      } else if (activeTab === 'applications') {
        const response = await axios.get('/api/athletes/applications');
        setApplications(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchAthleteProfile = async () => {
      try {
        const response = await axios.get('/api/athletes/profile');
        setAthleteProfile(response.data);
      } catch (error) {
        console.error('Error fetching athlete profile:', error);
      }
    };
  
    fetchAthleteProfile();
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
                onClick={logout}
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

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="w-72 bg-white/10 backdrop-blur-lg border-r border-white/10 h-[calc(100vh-4rem)] fixed">
          <div className="p-6 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold">
                  {athleteProfile?.fullName?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <h2 className="text-white font-medium">Welcome back,</h2>
                <p className="text-gray-400 text-sm">{athleteProfile?.fullName || 'Loading...'}</p>
              </div>
            </div>

            <div className="space-y-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all duration-300
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
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-72">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-white">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h1>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === 'events' && events.map(event => (
                  <div key={event._id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10">
                    <div className="flex flex-col gap-4">
                      <div className="w-full h-32 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <Target className="w-8 h-8 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        {event.title}
                      </h3>
                      <div className="space-y-2 text-gray-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location.city}, {event.location.state}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleApply(event._id, 'event')}
                        className="mt-2 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-lg"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}

                {activeTab === 'sponsorships' && sponsorships.map(sponsorship => (
                  <div key={sponsorship._id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10">
                    <div className="flex flex-col gap-4">
                      <div className="w-full h-32 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <Trophy className="w-8 h-8 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        {sponsorship.title}
                      </h3>
                      <p className="text-gray-300">{sponsorship.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Amount: ₹{sponsorship.amount}</span>
                      </div>
                      <button
                        onClick={() => handleApply(sponsorship._id, 'sponsorship')}
                        className="mt-2 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-lg"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}

                {activeTab === 'travel' && travelSupports.map(support => (
                  <div key={support._id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10">
                    <div className="flex flex-col gap-4">
                      <div className="w-full h-32 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        {support.title}
                      </h3>
                      <p className="text-gray-300">{support.details}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Coverage: {support.coverageType}</span>
                      </div>
                      <button
                        onClick={() => handleApply(support._id, 'travel')}
                        className="mt-2 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-lg"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}

                {activeTab === 'applications' && applications.map(application => (
                  <div key={application._id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10">
                    <div className="flex flex-col gap-3">
                      <h3 className="text-xl font-semibold text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        {application.itemId?.title || "No Title"}
                      </h3>
                      <p className="text-gray-300">{application.itemId?.description || "No description available"}</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{new Date(application.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          application.status === 'approved' ? 'bg-green-500/20 text-green-300' :
                          application.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {activeTab === 'profile' && <AthleteProfile />}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AthleteDashboard;