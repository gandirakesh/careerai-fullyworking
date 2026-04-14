const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ✅ FIXED SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { email, password, role, full_name } = req.body;

    // ✅ normalize role
    const normalizedRole =
      role === 'jobseeker' ? 'job_seeker' :
      role === 'recruiter' ? 'recruiter' :
      '';

    // ✅ validation
    if (!email || !password || !normalizedRole || !full_name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['job_seeker', 'recruiter'].includes(normalizedRole)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // ✅ create user
    const user = await User.create({
      email,
      password,
      role: normalizedRole,
    });

    await Profile.create({
      userId: user._id,
      full_name,
    });

    const token = generateToken(user._id);

    res.status(201).json({ token, user });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message });
  }
});


// LOGIN (unchanged)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.json({ token, user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ME
router.get('/me', authenticate, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    res.json({ user: req.user, profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;