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

const getToken = function (code, clientSecret, clientId) {
  return request
    .post('http://localhost:8000/login/oauth/access_token')
    .send({ code, clientSecret, clientId })
    .set('Accept', 'application/json')
    .set('content-type', 'application/json')
    .then(res => res.body.accessToken);
};

const getUserInfo = function (token) {
  return request
    .get('http://localhost:8000/users')
    .set('Authorization', token)
    .then(res => res.body);
};

const fetchUserDetails = async function (req, res, next) {
  const { ClientID, ClientSecret } = req.app.locals;
  try {
    const token = await getToken(req.query.code, ClientSecret, ClientID);
    const userInfo = await getUserInfo(token);
    console.log(userInfo);
    res.redirect('/');
  } catch (error) {
    return res.status('400').send('bad request');
  }
};

module.exports = { reqLogin, fetchUserDetails };
