const { profileQueue } = require('./queue');
const { scrapeIds } = require('./scrapeIDs');

module.exports = job => {
  // scrape page
  return scrapeIds(job)
    .then(ids => ids.forEach(id => {
      profileQueue.add({ id });
    }));

  // return Promise.resolve('Done');
};

// const letter = job.data.letter;
//   console.log(letter);
//   const ids = [1, 2, 3, 4];

//   ids.forEach(id => {
//     profileQueue.add({ id });
//   });
