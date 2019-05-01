// /src/controllers/versionController.js

const versionService = require('../services/versionService');

function getById (req, res) {
  const { id } = req.params;
  versionService.getById(id)
    .then(data => res.status(200).json(data))
    .catch(error => res.status(500).json(error));
}

function getPublished (req, res) {
  versionService.getPublished()
    .then(data => res.status(200).json(data))
    .catch(error => res.status(500).json(error));
}

function getByAuthorId (req, res) {
  const { id } = req.params;
  versionService.getByAuthorId(id)
    .then(data => res.status(200).json(data))
    .catch(error => res.status(500).json(error));
}

function create (req, res) {
  const body = req.body;
  versionService.create(body)
    .then(data => res.status(201).json(data))
    .catch(error => res.status(500).json(error));
}

function deleteById (req, res) {
  const { id } = req.params;
  versionService.deleteById(id)
    .then(data => res.status(200).json(data))
    .catch(error => res.status(500).json(error));
}
module.exports = {
  getById,
  getPublished,
  getByAuthorId,
  create,
  deleteById
};

