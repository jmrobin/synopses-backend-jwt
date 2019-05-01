// /src/settings.js

const apiServerPort = 3001;
const database = {
  host: 'localhost',
  port: 3306,
  user: 'dev',
  password: '',
  database: 'tamas'
};
const secret = 'capitalism is awesome';

module.exports = {
  apiServerPort,
  database,
  secret
};
