// /src/routes.js

const titles = require('./controllers/titleController');
const versions = require('./controllers/versionController');
const triples = require('./controllers/tripleController');
const auth = require('./controllers/authController');

module.exports = {
  titles,
  versions,
  triples,
  auth
};
