const Symbol = require('sequelize');

module.exports = {
    name: Symbol.STRING(128),
    lecturer: Symbol.STRING(128),
    group: Symbol.STRING(2),
    place: Symbol.STRING(40)
};