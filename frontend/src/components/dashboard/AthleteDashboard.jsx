import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Trophy, Users, Target, MapPin, Filter, Menu, Bell } from 'lucide-react';

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
      </div>
    </div>
  );
};

export default AthleteDashboard;