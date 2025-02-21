const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Organization
router.post('/register', async (req, res) => {
  try {
    const { email, password, organizationName, organizationType, registrationNumber } = req.body;

    // Check if organization already exists
    const existingOrg = await Organization.findOne({ email });
    if (existingOrg) {
      return res.status(400).json({ message: 'Organization already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new organization
    const organization = new Organization({
      email,
      password: hashedPassword,
      name: organizationName,
      organizationType,
      registrationNumber,
      // Add other fields as needed
    });

    await organization.save();

    // Create JWT token
    const token = jwt.sign(
      { id: organization._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      organization: {
        id: organization._id,
        name: organization.name,
        email: organization.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const organization = await Organization.findOne({ email });
    if (!organization) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, organization.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: organization._id, 
        type: 'organization',
        email: organization.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      organization: {
        id: organization._id,
        name: organization.name,
        email: organization.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Create Event
router.post('/events', auth, async (req, res) => {
  try {
    const {
      title,
      eventType,
      description,
      date,
      endDate,
      location,
      sport,
      level,
      travelAllowance
    } = req.body;

    // Create new event
    const event = new Event({
      title,
      eventType,
      description,
      date,
      endDate,
      location,
      sport,
      level,
      travelAllowance,
      organization: req.user.id // Add the organization reference
    });

    await event.save();

    // Update organization's events array
    await Organization.findByIdAndUpdate(
      req.user.id,
      { $push: { events: event._id } }
    );

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ 
      message: 'Error creating event',
      error: error.message 
    });
  }
});

// Get Organization's Events
router.get('/events', auth, async (req, res) => {
  try {
    const organization = await Organization.findById(req.user.id)
      .populate('events');
    res.json(organization.events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Organization Profile
router.get('/profile', auth, async (req, res) => {
  try {
    const organization = await Organization.findById(req.user.id)
      .select('-password'); // Exclude password from the response
    
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.json(organization);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Organization Profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Prevent password update through this route

    const organization = await Organization.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select('-password');

    res.json(organization);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 