const Symbol = require('sequelize');

module.exports = {
    name: Symbol.STRING(100),
    lecturer: Symbol.STRING(110),
    group: Symbol.STRING(3),
    place: Symbol.STRING(20)
};