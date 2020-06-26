require('./queue');
const express = require('express');
const app = express();
const { UI } = require('bull-board');

app.use('/', UI);

app.listen(7890);
