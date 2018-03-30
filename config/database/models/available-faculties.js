const Symbol = require('sequelize');

module.exports={
    name: Symbol.STRING(40),
    semester: Symbol.INTEGER,
    url: {
        type: Symbol.STRING(100),
        unique: true,
        allowNull: false
    }
};