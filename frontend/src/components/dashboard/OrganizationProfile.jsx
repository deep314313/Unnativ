import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';

const OrganizationProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    organizationType: '',
    registrationNumber: '',
    foundedYear: '',
    address: '',
    city: '',
    state: '',
    contactNumber: '',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const styles = {
    container: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '8px',
      width: '100%',
      maxWidth: '800px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px'
    },
    section: {
      marginBottom: '25px',
      borderBottom: '1px solid #eee',
      paddingBottom: '15px'
    },
    label: {
      fontWeight: '500',
      color: '#666',
      marginBottom: '8px',
      display: 'block'
    },
    value: {
      color: '#2d3748',
      fontSize: '16px'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px'
    },
    editButton: {
      padding: '8px 16px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    saveButton: {
      padding: '8px 16px',
      backgroundColor: '#1a73e8',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    errorMessage: {
      color: '#dc2626',
      backgroundColor: '#fef2f2',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '20px'
    },
    successMessage: {
      color: '#059669',
      backgroundColor: '#f0fdf4',
      padding: '10px',
      borderRadius: '4px',
      marginBottom: '20px'
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login again');
        return;
      }

      const response = await axios.get('/api/organizations/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please login again');
      } else {
        setError('Failed to load profile data');
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login again');
        return;
      }

      const response = await axios.put('/api/organizations/profile', profile, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProfile(response.data);
      setIsEditing(false);
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please login again');
      } else {
        setError('Failed to update profile');
      }
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Organization Profile</h2>
        <button 
          style={isEditing ? styles.saveButton : styles.editButton}
          onClick={() => {
            if (isEditing) {
              handleUpdate();
            } else {
              setIsEditing(true);
            }
          }}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}

      <div style={styles.section}>
        <label style={styles.label}>Organization Name</label>
        <div style={styles.value}>{profile.name}</div>
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Email</label>
        <div style={styles.value}>{profile.email}</div>
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Registration Number</label>
        <div style={styles.value}>{profile.registrationNumber}</div>
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Organization Type</label>
        {isEditing ? (
          <select
            name="organizationType"
            value={profile.organizationType}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Type</option>
            <option value="academy">Sports Academy</option>
            <option value="club">Sports Club</option>
            <option value="institute">Training Institute</option>
            <option value="other">Other</option>
          </select>
        ) : (
          <div style={styles.value}>{profile.organizationType}</div>
        )}
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Address</label>
        {isEditing ? (
          <input
            name="address"
            value={profile.address || ''}
            onChange={handleChange}
            style={styles.input}
          />
        ) : (
          <div style={styles.value}>{profile.address}</div>
        )}
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Contact Number</label>
        {isEditing ? (
          <input
            name="contactNumber"
            value={profile.contactNumber || ''}
            onChange={handleChange}
            style={styles.input}
          />
        ) : (
          <div style={styles.value}>{profile.contactNumber}</div>
        )}
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Description</label>
        {isEditing ? (
          <textarea
            name="description"
            value={profile.description || ''}
            onChange={handleChange}
            style={{ ...styles.input, minHeight: '100px' }}
          />
        ) : (
          <div style={styles.value}>{profile.description}</div>
        )}
      </div>

      {isEditing && (
        <div style={{ marginTop: '20px' }}>
          <button 
            style={{ ...styles.saveButton, marginRight: '10px' }}
            onClick={handleUpdate}
          >
            Save Changes
          </button>
          <button 
            style={{ ...styles.editButton, backgroundColor: '#dc2626' }}
            onClick={() => {
              setIsEditing(false);
              fetchProfile();
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default OrganizationProfile; 