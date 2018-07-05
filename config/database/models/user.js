const Symbol = require('sequelize');

module.exports = {
    name: Symbol.STRING(30),
    lastName: Symbol.STRING(30),
    email: {
        type: Symbol.STRING(60),
        required: true
    },
    fbProfileId: {
        type: Symbol.STRING(100),
        unique: true
    }
};