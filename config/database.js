const Sequelize = require('sequelize');

const user = require('./models/user');
const admin = require('./models/admin');
const course = require('./models/course');
const exchangeIntentions = require('./models/exchage_intentions');
const exchanged = require('./models/exchanged');
const faculty = require('./models/faculty');
const generalPlan = require('./models/general_plan');
const userFaculty = require('./models/user_faculty');
const usersPlan = require('./models/users_plan');


//just fot debug TODO remove in production
forceRecreate = true;

const db = new Sequelize(process.env.DATABASE_URL);

//define tables
const User = db.define('user', user);
const Admin = db.define('admin',admin);
const UserFaculty  = db.define('user_faculty',userFaculty);
const ExchangeIntentions = db.define('exchange_intention',exchangeIntentions);
const UsersPlan = db.define('users_plan',usersPlan);
const Faculty = db.define('faculty',faculty);
const GeneralPlan = db.define('general_plan',generalPlan);
const Course = db.define('course',course);
const Exchanged = db.define('exchanges',exchanged);




//define relations
//User.hasMany(ExchangeIntentions);
// User.hasMany(Admin);
User.hasOne(UsersPlan);
// User.hasMany(ExchangeIntentions);

// Faculty.hasMany(UserFaculty);
// Faculty.hasMany(Admin);
// Faculty.hasOne(GeneralPlan);
//
// GeneralPlan.hasMany(Course);
//
// UsersPlan.hasMany(Course);
// UsersPlan.belongsTo(User);

// ExchangeIntentions.hasOne(Course,{foreignKey: 'from_id'});
// ExchangeIntentions.hasOne(Course,{foreignKey: 'to_id'});
//
// Exchanged.hasOne(Course);
//
// Exchanged.belongsTo(User,{foreignKey: 'from'});
// Exchanged.belongsTo(User,{foreignKey: 'to'});

//create tables

User.sync({force: forceRecreate});
ExchangeIntentions.sync({force: forceRecreate});
Admin.sync({force: forceRecreate});
UserFaculty.sync({force: forceRecreate});
UsersPlan.sync({force: forceRecreate});
Faculty.sync({force: forceRecreate});
GeneralPlan.sync({force: forceRecreate});
Course.sync({force: forceRecreate});
Exchanged.sync({force: forceRecreate});

module.exports = {
    User,
    Admin,
    ExchangeIntentions,
    UserFaculty,
    UsersPlan,
    Faculty,
    GeneralPlan,
    Course,
    Exchanged
};
