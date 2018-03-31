const jwt = require('jsonwebtoken');
const getJwtSecret = require('./salt');

module.exports=(payload) => jwt.sign(
    JSON.stringify(payload),
    getJwtSecret()
);