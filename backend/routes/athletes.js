const express = require('express');
const router = express.Router();
const Athlete = require('../models/Athlete');
const Event = require('../models/Event');
const Application = require('../models/Application');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Sponsorship = require('../models/Sponsorship');
const TravelSupport = require('../models/TravelSupport');

// Register Athlete
router.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      fullName,
      age,
      sportsCategory,
      currentLevel,
      contactNumber,
      guardianName,
      city,
      state,
      achievements
    } = req.body;

    // Check if athlete already exists
    const existingAthlete = await Athlete.findOne({ email });
    if (existingAthlete) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new athlete
    const athlete = new Athlete({
      email,
      password: hashedPassword,
      fullName,
      age,
      sportsCategory,
      currentLevel,
      contactNumber,
      guardianName,
      city,
      state,
      achievements
    });

    await athlete.save();

    // Create JWT token
    const token = jwt.sign(
      { id: athlete._id, type: 'athlete' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      athlete: {
        id: athlete._id,
        name: athlete.fullName,
        email: athlete.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Apply for Event
router.post('/apply/event/:eventId', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const eventId = req.params.eventId;

    const application = new Application({
      athlete: req.user.id,
      event: eventId,
      message
    });

    await application.save();

    // Update athlete's applications array
    await Athlete.findByIdAndUpdate(
      req.user.id,
      { $push: { applications: application._id } }
    );

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Available Events
router.get('/events', auth, async (req, res) => {
  try {
    // Get all upcoming events
    const events = await Event.find({ 
      status: 'upcoming',
      date: { $gte: new Date() }
    })
    .populate('organization', 'name email') // Include organization details
    .sort({ date: -1 });

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const athlete = await Athlete.findOne({ email });
    if (!athlete) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, athlete.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: athlete._id, type: 'athlete' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      athlete: {
        id: athlete._id,
        name: athlete.fullName,
        email: athlete.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get all available sponsorships
router.get('/sponsorships', async (req, res) => {
  try {
    const sponsorships = await Sponsorship.find({ status: 'active' })
      .populate('organization', 'name');
    res.json(sponsorships);
  } catch (error) {
    console.error('Error fetching sponsorships:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all available travel supports
router.get('/travel-supports', async (req, res) => {
  try {
    const travelSupports = await TravelSupport.find({ status: 'active' })
      .populate('organization', 'name');
    res.json(travelSupports);
  } catch (error) {
    console.error('Error fetching travel supports:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply for an opportunity (event/sponsorship/travel)
router.post('/apply/:type/:id', auth, async (req, res) => {
  try {
    const { type, id } = req.params;
    const { message } = req.body;

    const application = new Application({
      athlete: req.user.id,
      type,
      itemId: id,
      message
    });

    await application.save();

    // Update the athlete's applications array
    await Athlete.findByIdAndUpdate(
      req.user.id,
      { $push: { applications: application._id } }
    );

    res.status(201).json(application);
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get athlete's applications
router.get('/applications', auth, async (req, res) => {
  try {
    const athlete = await Athlete.findById(req.user.id)
      .populate({
        path: 'applications',
        populate: {
          path: 'itemId',
          select: 'title organization'
        }
      });
    res.json(athlete.applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 