import React, { useState } from 'react';
import axios from '../../utils/axios';

const SponsorshipForm = () => {
  const [sponsorshipData, setSponsorshipData] = useState({
    title: '',
    category: '',
    amount: {
      min: '',
      max: ''
    },
    details: '',
    sport: '',
    level: '',
    duration: '',
    requirements: ''
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
      await axios.post('/api/organizations/sponsorships', sponsorshipData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Reset form or show success message
    } catch (error) {
      console.error('Error creating sponsorship:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSponsorshipData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <h2>Create Sponsorship Opportunity</h2>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Sponsorship Title</label>
        <input
          type="text"
          name="title"
          value={sponsorshipData.title}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Category</label>
        <select
          name="category"
          value={sponsorshipData.category}
          onChange={handleChange}
          style={styles.input}
          required
        >
          <option value="">Select Category</option>
          <option value="full">Full Sponsorship</option>
          <option value="partial">Partial Sponsorship</option>
          <option value="equipment">Equipment Support</option>
          <option value="training">Training Support</option>
        </select>
      </div>

      <div style={styles.row}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Minimum Amount (₹)</label>
          <input
            type="number"
            name="amount.min"
            value={sponsorshipData.amount.min}
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
            value={sponsorshipData.amount.max}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
      </div>

      {/* Add more sponsorship-specific fields */}
      
      <button type="submit" style={styles.submitButton}>
        Create Sponsorship
      </button>
    </form>
  );
};

export default SponsorshipForm; 