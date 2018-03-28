const Symbol = require('sequelize');

module.exports = {
    faculty_id: Symbol.UUID,
    name: Symbol.STRING,
    semester: Symbol.INTEGER,
    url: Symbol.STRING
};