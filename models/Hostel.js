const mongoose = require('mongoose');

const HostelSchema = new mongoose.Schema({
  name:         { type: String, required: true, unique: true },
  contactEmail: { type: String, required: true },
  password:     { type: String, required: true },
  location:     { type: String, default: '' },
  description:  { type: String, default: '' },
  createdAt:    { type: Date, default: Date.now },
  rooms: [{
    roomNumber: { type: String, required: true },
    type:       { type: String, default: '' },
    floor:      { type: String, default: '' },
    bathroom:   { type: String, default: '' },
    proximity:  { type: String, default: '' },
    capacity:   { type: Number, default: 2 },
    occupants:  { type: [String], default: [] },
    status:     { type: String, default: 'available' }
  }]
});

module.exports = mongoose.model('Hostel', HostelSchema);
