const Symbol = require('sequelize');

module.exports = {
    name: Symbol.STRING(128),
    group: Symbol.STRING(2),
    other: Symbol.STRING(256),
    maxStudentsNumber: {
        type: Symbol.INTEGER,
        defaultValue: null
    }
};