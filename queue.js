const Queue = require('bull');
const { setQueues } = require('bull-board');

const idListQueue = new Queue('id list scraper', process.env.REDIS_URL);
const profileQueue = new Queue('profile scraper', process.env.REDIS_URL);
const storageQueue = new Queue('storage', process.env.REDIS_URL);

setQueues([idListQueue, profileQueue]);

module.exports = {
  idListQueue,
  profileQueue,
  storageQueue
};
