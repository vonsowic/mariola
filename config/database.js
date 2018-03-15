const Sequelize = require('sequelize');
const user = require('./models/user');


const db = new Sequelize(process.env.DATABASE_URL);

const User = db.define('users', user);

User.sync();

module.exports = {
    User
};
