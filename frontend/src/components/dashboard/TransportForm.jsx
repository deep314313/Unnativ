import React, { useState } from 'react';
import axios from '../../utils/axios';

const TransportForm = ({ onClose }) => {
  const [transportData, setTransportData] = useState({
    title: '',
    details: '',
    amount: {
      min: '',
      max: ''
    },
    coverageType: 'full',
    validTill: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/travel-supports', transportData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Transport support created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating transport support:', error);
      alert(error.response?.data?.message || 'Failed to create transport support');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      const finalValue = parent === 'amount' ? Number(value) || '' : value;
      setTransportData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: finalValue
        }
      }));
    } else {
      setTransportData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <form className="bg-white p-8 rounded-lg w-full max-w-3xl mx-auto" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Support Title</label>
        <input
          type="text"
          name="title"
          value={transportData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Details</label>
        <textarea
          name="details"
          value={transportData.details}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          rows="4"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Minimum Amount (₹)</label>
          <input
            type="number"
            name="amount.min"
            value={transportData.amount.min}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Maximum Amount (₹)</label>
          <input
            type="number"
            name="amount.max"
            value={transportData.amount.max}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="1"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Coverage Type</label>
        <select
          name="coverageType"
          value={transportData.coverageType}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="full">Full</option>
          <option value="partial">Partial</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Valid Till</label>
        <input
          type="date"
          name="validTill"
          value={transportData.validTill}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Create Transport Support
      </button>
    </form>
  );
};

export default TransportForm;