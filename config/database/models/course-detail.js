const Symbol = require('sequelize');

module.exports = {
    courseId: {
        type: Symbol.INTEGER,
        primaryKey: true
    },
    start: {
        type: Symbol.DATE,
        primaryKey: true
    },
    end: {
        type: Symbol.DATE,
        primaryKey: true
    }
};







