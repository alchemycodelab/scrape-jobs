require('dotenv').config();
const mongoose = require('mongoose');
const RawProfile = require('./lib/models/RawProfile');

module.exports = async(job) => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });

  return RawProfile
    .create(job.data)
    .finally(() => mongoose.connection.close());
};
