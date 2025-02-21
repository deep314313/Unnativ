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
    <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Organization Profile</h2>
        <button 
          onClick={() => {
            if (isEditing) {
              handleUpdate();
            } else {
              setIsEditing(true);
            }
          }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isEditing ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-green-500 text-white hover:bg-green-600'}`}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
            <div className="text-gray-900">{profile.name}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="text-gray-900">{profile.email}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
            <div className="text-gray-900">{profile.registrationNumber}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Type</label>
            {isEditing ? (
              <select
                name="organizationType"
                value={profile.organizationType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Type</option>
                <option value="academy">Sports Academy</option>
                <option value="club">Sports Club</option>
                <option value="institute">Training Institute</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <div className="text-gray-900">{profile.organizationType}</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={profile.address || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <div className="text-gray-900">{profile.address}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
            {isEditing ? (
              <input
                type="text"
                name="contactNumber"
                value={profile.contactNumber || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <div className="text-gray-900">{profile.contactNumber}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            {isEditing ? (
              <textarea
                name="description"
                value={profile.description || ''}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <div className="text-gray-900">{profile.description}</div>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => {
              setIsEditing(false);
              fetchProfile();
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default OrganizationProfile;