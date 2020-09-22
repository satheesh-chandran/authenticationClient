const request = require('superagent');
const { readFileSync, writeFileSync } = require('fs');

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

const formatPage = userInfo => {
  const filePath = `${__dirname}/../public/user.html`;
  let chunk = readFileSync(filePath, 'utf8');
  chunk = chunk.replace(/__ID__/, `${userInfo.id}`);
  chunk = chunk.replace(/__NAME__/, `${userInfo.name}`);
  chunk = chunk.replace(/__USERNAME__/, `${userInfo.username}`);
  chunk = chunk.replace(/__PASSWORD__/, `${userInfo.password}`);
  chunk = chunk.replace(/__COMPANY__/, `${userInfo.company}`);
  chunk = chunk.replace(/__EMAIL__/, `${userInfo.email}`);
  writeFileSync('./public/template.html', chunk, 'utf8');
};

const fetchUserDetails = async function (req, res) {
  const { ClientID, ClientSecret } = req.app.locals;
  try {
    const token = await getToken(req.query.code, ClientSecret, ClientID);
    const userInfo = await getUserInfo(token);
    formatPage(userInfo);
    res.redirect('/template.html');
  } catch (error) {
    return res.status('400').send('bad request');
  }
};

module.exports = { reqLogin, fetchUserDetails };
