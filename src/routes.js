const express = require('express');
const morgan = require('morgan');

const { env } = process;
const app = express();

const { reqLogin, fetchUserDetails } = require('./handlers');

const { ClientID, ClientSecret } = env;

app.locals = { ClientID, ClientSecret };

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static('public'));

app.get('/reqLogin', reqLogin);

app.get('/user/auth', fetchUserDetails);

module.exports = { app };
