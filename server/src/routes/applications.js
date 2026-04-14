const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/applications/apply
router.post('/apply', authenticate, requireRole('job_seeker'), async (req, res) => {
  try {
    const { jobId, coverLetter, resumeUrl } = req.body;

    const job = await Job.findById(jobId);
    if (!job || job.status !== 'active') {
      return res.status(404).json({ message: 'Job not found or closed' });
    }

    const existing = await Application.findOne({ jobId, userId: req.user._id });
    if (existing) {
      return res.status(409).json({ message: 'Already applied to this job' });
    }

    // Basic match score: count matching skills
    const userProfile = await Profile.findOne({ userId: req.user._id });
    let matchScore = 0;
    if (userProfile && userProfile.skills.length > 0 && job.skills.length > 0) {
      const userSkillsLower = userProfile.skills.map((s) => s.toLowerCase());
      const jobSkillsLower = job.skills.map((s) => s.toLowerCase());
      const matches = userSkillsLower.filter((s) => jobSkillsLower.includes(s)).length;
      matchScore = Math.round((matches / jobSkillsLower.length) * 100);
    }

    const application = await Application.create({
      jobId,
      userId: req.user._id,
      coverLetter,
      resumeUrl,
      matchScore,
    });

    await Job.findByIdAndUpdate(jobId, { $inc: { applicantCount: 1 } });

    // Notify recruiter
    await User.findByIdAndUpdate(job.recruiterId, {
      $push: {
        notifications: {
          message: `New application for "${job.title}"`,
        },
      },
    });

    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Already applied to this job' });
    }
    res.status(500).json({ message: error.message });
  }
});

// GET /api/applications - job seeker's own applications
router.get('/', authenticate, requireRole('job_seeker'), async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate('jobId')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/applications/:id/status - recruiter updates status
router.put('/:id/status', authenticate, requireRole('recruiter'), async (req, res) => {
  try {
    const { status, recruiterNotes } = req.body;

    const application = await Application.findById(req.params.id).populate('jobId');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.jobId.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    application.status = status;
    if (recruiterNotes) application.recruiterNotes = recruiterNotes;
    await application.save();

    // Notify applicant
    const statusMessages = {
      reviewed: 'Your application has been reviewed',
      shortlisted: 'Congratulations! You\'ve been shortlisted',
      accepted: '🎉 Your application has been accepted!',
      rejected: 'Your application was not selected this time',
    };

    if (statusMessages[status]) {
      await User.findByIdAndUpdate(application.userId, {
        $push: {
          notifications: {
            message: `${statusMessages[status]} for "${application.jobId.title}"`,
          },
        },
      });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
