// /src/controllers/tripleController.js

const tripleService = require('../services/tripleService');

function create (req, res) {
  const body = req.body;
  tripleService.create(body)
    .then(result => res.status(201).json(result))
    .catch(error => res.status(500).json(error));
}

module.exports = {
  create
};
