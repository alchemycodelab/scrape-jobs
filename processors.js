const { idListQueue, profileQueue, storageQueue } = require('./queue');
const path = require('path');

idListQueue.process(1, path.resolve('./idListProcessor.js'));
profileQueue.process(1, path.resolve('./profileProcessor.js'));
storageQueue.process(10, path.resolve('./storageProcessor.js'));
