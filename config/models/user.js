const Symbol = require('sequelize');

module.exports = {
    name: Symbol.STRING,
    email: Symbol.STRING,
    profileId: {    //facebook profile id
        type: Symbol.STRING,
        unique: true
    },
    accessToken: Symbol.STRING   // access token received from facebook
};
