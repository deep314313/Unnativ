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
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
    // Get athlete's applications with populated event and organization details
    const applications = await Application.find({ athlete: req.user.id })
      .populate({
        path: 'event',
        select: 'title organization',
        populate: {
          path: 'organization',
          select: 'name'
        }
      })
      .populate('itemId', 'title') // For sponsorships/travel supports
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ 
      message: 'Error fetching applications',
      error: error.message 
    });
  }
});

// Upload media
router.post('/media', auth, upload.array('media', 10), async (req, res) => {
  try {
    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "athlete-media"
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(file.buffer);
      });
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    const mediaUrls = uploadedFiles.map(file => ({
      url: file.secure_url,
      type: file.resource_type,
      publicId: file.public_id
    }));

    // Update athlete's media in database
    const athlete = await Athlete.findById(req.user.id);
    
    mediaUrls.forEach(media => {
      if (media.type === 'image') {
        athlete.photos.push(media);
      } else if (media.type === 'video') {
        athlete.videos.push(media);
      }
    });

    await athlete.save();

    res.json({
      photos: athlete.photos,
      videos: athlete.videos
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ message: 'Failed to upload media' });
  }
});

// Get athlete profile
router.get('/profile', auth, async (req, res) => {
  try {
    const athlete = await Athlete.findById(req.user.id)
      .select('-password');
    
    if (!athlete) {
      return res.status(404).json({ message: 'Athlete not found' });
    }

    res.json(athlete);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update athlete profile
router.put('/profile', auth, async (req, res) => {
  try {
    const {
      fullName,
      age,
      sportsCategory,
      currentLevel,
      contactNumber,
      guardianName,
      city,
      state,
      bio,
      achievements
    } = req.body;

    const athlete = await Athlete.findById(req.user.id);
    if (!athlete) {
      return res.status(404).json({ message: 'Athlete not found' });
    }

    // Update fields
    athlete.fullName = fullName || athlete.fullName;
    athlete.age = age || athlete.age;
    athlete.sportsCategory = sportsCategory || athlete.sportsCategory;
    athlete.currentLevel = currentLevel || athlete.currentLevel;
    athlete.contactNumber = contactNumber || athlete.contactNumber;
    athlete.guardianName = guardianName || athlete.guardianName;
    athlete.city = city || athlete.city;
    athlete.state = state || athlete.state;
    athlete.bio = bio || athlete.bio;
    athlete.achievements = achievements || athlete.achievements;

    await athlete.save();

    res.json(athlete);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 