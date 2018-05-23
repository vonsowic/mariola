const jwt = require('jsonwebtoken');
const getJwtSecret = require('./salt');

module.exports = payload => jwt.sign(
    payload,
    getJwtSecret(),
    { expiresIn: Number(process.env.EXPIRATION_TIME_AS_SECONDS) }
);
