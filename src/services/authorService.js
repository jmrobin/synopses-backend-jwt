// /src/services/authorService.js

const settings = require('../settings');

const knex = require('knex')({
  client: 'mysql',
  connection: settings.database
});

async function getById (id) {
  const data = await knex('author').where('id', id);
  return data[0];
}

module.exports = {
  getById
};
