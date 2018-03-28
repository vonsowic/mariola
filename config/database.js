const Sequelize = require('sequelize');

const user = require('./models/user');
const course = require('./models/course');
const faculty = require('./models/faculty');
const generalPlan = require('./models/general_plan');


const db = new Sequelize(process.env.DATABASE_URL);


const User = db.define('user', user);
const ExchangeIntentions = db.define('exchange_intentions', {});
const Faculty = db.define('faculties', faculty);
const GeneralPlan = db.define('general_plans', generalPlan);
const Course = db.define('courses', course);
const Exchanged = db.define('exchanges', {});

User.belongsToMany(Faculty, {through: 'user_faculty'});
Faculty.belongsToMany(User, {through: 'user_faculty'});

User.belongsToMany(Faculty, {through: 'admins'});
Faculty.belongsToMany(User, {through: 'admins'});

User.belongsToMany(GeneralPlan, {through: 'user_plan'});
GeneralPlan.belongsToMany(User, {through: 'user_plan'});

Faculty.hasMany(GeneralPlan);
GeneralPlan.hasMany(Course, {onDelete: 'CASCADE'});
GeneralPlan.hasMany(Exchanged, {foreignKey: 'whatId', onDelete: 'CASCADE'});
GeneralPlan.hasMany(Exchanged, {foreignKey: 'forId', onDelete: 'CASCADE'});
GeneralPlan.hasMany(ExchangeIntentions, {foreignKey: 'whatId', onDelete: 'CASCADE'});
GeneralPlan.hasMany(ExchangeIntentions, {foreignKey: 'forId', onDelete: 'CASCADE'});

User.hasMany(ExchangeIntentions, {foreignKey: 'userFrom', onDelete: 'CASCADE'});
User.hasMany(Exchanged, {foreignKey: 'userFrom', onDelete: 'CASCADE'});
User.hasMany(Exchanged, {foreignKey: 'userTo', onDelete: 'CASCADE'});


db.sync({force: true});

module.exports = {
    User,
    ExchangeIntentions,
    Faculty,
    GeneralPlan,
    Course,
    Exchanged
};
