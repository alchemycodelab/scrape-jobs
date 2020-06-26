require('dotenv').config();

const Queue = require('bull');
const { setQueues } = require('bull-board');

const options = ({ max, durationInMinutes, attempts = 5 }) => ({
  limiter: {
    max,
    duration: 1000 * 60 * durationInMinutes
  },
  defaultJobOptions: {
    attempts
  }
});

const idListQueue = new Queue('id list scraper', process.env.REDIS_URL);
const profileQueue = new Queue('profile scraper', process.env.REDIS_URL, options({ max: 10, durationInMinutes: 1 }));
const storageQueue = new Queue('storage', process.env.REDIS_URL, options({ max: 1, durationInMinutes: .5 }));

setQueues([idListQueue, profileQueue, storageQueue]);

module.exports = {
  idListQueue,
  profileQueue,
  storageQueue
};
