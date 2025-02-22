import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import AthleteProfile from './AthleteProfile';
import DonateModal from './DonateModal';
import { motion } from 'framer-motion';
import { Trophy, Settings, Bell, ChevronDown, Users, Heart, LineChart, Calendar, LogOut } from 'lucide-react';

const DonorDashboard = () => {
  const { logout } = useAuth();
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [activeTab, setActiveTab] = useState('athletes');
  const [showDonorTypeModal, setShowDonorTypeModal] = useState(false);
  const [donorType, setDonorType] = useState('individual');
  const [filters, setFilters] = useState({
    name: '',
    location: '',
    age: '',
    sport: '',
    gender: ''
  });

  const menuItems = [
    { id: 'athletes', label: 'Athletes', icon: Users },
    { id: 'donations', label: 'My Donations', icon: Heart },
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#0B0B1E',
      color: 'white',
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    filters: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(8px)',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    filterRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '15px'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      borderRadius: '4px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      fontSize: '14px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: 'white'
    },
    select: {
      width: '100%',
      padding: '8px 12px',
      borderRadius: '4px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      fontSize: '14px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: 'white'
    },
    athleteGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px'
    },
    athleteCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(8px)',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      transition: 'transform 0.2s, background-color 0.2s',
      '&:hover': {
        transform: 'translateY(-5px)',
        backgroundColor: 'rgba(255, 255, 255, 0.15)'
      }
    },
    modal: {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: '#0B0B1E',
      padding: '30px',
      borderRadius: '8px',
      maxWidth: '800px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: 'white'
    },
    button: {
      background: 'linear-gradient(to right, #4CAF50, #45a049)',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      marginTop: '10px',
      transition: 'transform 0.2s, opacity 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
        opacity: 0.9
      }
    },
    closeButton: {
      background: 'linear-gradient(to right, #f44336, #d32f2f)',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      marginTop: '10px',
      transition: 'transform 0.2s, opacity 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
        opacity: 0.9
      }
    },
    achievementTag: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      marginRight: '8px',
      marginBottom: '8px',
      display: 'inline-block',
      color: 'white'
    },
    viewProfileButton: {
      background: 'linear-gradient(to right, #2196F3, #1976D2)',
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      marginTop: '10px',
      transition: 'transform 0.2s, opacity 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
        opacity: 0.9
      }
    },
    profileHeader: {
      display: 'flex',
      gap: '20px',
      marginBottom: '30px'
    },
    profilePhoto: {
      width: '200px',
      height: '200px',
      borderRadius: '8px',
      objectFit: 'cover'
    },
    mediaGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '20px',
      marginTop: '20px'
    },
    mediaItem: {
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: 'rgba(255, 255, 255, 0.05)'
    },
    mediaImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    },
    mediaVideo: {
      width: '100%',
      height: '200px'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(to right, #4CAF50, #2196F3)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '1.5rem'
    }
  };

  const fetchAthletes = useCallback(async () => {
    try {
      const response = await axios.get('/api/donors/athletes', { params: filters });
      setAthletes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching athletes:', error);
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'athletes':
        return (
          <div className="space-y-6">
            <div className="bg-[#0F0F2D] p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input
                  type="text"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  placeholder="Search by name"
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                />
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Search by location"
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                />
                <input
                  type="number"
                  name="age"
                  value={filters.age}
                  onChange={handleFilterChange}
                  placeholder="Search by age"
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                />
                <select
                  name="sport"
                  value={filters.sport}
                  onChange={handleFilterChange}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                >
                  <option value="">All Sports</option>
                  <option value="cricket">Cricket</option>
                  <option value="football">Football</option>
                  <option value="basketball">Basketball</option>
                  <option value="athletics">Athletics</option>
                  <option value="swimming">Swimming</option>
                </select>
                <select
                  name="gender"
                  value={filters.gender}
                  onChange={handleFilterChange}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                >
                  <option value="">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {athletes.map(athlete => (
                <motion.div
                  key={athlete._id}
                  whileHover={{ y: -4 }}
                  className="bg-[#0F0F2D] rounded-lg p-6 cursor-pointer"
                  onClick={() => fetchAthleteProfile(athlete._id)}
                >
                  <h3 className="text-xl font-semibold text-white mb-4">{athlete.fullName}</h3>
                  <div className="space-y-2 text-gray-400">
                    <p><span className="font-medium">Age:</span> {athlete.age}</p>
                    <p><span className="font-medium">Sport:</span> {athlete.sportsCategory}</p>
                    <p><span className="font-medium">Location:</span> {athlete.city}, {athlete.state}</p>
                    <p><span className="font-medium">Level:</span> {athlete.currentLevel}</p>
                  </div>
                  <button
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    View Profile
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'donations':
        return <div className="text-white">Donations content coming soon...</div>;
      case 'analytics':
        return <div className="text-white">Analytics content coming soon...</div>;
      case 'events':
        return <div className="text-white">Events content coming soon...</div>;
      default:
        return null;
    }
  };

  const handleAthleteClick = (athlete) => {
    setSelectedAthlete({
      ...athlete,
      achievements: athlete.achievements || []
    });
  };

  const handleDonate = async () => {
    try {
      await axios.post(`/api/donors/donate/${selectedAthlete._id}`, {
        amount: Number(donationAmount)
      });
      alert('Donation successful!');
      setShowDonateModal(false);
      setDonationAmount('');
      setSelectedAthlete(null);
    } catch (error) {
      console.error('Error making donation:', error);
      alert('Failed to process donation');
    }
  };

  const fetchAthleteProfile = async (athleteId) => {
    try {
      const response = await axios.get(`/api/donors/athlete/${athleteId}`);
      setSelectedAthlete(response.data);
    } catch (error) {
      console.error('Error fetching athlete profile:', error);
      alert('Failed to fetch athlete profile');
    }
  };

  const renderAthleteProfile = () => {
    if (!selectedAthlete) return null;

    const profilePhoto = selectedAthlete.photos?.[0]?.url || 'default-profile-photo.jpg';

    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <div style={styles.profileHeader}>
            <img 
              src={profilePhoto} 
              alt={selectedAthlete.fullName} 
              style={styles.profilePhoto}
            />
            <div>
              <h2>{selectedAthlete.fullName}</h2>
              <p><strong>Sport:</strong> {selectedAthlete.sportsCategory}</p>
              <p><strong>Level:</strong> {selectedAthlete.currentLevel}</p>
              <p><strong>Location:</strong> {selectedAthlete.city}, {selectedAthlete.state}</p>
            </div>
          </div>

          <div>
            <h3>Photos & Videos</h3>
            <div style={styles.mediaGrid}>
              {selectedAthlete.photos?.slice(1).map((photo, index) => (
                <div key={`photo-${index}`} style={styles.mediaItem}>
                  <img src={photo.url} alt="" style={styles.mediaImage} />
                </div>
              ))}
              
              {selectedAthlete.videos?.map((video, index) => (
                <div key={`video-${index}`} style={styles.mediaItem}>
                  <video 
                    src={video.url} 
                    controls 
                    style={styles.mediaVideo}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>Personal Information</h3>
            <p><strong>Age:</strong> {selectedAthlete.age}</p>
            <p><strong>Contact:</strong> {selectedAthlete.contactNumber}</p>
            <p><strong>Guardian:</strong> {selectedAthlete.guardianName}</p>
            
            {selectedAthlete.bio && (
              <>
                <h3>Bio</h3>
                <p>{selectedAthlete.bio}</p>
              </>
            )}
            
            {selectedAthlete.achievements && (
              <div style={styles.achievementsSection}>
                <h3>Achievements</h3>
                <p>{selectedAthlete.achievements}</p>
              </div>
            )}

            <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setShowDonateModal(true)}
                style={{
                  ...styles.button,
                  background: 'linear-gradient(to right, #4CAF50, #45a049)',
                  padding: '12px 24px',
                  fontSize: '18px',
                  width: '200px'
                }}
              >
                Donate Now
              </button>

              {showDonateModal && (
                <DonateModal
                  isOpen={showDonateModal}
                  onClose={() => setShowDonateModal(false)}
                  athlete={selectedAthlete}
                />
              )}
              <button 
                onClick={() => setSelectedAthlete(null)}
                style={{
                  ...styles.closeButton,
                  padding: '12px 24px',
                  fontSize: '18px'
                }}
              >
                Close
              </button>
            </div>
          </div>


        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-white">Loading athletes...</div>;
  }

  return (
    <div className="flex h-screen bg-[#0B0B1E]">
      {/* Sidebar */}
      <div className="w-64 bg-[#0F0F2D] p-4 flex flex-col">
        <div className="flex items-center space-x-2 mb-8 px-2">
          <Trophy className="h-8 w-8 text-blue-500" />
          <span className="text-white text-xl font-bold">UnnatiVeer</span>
        </div>

        <nav className="flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 pt-4">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 transition-colors">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-[#0F0F2D] border-b border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <span className="text-white text-lg">Welcome</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>

      {selectedAthlete && renderAthleteProfile()}
    </div>
  );
};

export default DonorDashboard;

