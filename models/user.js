const Symbol = require('sequelize');
const db = require('../config/database');


const User = db.define('users', {
    name: Symbol.STRING,
    email: Symbol.STRING,
    profileId: {    //facebook profile id
        type: Symbol.STRING,
        unique: true
    },
    accessToken: Symbol.STRING   // access token received from facebook
});

User
    .sync({force: true});

module.exports = User;