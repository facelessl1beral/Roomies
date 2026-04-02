const mongoose = require('mongoose');

const HostelSchema = new mongoose.Schema({
  name:         { type: String, required: true, unique: true },
  contactEmail: { type: String, required: true },
  password:     { type: String, required: true },
  location:     { type: String, default: '' },
  description:  { type: String, default: '' },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hostel', HostelSchema);
