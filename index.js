const { idListQueue } = require('./queue');

setInterval(() => {
  idListQueue.add({ letter: 'a' });
}, 1);
