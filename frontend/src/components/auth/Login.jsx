import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../utils/axios';

const Login = ({ userType }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      padding: '20px'
    },
    formContainer: {
      maxWidth: '400px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '30px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    title: {
      textAlign: 'center',
      marginBottom: '30px',
      color: '#2d3748',
      fontSize: '24px',
      fontWeight: '600'
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
      color: '#333'
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
      marginBottom: '15px'
    },
    registerLink: {
      textAlign: 'center',
      color: '#666',
      fontSize: '14px'
    },
    link: {
      color: '#1a73e8',
      textDecoration: 'none',
      fontWeight: '500'
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/${userType.toLowerCase()}s/login`, formData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', userType.toLowerCase());
        navigate(`/${userType.toLowerCase()}/dashboard`);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>{userType} Login</h2>
        {error && (
          <div style={{
            color: '#dc2626',
            backgroundColor: '#fef2f2',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>
            Login
          </button>
          <p style={styles.registerLink}>
            Don't have an account?{' '}
            <Link to={`/register/${userType.toLowerCase()}`} style={styles.link}>
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login; 