import React, { useState } from 'react';
import axios from '../../utils/axios';

const SponsorshipForm = () => {
  const [sponsorshipData, setSponsorshipData] = useState({
    title: '',
    description: '',
    amount: {
      min: '',
      max: ''
    },
    category: '',
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
      padding: '8px 12px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '16px',
      '&[type="number"]': {
        '-moz-appearance': 'textfield'
      },
      '&[type="number"]::-webkit-outer-spin-button, &[type="number"]::-webkit-inner-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0
      }
    },
    select: {
      width: '100%',
      padding: '8px 12px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '16px'
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
      await axios.post('/api/organizations/sponsorships', sponsorshipData);
      alert('Sponsorship created successfully!');
      // Reset form
      setSponsorshipData({
        title: '',
        description: '',
        amount: {
          min: '',
          max: ''
        },
        category: '',
        requirements: ''
      });
    } catch (error) {
      console.error('Error creating sponsorship:', error);
      alert('Failed to create sponsorship');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      // Convert to number for amount fields
      const finalValue = parent === 'amount' ? Number(value) || '' : value;
      
      setSponsorshipData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: finalValue
        }
      }));
    } else {
      setSponsorshipData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <h2>Add Sponsorship</h2>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Sponsorship Title</label>
        <input
          type="text"
          name="title"
          value={sponsorshipData.title}
          onChange={handleChange}
          style={styles.input}
          required
          placeholder="Enter sponsorship title"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Category</label>
        <select
          name="category"
          value={sponsorshipData.category}
          onChange={handleChange}
          style={styles.select}
          required
        >
          <option value="">Select Category</option>
          <option value="full">Full Sponsorship</option>
          <option value="partial">Partial Sponsorship</option>
          <option value="equipment">Equipment</option>
          <option value="training">Training</option>
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
            min="0"
            step="1"
            required
            placeholder="Enter minimum amount"
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
            min="0"
            step="1"
            required
            placeholder="Enter maximum amount"
          />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Description</label>
        <textarea
          name="description"
          value={sponsorshipData.description}
          onChange={handleChange}
          style={{ ...styles.input, minHeight: '100px' }}
          required
          placeholder="Enter sponsorship description"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Requirements</label>
        <textarea
          name="requirements"
          value={sponsorshipData.requirements}
          onChange={handleChange}
          style={{ ...styles.input, minHeight: '100px' }}
          required
          placeholder="Enter sponsorship requirements"
        />
      </div>

      <button type="submit" style={styles.submitButton}>
        Add Sponsorship
      </button>
    </form>
  );
};

export default SponsorshipForm; 