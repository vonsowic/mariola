const Symbol = require('sequelize');

module.exports = {
    name: Symbol.STRING(40),
    transferWithoutExchangeEnabled: {
        type: Symbol.BOOLEAN,
        defaultValue: true  // FIXME: change to false
    }
};