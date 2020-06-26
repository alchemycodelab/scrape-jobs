const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  dpsstId: {
    type: String,
    required: true
  },
  html: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('RawProfile', schema);
