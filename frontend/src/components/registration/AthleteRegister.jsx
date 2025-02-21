import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';

const AthleteRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    age: '',
    sportsCategory: '',
    currentLevel: '',
    contactNumber: '',
    guardianName: '',
    city: '',
    state: '',
    achievements: ''
  });

  // Shared styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      padding: '20px'
    },
    formContainer: {
      maxWidth: '500px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '30px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontSize: '15px',
      color: '#444',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      backgroundColor: '#f8fafc',
      color: '#333',
      transition: 'border-color 0.2s ease',
      '&:focus': {
        borderColor: '#4299e1',
        outline: 'none'
      }
    },
    select: {
      width: '100%',
      padding: '8px 12px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      backgroundColor: '#f8fafc',
      color: '#333',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 8px center',
      backgroundSize: '16px',
      paddingRight: '32px'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px'
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#1a73e8',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '15px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      '&:hover': {
        backgroundColor: '#1557b0'
      }
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
      const response = await axios.post('/api/athletes/register', formData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/athlete/dashboard');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '30px', 
          color: '#2d3748',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          Athlete Registration
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              style={styles.input}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Age</label>
              <input
                type="text"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Phone number"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Sports Category</label>
            <select
              name="sportsCategory"
              value={formData.sportsCategory}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">Select sport</option>
              <option value="cricket">Cricket</option>
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
              <option value="tennis">Tennis</option>
              <option value="athletics">Athletics</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Current Level</label>
            <select
              name="currentLevel"
              value={formData.currentLevel}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">Select level</option>
              <option value="school">School</option>
              <option value="district">District</option>
              <option value="state">State</option>
              <option value="national">National</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Guardian Name (if under 18)</label>
            <input
              type="text"
              name="guardianName"
              value={formData.guardianName}
              onChange={handleChange}
              placeholder="Parent/Guardian name"
              style={styles.input}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Achievements</label>
            <textarea
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              placeholder="List your major achievements"
              style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
            />
          </div>

          <button type="submit" style={styles.button}>
            Register as Athlete
          </button>
        </form>
      </div>
    </div>
  );
};

export default AthleteRegister;
