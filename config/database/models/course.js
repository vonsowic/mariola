const Symbol = require('sequelize');

module.exports = {
    name: {
        type: Symbol.STRING(128),
        required: true
    },
    group: {
        type: Symbol.STRING(2),
        required: true
    },
    other: Symbol.STRING(256),
    maxStudentsNumber: {
        type: Symbol.INTEGER,
        defaultValue: null
    }
};