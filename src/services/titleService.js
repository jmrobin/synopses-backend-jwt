// /services/titleService.js

/*eslint-disable no-console*/

const settings = require('../settings');

const knex = require('knex')({
  client: 'mysql',
  connection: settings.database
});

function getAll () {
  return knex
    .select('id', 'name')
    .from('title');
}

async function getById (id) {
  const data = await knex
    .select('id', 'name')
    .from('title')
    .where({
      id: `${id}`
    });
  return data[0];
}

async function create (body) {
  const data = await knex('title').insert(body);
  const id = data[0];
  return getById(id);
}

async function update (id, body) {
  await knex('title')
    .where({
      'id': id
    })
    .update(body);
  return getById(id);
}

async function deleteById (id) {
  return knex('title')
    .where({
      'id': id
    })
    .del();
}
module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteById
};
