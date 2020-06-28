const { profileQueue } = require('./queue');


profileQueue.getFailed()
  .then(failed => console.log(failed));
