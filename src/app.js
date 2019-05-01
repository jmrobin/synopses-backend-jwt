// /src/app.js

/*eslint-disable no-console*/

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get("/hello", (req, res) => {
    res.json("synopses backend")
});

const router = express.Router();
app.use('/api', router);

// middleware
router.use((req, res, next) => {
    console.log('middleware hitted');
    next();
});

const routes = require('./routes');
const { verifyJwt } = require('./middlewares');

router.get('/titles', routes.titles.getAll);
router.get('/titles/:id', routes.titles.getById);
router.post('/titles', verifyJwt, routes.titles.create);
router.patch('/titles/:id', verifyJwt, routes.titles.update);
router.delete('/titles/:id', verifyJwt, routes.titles.deleteById);

router.get('/versions/:id', routes.versions.getById);
router.get('/versionspublished', routes.versions.getPublished);
router.get('/versionsauthor/:id', routes.versions.getByAuthorId);
router.post('/versions', verifyJwt, routes.versions.create);
router.delete('/versions/:id', verifyJwt, routes.versions.deleteById);

router.post('/triples', verifyJwt, routes.triples.create);

router.post('/signin', routes.auth.signin);

module.exports = app;
