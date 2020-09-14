const request = require('superagent');

/*
  Authorization server = http://localhost:8000
  Authorization client = http://localhost:7000 (this app url)
*/

const reqLogin = function (req, res) {
  const { ClientID } = req.app.locals;
  const callbackUrl = '/user/auth';
  const route = 'http://localhost:8000/login/oauth/authorize';
  const url = `${route}?clientId=${ClientID}&callbackUrl=${callbackUrl}`;
  res.redirect(url);
};

const getToken = function (code, ClientSecret, ClientID) {
  return request
    .post('http://localhost:8000/login/oauth/access_token')
    .send({ code, ClientSecret, ClientID })
    .set('Accept', 'application/json')
    .set('content-type', 'application/json')
    .then(res => res.body.access_token);
};

const getUserInfo = function (token) {
  return request
    .get('http://localhost:8000/user')
    .set('Authorization', `token ${token}`)
    .then(res => res.body);
};

const fetchUserDetails = async function (req, res, next) {
  const { ClientID, ClientSecret } = req.app.locals;
  const code = req.query.code;
  try {
    const token = await getToken(code, ClientSecret, ClientID);
    const userInfo = await getUserInfo(token);
    res.json(userInfo);
  } catch (error) {
    return res.status('400').send('bad request');
  }
};

module.exports = { reqLogin, fetchUserDetails };
