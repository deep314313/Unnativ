import React, { useState } from 'react';
import axios from '../../utils/axios';

const TransportForm = () => {
  const [transportData, setTransportData] = useState({
    title: '',
    amount: {
      min: '',
      max: ''
    },
    details: '',
    eligibility: '',
    mode: '',
    coverage: ''
  });

  const styles = {
    form: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '8px',
      width: '100%',
      maxWidth: '800px',
      margin: '0'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      color: '#444'
    },
    input: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px'
    },
    row: {
      display: 'flex',
      gap: '20px'
    },
    submitButton: {
      padding: '10px 20px',
      backgroundColor: '#FF6B6B',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      marginTop: '20px'
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/organizations/transport-supports', transportData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Reset form or show success message
    } catch (error) {
      console.error('Error creating transport support:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransportData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <h2>Add Transport Support</h2>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Support Title</label>
        <input
          type="text"
          name="title"
          value={transportData.title}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      <div style={styles.row}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Minimum Amount (₹)</label>
          <input
            type="number"
            name="amount.min"
            value={transportData.amount.min}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Maximum Amount (₹)</label>
          <input
            type="number"
            name="amount.max"
            value={transportData.amount.max}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
      </div>

      {/* Add more transport-specific fields */}
      
      <button type="submit" style={styles.submitButton}>
        Add Transport Support
      </button>
    </form>
  );
};

export default TransportForm; 