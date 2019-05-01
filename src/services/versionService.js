// /src/services/versionService.js

/*eslint-disable no-console*/

const settings = require('../settings');

const knex = require('knex')({
  client: 'mysql',
  connection: settings.database
});

const titleService = require('./titleService');
const authorService = require('./authorService');

async function getById (id) {
  const data = await knex('version').where('id', id);
  // console.log({version: data[0]});
  return toVersionDto(data[0]);
}

async function getPublished () {
  const data = await knex('version').where('is_draft', false);
  const versions = [];
  for (let i = 0; i < data.length; i++)
  {
    const version = await toVersionDto(data[i]);
    versions.push(version);
  }
  return versions;
}

async function getByAuthorId (id) {
  const data = await knex('version').where('author_id', id);
  const versions = [];
  for (let i = 0; i < data.length; i++)
  {
    const version = await toVersionDto(data[i]);
    versions.push(version);
  }
  return versions;
}

async function toVersionDto (version) {
  const title = await titleService.getById(version.title_id);
  const author = await authorService.getById(version.author_id);
  delete author.password;
  delete author.is_admin;
  const parentVersionId = version.parent_version_id === null ? 0 : version.parent_version_id;
  const isDraft = version.is_draft === 0 ? false : true;
  const sentences = await toSentencesDto(version.contents);
  const forks = await getForks(version.id, version.contents);
  let dto = {
    id: version.id,
    isDraft: isDraft,
    description: version.description,
    parentVersionId: parentVersionId,
    title: title,
    author: author,
    sentences: sentences,
    forks: forks
  };
  console.log({ dto: dto });
  return dto;
}

async function toSentencesDto (contents) {
  const strings = contents.split(':');
  let sentences = [];
  for (let i = 0; i < strings.length; i++) {
    const data = await getSentenceById(strings[i]);
    sentences.push(toSentenceDto(data));
  }
  return sentences;
}

async function getSentenceById (id) {
  const data = await knex('sentence').where('id', id);
  return data[0];
}

async function deleteSentenceById (id) {
  return knex('sentence').where('id', id).del();
}

async function createSentence (body) {
  const data = await knex('sentence').insert(body);
  const id = data[0];
  return getSentenceById(id);
}

function toSentenceDto (sentence) {
  const isDraft = sentence.is_draft === 0 ? false : true;
  const dto = {
    id: sentence.id,
    contents: sentence.contents,
    isDraft: isDraft,
    authorId: sentence.author_id
  };
  return dto;
}

async function getForks (versionId, contents) {
  const strings = contents.split(':');
  const sentenceIds = strings.map(s => parseInt(s));
  let forks = [];
  for (let i = 0; i < sentenceIds.length; i++) {
    const data = await knex('triple')
      .where({ version_id: versionId, sentence_id: sentenceIds[i] });
    for (let j = 0; j < data.length; j++) {
      const nextSentence = await getSentenceById(data[j].next_sentence_id);
      forks.push({
        sentenceId: sentenceIds[i],
        nextVersionId: data[j].next_version_id,
        nextSentenceId: data[j].next_sentence_id,
        nextSentenceContents: nextSentence.contents
      });
    }
  }
  return forks;
}

async function create (body) {
  console.log('version service create called');
  const parent_version_id = body.parentVersionId === 0 ? null : body.parentVersionId;
  const title_id = body.titleId;
  const author_id = body.authorId;
  const contents = await sentencesDtoToContents(body.sentences);
  const version = {
    description: body.description,
    parent_version_id: parent_version_id,
    is_draft: body.isDraft,
    title_id: title_id,
    author_id: author_id,
    contents: contents
  };
  const data = await knex('version').insert(version);
  return getById(data[0]);
}

async function sentencesDtoToContents (sentencesDto) {
  let sentences = [];
  for (let i = 0; i < sentencesDto.length; i++) {
    if (sentencesDto[i].id) {
      console.log('sentence id exists');
      sentences.push(sentencesDto[i].id);
    }
    else {
      console.log('sentence id does not exist');
      const body = {
        contents: sentencesDto[i].contents,
        is_draft: sentencesDto[i].isDraft,
        author_id: sentencesDto[i].authorId
      };
      console.log({ body: body });
      const sentence = await createSentence(body);
      sentences.push(sentence.id);
    }
  }
  return sentences.join(':');
}

async function deleteById (id) {
  const versions = await knex('version').where('id', id);
  const strings = versions[0].contents.split(':');
  for (let i = 0; i < strings.length; i++) {
    const sentence = await getSentenceById(strings[i]);
    if (sentence.is_draft === 1) {
      await deleteSentenceById(strings[i]);
    }
  }
  return knex('version').where('id', id).del();
}

module.exports = {
  getById,
  getPublished,
  getByAuthorId,
  create,
  deleteById
};

