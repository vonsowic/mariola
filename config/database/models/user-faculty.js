const Symbol = require('sequelize');

module.exports={
    isAdmin: {
        type: Symbol.BOOLEAN,
        defaultValue: false,
        required: true
    },
    isBanned: {
        type: Symbol.BOOLEAN,
        defaultValue: false,
        required: true
    },
    group: {
        type: Symbol.String(2),
        required: true
    }
};