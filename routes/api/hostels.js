const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const Hostel = require('../../models/Hostel');
const User = require('../../models/User');

// Register hostel
router.post('/register', [
  check('name', 'Hostel name required').not().isEmpty(),
  check('contactEmail', 'Valid email required').isEmail(),
  check('password', 'Password must be 6+ chars').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, contactEmail, password, location, description } = req.body;
  try {
    let hostel = await Hostel.findOne({ name });
    if (hostel) return res.status(400).json({ errors: [{ msg: 'Hostel already registered' }] });

    hostel = new Hostel({ name, contactEmail, password, location, description });
    const salt = await bcrypt.genSalt(10);
    hostel.password = await bcrypt.hash(password, salt);
    await hostel.save();

    const payload = { hostel: { id: hostel.id, role: 'admin' } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login hostel
router.post('/login', [
  check('name', 'Hostel name required').not().isEmpty(),
  check('password', 'Password required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, password } = req.body;
  try {
    const hostel = await Hostel.findOne({ name });
    if (!hostel) return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });

    const isMatch = await bcrypt.compare(password, hostel.password);
    if (!isMatch) return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });

    const payload = { hostel: { id: hostel.id, role: 'admin' } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get all hostels — for student dropdown
router.get('/', async (req, res) => {
  try {
    const hostels = await Hostel.find().select('name location description');
    res.json(hostels);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get mutual matches for this hostel — admin dashboard
router.get('/matches', async (req, res) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.hostel || decoded.hostel.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });

    const hostel = await Hostel.findById(decoded.hostel.id);
    const students = await User.find({ preferredHostel: hostel.name });

    const matches = [];
    for (const student of students) {
      for (const acceptedId of student.accepted) {
        const other = await User.findById(acceptedId);
        if (
          other &&
          other.preferredHostel === hostel.name &&
          other.accepted.includes(student._id.toString())
        ) {
          const alreadyAdded = matches.some(m =>
            m.studentA._id.toString() === other._id.toString() &&
            m.studentB._id.toString() === student._id.toString()
          );
          if (!alreadyAdded) matches.push({ studentA: student, studentB: other });
        }
      }
    }
    res.json(matches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

// Add a room to this hostel
router.post('/rooms', async (req, res) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.hostel || decoded.hostel.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
    const hostel = await Hostel.findById(decoded.hostel.id);
    const { roomNumber, type, floor, bathroom, proximity, capacity } = req.body;
    hostel.rooms.push({ roomNumber, type, floor, bathroom, proximity, capacity });
    await hostel.save();
    res.json(hostel.rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all rooms for this hostel
router.get('/rooms', async (req, res) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hostel = await Hostel.findById(decoded.hostel.id);
    res.json(hostel.rooms);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Confirm a match — assign students to a room
router.post('/matches/confirm', async (req, res) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.hostel || decoded.hostel.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });

    const { studentAId, studentBId, roomId } = req.body;
    const hostel = await Hostel.findById(decoded.hostel.id);

    // Update room status and occupants
    const room = hostel.rooms.id(roomId);
    if (!room) return res.status(404).json({ msg: 'Room not found' });
    room.status = 'pending';
    room.occupants = [studentAId, studentBId];
    await hostel.save();

    // Update both students
    await User.findByIdAndUpdate(studentAId, {
      bookingStatus: 'confirmed',
      assignedRoom: room.roomNumber,
      assignedHostel: hostel.name
    });
    await User.findByIdAndUpdate(studentBId, {
      bookingStatus: 'confirmed',
      assignedRoom: room.roomNumber,
      assignedHostel: hostel.name
    });

    res.json({ msg: 'Booking confirmed', room: room.roomNumber, hostel: hostel.name });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a room
router.delete('/rooms/:roomId', async (req, res) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hostel = await Hostel.findById(decoded.hostel.id);
    hostel.rooms = hostel.rooms.filter(r => r._id.toString() !== req.params.roomId);
    await hostel.save();
    res.json(hostel.rooms);
  } catch (err) {
    res.status(500).send('Server error');
  }
});
