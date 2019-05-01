// /src/middlewares.js

const settings = require('./settings');
const jwt = require('jsonwebtoken');

function getIdAsInteger (req, res, next) {
  const id = Number.parseInt(req.params.id);
  if (Number.isInteger(id)) {
    next();
  }
  else {
    return res.status(400).json('id must be an integer');
  }
}

function verifyJwt (req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token){
		return res.status(403).send({ 
			auth: false, message: 'No token provided.' 
		});
	}

	jwt.verify(token, settings.secret, (err, decoded) => {
		if (err){
			return res.status(500).send({ 
					auth: false, 
					message: 'Fail to Authentication. Error -> ' + err 
				});
		}
		req.author = decoded.id;
		next();
	});
}

module.exports = {
  getIdAsInteger,
  verifyJwt
};
