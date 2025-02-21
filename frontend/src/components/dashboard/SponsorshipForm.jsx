import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';

const SponsorshipForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [sponsorships, setSponsorships] = useState([]);
  const [sponsorshipData, setSponsorshipData] = useState({
    title: '',
    description: '',
    amount: '',
    sport: '',
    status: 'active'
  });

  useEffect(() => {
    fetchSponsorships();
  }, []);

  const fetchSponsorships = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/sponsorships', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSponsorships(response.data);
    } catch (error) {
      console.error('Error fetching sponsorships:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...sponsorshipData,
        amount: Number(sponsorshipData.amount)
      };

      const token = localStorage.getItem('token');
      await axios.post('/api/sponsorships', formattedData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchSponsorships();
      alert('Sponsorship created successfully!');
      // Reset form
      setSponsorshipData({
        title: '',
        description: '',
        amount: '',
        sport: '',
        status: 'active'
      });
    } catch (error) {
      console.error('Error creating sponsorship:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create sponsorship. Please try again.';
      alert(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSponsorshipData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderSponsorshipCard = (sponsorship) => (
    <div key={sponsorship._id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{sponsorship.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{sponsorship.sport}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${sponsorship.status === 'active' ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
          {sponsorship.status}
        </span>
      </div>
      <div className="text-sm text-gray-700 space-y-2">
        <p><span className="font-medium">Amount:</span> ₹{sponsorship.amount}</p>
        <p className="mt-2 text-gray-600">{sponsorship.description}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Sponsorships</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors duration-200"
        >
          Add New
        </button>
      </div>

      {!showForm ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsorships.map(sponsorship => renderSponsorshipCard(sponsorship))}
        </div>
      ) : (
        <form className="bg-white p-8 rounded-lg w-full max-w-3xl mx-auto" onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add Sponsorship</h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              ×
            </button>
          </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Sponsorship Title</label>
        <input
          type="text"
          name="title"
          value={sponsorshipData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          placeholder="Enter sponsorship title"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Sport Category</label>
        <select
          name="sport"
          value={sponsorshipData.sport}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Sport</option>
          <option value="cricket">Cricket</option>
          <option value="football">Football</option>
          <option value="basketball">Basketball</option>
          <option value="athletics">Athletics</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Amount (₹)</label>
        <input
          type="number"
          name="amount"
          value={sponsorshipData.amount}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="0"
          step="1"
          required
          placeholder="Enter sponsorship amount"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">Description</label>
        <textarea
          name="description"
          value={sponsorshipData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-vertical"
          required
          placeholder="Enter sponsorship description"
        />
      </div>

      <button type="submit" className="w-full bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded-md transition-colors duration-300 mt-6">
        Add Sponsorship
      </button>
    </form>
      )}
    </div>
  );
};

export default SponsorshipForm;