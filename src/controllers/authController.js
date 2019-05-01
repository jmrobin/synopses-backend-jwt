// /src/controllers/autController.js

const settings = require('../settings');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const knex = require('knex')({
    client: 'mysql',
    connection: settings.database
});

async function signin(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const data = await knex('author').where('username', username);
    if (data.length !== 1) {
        return res.status(404).json('User not found');
    }

    const author = data[0];
    const isAdmin = author.is_admin === 1 ? true : false;

    const isPasswordValid = bcrypt.compareSync(password, author.password);
    if (!isPasswordValid) {
        return res.status(401).json('Invalid password');
    }

    const token = jwt.sign(
        { id: author.id, username: author.username, isAdmin: isAdmin },
        settings.secret,
        { expiresIn: 86400 }
    );
    return res.status(200).json({token: token});
}

module.exports = {
    signin
}