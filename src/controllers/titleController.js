// /src/controllers/titleController.js

/*eslint-disable no-console*/

const titleService = require('../services/titleService');

function getAll (req, res) {
  titleService.getAll()
    .then(data => res.status(200).json(data))
    .catch(error => res.status(500).json(error));
}

function getById (req, res) {
  const { id } = req.params;
  titleService.getById(id)
    .then(data => res.status(200).json(data))
    .catch(error => res.status(500).json(error));
}

function create (req, res) {
  const body = req.body;
  titleService.create(body)
    .then(data => res.status(201).json(data))
    .catch(err => res.status(500).json(err));
}

function update (req, res) {
  const { id } = req.params;
  const body = req.body;
  titleService.update(id, body)
    .then(data => res.status(201).json(data))
    .catch(err => res.status(500).json(err));
}

function deleteById (req, res) {
  const { id } =req.params;
  titleService.deleteById(id)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json(err));
}


module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteById
};
