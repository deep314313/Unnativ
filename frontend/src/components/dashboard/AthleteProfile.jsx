import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';

const AthleteProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [media, setMedia] = useState({
    photos: [],
    videos: []
  });
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    sportsCategory: '',
    currentLevel: '',
    achievements: '',
    city: '',
    state: '',
    bio: '',
    contactNumber: '',
    guardianName: '',
    school: '',
    coach: ''
  });

  const [selectedFiles, setSelectedFiles] = useState({
    photos: [],
    videos: []
  });

  

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/athletes/profile');
      setProfile(response.data);
      setFormData(response.data);
      setMedia({
        photos: response.data.photos || [],
        videos: response.data.videos || []
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/athletes/profile', formData);
      setEditing(false);
      fetchProfile();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    const newPhotos = [];
    const newVideos = [];

    files.forEach(file => {
      const fileURL = URL.createObjectURL(file);
      if (file.type.startsWith('image/')) {
        newPhotos.push({ file, preview: fileURL });
      } else if (file.type.startsWith('video/')) {
        newVideos.push({ file, preview: fileURL });
      }
    });

    setSelectedFiles(prev => ({
      photos: [...prev.photos, ...newPhotos],
      videos: [...prev.videos, ...newVideos]
    }));
  };

  const removeSelectedFile = (type, index) => {
    setSelectedFiles(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleUpload = async () => {
    if (selectedFiles.photos.length === 0 && selectedFiles.videos.length === 0) {
      return;
    }

    setUploadingMedia(true);
    const formData = new FormData();

    selectedFiles.photos.forEach(photo => {
      formData.append('media', photo.file);
    });

    selectedFiles.videos.forEach(video => {
      formData.append('media', video.file);
    });

    try {
      const response = await axios.post('/api/athletes/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMedia(response.data);
      setSelectedFiles({ photos: [], videos: [] });
      alert('Media uploaded successfully!');
    } catch (error) {
      console.error('Error uploading media:', error);
      alert('Failed to upload media');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full  ">
      <div className="flex justify-between items-center mb-6">
       
        <button 
          onClick={() => setEditing(!editing)}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity duration-200"
        >
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {!editing ? (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-lg">
          {/* Profile Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-6">
              {profile.fullName}
            </h1>
            
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <span className="text-gray-400">Age: </span>
                  <span className="text-white text-lg ml-2">{profile.age}</span>
                </div>
                <div>
                  <span className="text-gray-400">Sport: </span>
                  <span className="text-white text-lg ml-2">{profile.sportsCategory}</span>
                </div>
                <div>
                  <span className="text-gray-400">Level: </span>
                  <span className="text-white text-lg ml-2">{profile.currentLevel}</span>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <span className="text-gray-400">Location: </span>
                  <span className="text-white text-lg ml-2">{profile.city}, {profile.state}</span>
                </div>
                <div>
                  <span className="text-gray-400">Contact: </span>
                  <span className="text-white text-lg ml-2">{profile.contactNumber}</span>
                </div>
                <div>
                  <span className="text-gray-400">Guardian: </span>
                  <span className="text-white text-lg ml-2">{profile.guardianName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-400 mb-3">Bio</h2>
            <p className="text-white">{profile.bio || 'No bio available'}</p>
          </div>

          {/* Achievements Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-400 mb-3">Achievements</h2>
            <p className="text-white">{profile.achievements || 'No achievements listed'}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-lg">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Sport</label>
                <input
                  type="text"
                  name="sportsCategory"
                  value={formData.sportsCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Level</label>
                <input
                  type="text"
                  name="currentLevel"
                  value={formData.currentLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Guardian Name</label>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                />
              </div>
            </div>
          </div>

          {/* Bio and Achievements */}
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Achievements</label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity duration-200"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* Media Gallery Section */}
      <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-400 mb-6">Media Gallery</h2>
        
        <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
            id="mediaInput"
          />
          <label 
            htmlFor="mediaInput" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg cursor-pointer"
          >
            Upload Media
          </label>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          {media.photos.map((photo, index) => (
            <div key={`photo-${index}`} className="aspect-square rounded-lg overflow-hidden">
              <img src={photo.url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          
          {media.videos.map((video, index) => (
            <div key={`video-${index}`} className="aspect-square rounded-lg overflow-hidden">
              <video 
                src={video.url} 
                controls 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AthleteProfile;