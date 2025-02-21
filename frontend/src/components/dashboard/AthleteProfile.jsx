import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';

const AthleteProfile = () => {
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

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <button 
          className={`px-5 py-2 rounded-md text-white transition-colors duration-300 ${editing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          onClick={() => setEditing(!editing)}
        >
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-md mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Sports Category</label>
            <select
              name="sportsCategory"
              value={formData.sportsCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Sport</option>
              <option value="cricket">Cricket</option>
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
              <option value="athletics">Athletics</option>
              <option value="swimming">Swimming</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Current Level</label>
            <select
              name="currentLevel"
              value={formData.currentLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="school">School</option>
              <option value="district">District</option>
              <option value="state">State</option>
              <option value="national">National</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Guardian Name</label>
            <input
              type="text"
              name="guardianName"
              value={formData.guardianName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Achievements</label>
            <textarea
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
              placeholder="List your achievements (e.g., Won district-level cricket tournament 2023, State champion in athletics 2022)"
            />
          </div>

          <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-300">
            Save Changes
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{profile.fullName}</h2>
          <div className="space-y-3">
            <p className="text-gray-700"><strong className="font-semibold">Age:</strong> {profile.age}</p>
            <p className="text-gray-700"><strong className="font-semibold">Sport:</strong> {profile.sportsCategory}</p>
            <p className="text-gray-700"><strong className="font-semibold">Level:</strong> {profile.currentLevel}</p>
            <p className="text-gray-700"><strong className="font-semibold">Contact:</strong> {profile.contactNumber}</p>
            <p className="text-gray-700"><strong className="font-semibold">Guardian:</strong> {profile.guardianName}</p>
            <p className="text-gray-700"><strong className="font-semibold">Location:</strong> {profile.city}, {profile.state}</p>
            <p className="text-gray-700"><strong className="font-semibold">Bio:</strong> {profile.bio}</p>
          </div>
          
          {profile.achievements && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Achievements</h3>
              <p className="text-gray-700">{profile.achievements}</p>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg p-6 shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Photos & Videos</h2>
        
        <div className="mt-4 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
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
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors duration-300"
          >
            Select Files
          </label>
          
          {(selectedFiles.photos.length > 0 || selectedFiles.videos.length > 0) && (
            <button 
              onClick={handleUpload}
              className={`mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300 ${uploadingMedia ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={uploadingMedia}
            >
              {uploadingMedia ? 'Uploading...' : 'Upload Selected Files'}
            </button>
          )}
        </div>

        {/* Preview of selected files */}
        {(selectedFiles.photos.length > 0 || selectedFiles.videos.length > 0) && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
            {selectedFiles.photos.map((photo, index) => (
              <div key={`photo-preview-${index}`} className="relative aspect-square rounded-lg overflow-hidden">
                <img src={photo.preview} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeSelectedFile('photos', index)}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500/70 text-white rounded-full hover:bg-red-600/70 transition-colors duration-300"
                >
                  ×
                </button>
              </div>
            ))}
            
            {selectedFiles.videos.map((video, index) => (
              <div key={`video-preview-${index}`} className="relative aspect-square rounded-lg overflow-hidden">
                <video src={video.preview} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeSelectedFile('videos', index)}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500/70 text-white rounded-full hover:bg-red-600/70 transition-colors duration-300"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Existing media display */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
          {media.photos.map((photo, index) => (
            <div key={`photo-${index}`} className="relative aspect-square rounded-lg overflow-hidden">
              <img src={photo.url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          
          {media.videos.map((video, index) => (
            <div key={`video-${index}`} className="relative aspect-square rounded-lg overflow-hidden">
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