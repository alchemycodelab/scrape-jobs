const { profileQueue } = require('./queue');

module.exports = job => {
  // scrape page
  const letter = job.data.letter;
  console.log(letter);
  const ids = [1, 2, 3, 4];

  ids.forEach(id => {
    profileQueue.add({ id });
  });

  return Promise.resolve('Done');
};
