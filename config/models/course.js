const Symbol = require('sequelize');

module.exports = {
    name: Symbol.STRING(40),
    lecturer: Symbol.STRING(40),
    group: Symbol.STRING(3)
};