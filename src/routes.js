const express = require('express');
const morgan = require('morgan');
const app = express();

const {} = require('./handlers');

app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('public'));

module.exports = { app };
