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

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    profileSection: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    mediaGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '20px',
      marginTop: '20px'
    },
    mediaItem: {
      position: 'relative',
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
    },
    mediaPreview: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '15px',
      marginTop: '20px'
    },
    previewItem: {
      position: 'relative',
      borderRadius: '8px',
      overflow: 'hidden',
      aspectRatio: '1',
    },
    previewImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    previewVideo: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    removeButton: {
      position: 'absolute',
      top: '5px',
      right: '5px',
      backgroundColor: 'rgba(255, 0, 0, 0.7)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '25px',
      height: '25px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    uploadContainer: {
      marginTop: '20px',
      padding: '20px',
      border: '2px dashed #ddd',
      borderRadius: '8px',
      textAlign: 'center'
    },
    fileInput: {
      display: 'none'
    },
    uploadButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '10px'
    },
    editButton: {
      backgroundColor: '#2196F3',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      marginBottom: '10px',
      borderRadius: '4px',
      border: '1px solid #ddd'
    },
    textarea: {
      width: '100%',
      padding: '8px 12px',
      marginBottom: '10px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      minHeight: '100px'
    },
    uploadProgress: {
      marginTop: '10px',
      color: '#666'
    },
    achievementsSection: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px'
    },
    achievementsText: {
      whiteSpace: 'pre-wrap',
      lineHeight: '1.6'
    }
  };

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
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>My Profile</h1>
        <button 
          style={styles.editButton}
          onClick={() => setEditing(!editing)}
        >
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} style={styles.profileSection}>
          <div>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div>
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div>
            <label>Sports Category</label>
            <select
              name="sportsCategory"
              value={formData.sportsCategory}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Select Sport</option>
              <option value="cricket">Cricket</option>
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
              <option value="athletics">Athletics</option>
              <option value="swimming">Swimming</option>
            </select>
          </div>

          <div>
            <label>Current Level</label>
            <select
              name="currentLevel"
              value={formData.currentLevel}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="school">School</option>
              <option value="district">District</option>
              <option value="state">State</option>
              <option value="national">National</option>
            </select>
          </div>

          <div>
            <label>Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div>
            <label>Guardian Name</label>
            <input
              type="text"
              name="guardianName"
              value={formData.guardianName}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div>
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div>
            <label>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div>
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label>Achievements</label>
            <textarea
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="List your achievements (e.g., Won district-level cricket tournament 2023, State champion in athletics 2022)"
            />
          </div>

          <button type="submit" style={styles.uploadButton}>
            Save Changes
          </button>
        </form>
      ) : (
        <div style={styles.profileSection}>
          <h2>{profile.fullName}</h2>
          <p><strong>Age:</strong> {profile.age}</p>
          <p><strong>Sport:</strong> {profile.sportsCategory}</p>
          <p><strong>Level:</strong> {profile.currentLevel}</p>
          <p><strong>Contact:</strong> {profile.contactNumber}</p>
          <p><strong>Guardian:</strong> {profile.guardianName}</p>
          <p><strong>Location:</strong> {profile.city}, {profile.state}</p>
          <p><strong>Bio:</strong> {profile.bio}</p>
          
          {profile.achievements && (
            <div style={styles.achievementsSection}>
              <h3>Achievements</h3>
              <p style={styles.achievementsText}>{profile.achievements}</p>
            </div>
          )}
        </div>
      )}

      <div style={styles.profileSection}>
        <h2>Photos & Videos</h2>
        
        <div style={styles.uploadContainer}>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            style={styles.fileInput}
            id="mediaInput"
          />
          <label htmlFor="mediaInput" style={styles.uploadButton}>
            Select Files
          </label>
          
          {(selectedFiles.photos.length > 0 || selectedFiles.videos.length > 0) && (
            <button 
              onClick={handleUpload}
              style={styles.uploadButton}
              disabled={uploadingMedia}
            >
              {uploadingMedia ? 'Uploading...' : 'Upload Selected Files'}
            </button>
          )}
        </div>

        {/* Preview of selected files */}
        {(selectedFiles.photos.length > 0 || selectedFiles.videos.length > 0) && (
          <div style={styles.mediaPreview}>
            {selectedFiles.photos.map((photo, index) => (
              <div key={`photo-preview-${index}`} style={styles.previewItem}>
                <img src={photo.preview} alt="" style={styles.previewImage} />
                <button
                  onClick={() => removeSelectedFile('photos', index)}
                  style={styles.removeButton}
                >
                  ×
                </button>
              </div>
            ))}
            
            {selectedFiles.videos.map((video, index) => (
              <div key={`video-preview-${index}`} style={styles.previewItem}>
                <video src={video.preview} style={styles.previewVideo} />
                <button
                  onClick={() => removeSelectedFile('videos', index)}
                  style={styles.removeButton}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Existing media display */}
        <div style={styles.mediaGrid}>
          {media.photos.map((photo, index) => (
            <div key={`photo-${index}`} style={styles.mediaItem}>
              <img src={photo.url} alt="" style={styles.mediaImage} />
            </div>
          ))}
          
          {media.videos.map((video, index) => (
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
    </div>
  );
};

export default AthleteProfile; 