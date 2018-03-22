const Sequelize = require('sequelize');
const user = require('./models/user');
const usersTimetable = require('./models/users_timetable');

//just to debug - forces to drop and recreate tables
forceNew = true;

const db = new Sequelize(process.env.DATABASE_URL);

const User = db.define('users', user);
User.sync({force: forceNew});

const UsersTimetable = db.define('users_timetables', usersTimetable,);
UsersTimetable.sync({force: forceNew});

User.hasOne(UsersTimetable);



module.exports = {
    User,
    UsersTimetable
};
