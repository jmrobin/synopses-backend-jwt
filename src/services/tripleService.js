// /src/services/tripleService.js

const settings = require('../settings');

const knex = require('knex')({
  client: 'mysql',
  connection: settings.database
});

function create (body) {
  const triple = {
    version_id: body.versionId,
    sentence_id: body.sentenceId,
    next_version_id: body.nextVersionId,
    next_sentence_id: body.nextSentenceId
  };
  return knex('triple').insert(triple);
}

module.exports = {
  create
};
