const express = require('express');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Profile = require('../models/Profile');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/jobs - list all active jobs with filtering
router.get('/', async (req, res) => {
  try {
    const { search, location, type, experienceLevel, page = 1, limit = 10 } = req.query;
    const filter = { status: 'active' };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (type) filter.type = type;
    if (experienceLevel) filter.experienceLevel = experienceLevel;

    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
      .populate('recruiterId', 'email avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ jobs, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiterId', 'email avatar');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/jobs - recruiter only
router.post('/', authenticate, requireRole('recruiter'), async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, recruiterId: req.user._id });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/jobs/:id - recruiter only
router.put('/:id', authenticate, requireRole('recruiter'), async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, recruiterId: req.user._id },
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/jobs/:id
router.delete('/:id', authenticate, requireRole('recruiter'), async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, recruiterId: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/jobs/:id/applications - recruiter views applicants
router.get('/:id/applications', authenticate, requireRole('recruiter'), async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, recruiterId: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });

    const applications = await Application.find({ jobId: req.params.id })
      .populate('userId', 'email avatar')
      .sort({ createdAt: -1 });

    // Attach profiles
    const enriched = await Promise.all(
      applications.map(async (app) => {
        const profile = await Profile.findOne({ userId: app.userId._id });
        return { ...app.toObject(), profile };
      })
    );

    res.json({ job, applications: enriched });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/jobs/recruiter/mine - recruiter's own jobs
router.get('/recruiter/mine', authenticate, requireRole('recruiter'), async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
