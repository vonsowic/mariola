const Sequelize = require('sequelize');

const sequelize = new Sequelize('marioladb', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // SQLite only
    storage: './database.sqlite',

    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
});


const User = sequelize.define('users', {
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    fbProfileId: { type: Sequelize.INTEGER, unique: true},
    fbAccessToken: Sequelize.STRING
});

module.exports = [
    User
];