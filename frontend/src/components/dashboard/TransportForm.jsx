import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';

const TransportForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [travelSupports, setTravelSupports] = useState([]);
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
  useEffect(() => {
    fetchTravelSupports();
  }, []);

  const fetchTravelSupports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/travel-supports', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTravelSupports(response.data);
    } catch (error) {
      console.error('Error fetching travel supports:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/travel-supports', transportData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchTravelSupports();
      setTransportData({
        title: '',
        details: '',
        amount: {
          min: '',
          max: ''
        },
        coverageType: 'full',
        validTill: ''
      });
      alert('Transport support created successfully!');
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
  const renderTravelSupportCard = (support) => (
    <div key={support._id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{support.title}</h3>
          <p className="text-sm text-gray-600 mb-2">
            Valid till: {new Date(support.validTill).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white`}>
          {support.coverageType}
        </span>
      </div>
      <div className="text-sm text-gray-700 space-y-2">
        <p><span className="font-medium">Amount Range:</span> ₹{support.amount.min} - ₹{support.amount.max}</p>
        <p className="mt-2 text-gray-600">{support.details}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Travel Support</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Add New
        </button>
      </div>

      {!showForm ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {travelSupports.map(support => renderTravelSupportCard(support))}
        </div>
      ) : (
        <form className="bg-white p-8 rounded-lg w-full max-w-3xl mx-auto" onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add Transport Support</h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              ×
            </button>
          </div>
      
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
      )}
    </div>
  );
};

export default TransportForm;