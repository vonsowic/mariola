const { sign } = require('jsonwebtoken');
const {
    salt,
    refreshSalt } = require('./salt');

const expirationTime = Number(process.env.EXPIRATION_TIME_AS_SECONDS);

const createToken = user => sign(
    user,
    salt,
    { expiresIn: expirationTime }
);


const createRefreshToken = user => sign(
    user,
    refreshSalt,
    {}
);

module.exports={
    createToken,
    createRefreshToken
};