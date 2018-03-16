const Symbol = require('sequelize');

module.exports = {
    name: Symbol.STRING(20),
    lastName: Symbol.STRING(20),
    email: Symbol.STRING(60),
    profileId: {    //facebook profile id
        type: Symbol.STRING(100),
        unique: true
    },
    accessToken: Symbol.TEXT   // access token received from facebook
};
