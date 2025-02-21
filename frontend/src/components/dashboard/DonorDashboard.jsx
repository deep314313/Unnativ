import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../utils/axios';
import AthleteProfile from './AthleteProfile';

const DonorDashboard = () => {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    location: '',
    age: '',
    sport: '',
    gender: ''
  });

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    filters: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
      border: '1px solid #ddd',
      fontSize: '14px'
    },
    select: {
      width: '100%',
      padding: '8px 12px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '14px'
    },
    athleteGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px'
    },
    athleteCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-5px)'
      }
    },
    modal: {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
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
      maxWidth: '800px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto'
    },
    button: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      marginTop: '10px'
    },
    closeButton: {
      backgroundColor: '#f44336',
      marginLeft: '10px'
    },
    achievementTag: {
      backgroundColor: '#e2e8f0',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      marginRight: '8px',
      marginBottom: '8px',
      display: 'inline-block'
    },
    viewProfileButton: {
      backgroundColor: '#2196F3',
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      marginTop: '10px'
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
      overflow: 'hidden'
    },
    mediaImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    },
    mediaVideo: {
      width: '100%',
      height: '200px'
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
          </div>

          <button 
            onClick={() => setSelectedAthlete(null)}
            style={styles.closeButton}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Loading athletes...</div>;
  }

  return (
    <div style={styles.container}>
      <h1>Support Athletes</h1>
      
      {/* Filters */}
      <div style={styles.filters}>
        <div style={styles.filterRow}>
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Search by name"
            style={styles.input}
          />
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Search by location"
            style={styles.input}
          />
          <input
            type="number"
            name="age"
            value={filters.age}
            onChange={handleFilterChange}
            placeholder="Search by age"
            style={styles.input}
          />
          <select
            name="sport"
            value={filters.sport}
            onChange={handleFilterChange}
            style={styles.select}
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
            style={styles.select}
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Athletes Grid */}
      <div style={styles.athleteGrid}>
        {athletes.map(athlete => (
          <div
            key={athlete._id}
            style={styles.athleteCard}
          >
            <h3>{athlete.fullName}</h3>
            <p><strong>Age:</strong> {athlete.age}</p>
            <p><strong>Sport:</strong> {athlete.sportsCategory}</p>
            <p><strong>Location:</strong> {athlete.city}, {athlete.state}</p>
            <p><strong>Level:</strong> {athlete.currentLevel}</p>
            <button
              onClick={() => fetchAthleteProfile(athlete._id)}
              style={styles.viewProfileButton}
            >
              View Profile
            </button>
          </div>
        ))}
      </div>

      {selectedAthlete && renderAthleteProfile()}
    </div>
  );
};

export default DonorDashboard; 