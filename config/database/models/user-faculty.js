const Symbol = require('sequelize');

module.exports={
    isAdmin: {
        type: Symbol.BOOLEAN,
        defaultValue: false
    },
    isBanned: {
        type: Symbol.BOOLEAN,
        defaultValue: false
    }
};