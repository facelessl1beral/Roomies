const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Hostel = require('../../models/Hostel');
const nodemailer = require('nodemailer');

// @route   GET /api/profile
// @desc    Get all profiles (dev only)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   GET /api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/profile/recommended
// @desc    Get recommended roommates sorted by match score
// @access  Private
router.get('/recommended', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id).select('-password');
    if (!currentUser) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    let otherUsers = await User.find({ 
      _id: { $ne: req.user.id } 
    }).select('-password');

    const score = (current, other) => {
      let s = 0;
      const fields = [
        ['roomieCountry', 'country'],
        ['roomieGender',  'gender'],
        ['roomieAge',     'age'],
        ['roomieUniv',    'univ'],
        ['roomieCourse',  'course'],
        ['roomieSem',     'sem'],
        ['roomieFood',    'food'],
        ['roomieSmoke',   'smoke'],
        ['roomieDrink',   'drink'],
        ['roomieCook',    'cook'],
      ];
      fields.forEach(([pref, trait]) => {
        if (current[pref] === "Don't Care" || current[pref] === other[trait])   s += 50;
        if (other[pref]    === "Don't Care" || other[pref]    === current[trait]) s += 50;
      });
      // Bonus for shared hostel preference
      if (current.preferredHostel && current.preferredHostel === other.preferredHostel) s += 100;
      return s * 100 / 1100;
    };

    const result = otherUsers.map(other => {
      const obj = other.toObject();
      obj.score = score(currentUser, other);
      if (currentUser.rejected?.includes(other._id.toString())) {
        obj.status = 'Rejected';
      } else if (currentUser.accepted?.includes(other._id.toString())) {
        obj.status = 'Accepted';
      } else {
        obj.status = '-';
      }
      return obj;
    });

    result.sort((a, b) => b.score - a.score);
    res.status(200).json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', auth, async (req, res) => {
  console.log('PROFILE POST BODY:', JSON.stringify(req.body, null, 2));
  try {
    const fields = [
      'avatar','name','gender','age','city','country','univ','sem','course',
      'sleepSchedule','cleanliness','studyPref','social','noise','guests','exercise',
      'food','smoke','drink','cook','notes','linkedin',
      'roomieGender','roomieAge','roomieCountry','roomieUniv',
      'roomieSem','roomieCourse','roomieFood','roomieSmoke',
      'roomieDrink','roomieCook',
      'preferredHostel','roomType','floorPref','bathroomPref','proximityPref'
    ];

    const updateData = {};
    fields.forEach(field => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    res.status(201).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/profile/reject
// @desc    Reject a user
// @access  Private
router.post('/reject', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $addToSet: { rejected: req.body.id },
        $pull:     { accepted: req.body.id }
      },
      { new: true }
    ).select('-password');

    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/profile/accept
// @desc    Accept a user
// @access  Private
router.post('/accept', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $addToSet: { accepted: req.body.id },
        $pull:     { rejected: req.body.id }
      },
      { new: true }
    ).select('-password');

    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id).select('-password');
    if (!user) return res.status(400).json({ msg: 'Profile not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
