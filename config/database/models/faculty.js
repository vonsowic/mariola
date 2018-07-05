const Symbol = require('sequelize');

module.exports = {
    name: {
        type: Symbol.STRING(40),
        required: true
    },
    exchangesEnabled: {
        type: Symbol.BOOLEAN,
        defaultValue: false,
        required: true
    },
    transferWithoutExchangeEnabled: {
        type: Symbol.BOOLEAN,
        defaultValue: false,
        required: true
    },
    url: {
        type: Symbol.STRING,
        required: true,
    }
};