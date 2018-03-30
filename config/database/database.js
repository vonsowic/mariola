const Sequelize = require('sequelize');

const user = require('./models/user');
const courseDetail = require('./models/course-detail');
const faculty = require('./models/faculty');
const availableFaculty = require('./models/available-faculties');
const course = require('./models/course');


const db = new Sequelize(process.env.DATABASE_URL);


const User = db.define('users', user);
const ExchangeIntention = db.define('exchange_intentions', {});
const Faculty = db.define('faculties', faculty);
const AvailableFaculty = db.define('available_faculties', availableFaculty);
const Course = db.define('courses', course);
const CourseDetail = db.define('courses_details', courseDetail);
const Exchanged = db.define('exchanges', {});

User.belongsToMany(Faculty, {through: 'user_faculty'});
Faculty.belongsToMany(User, {through: 'user_faculty'});

User.belongsToMany(Faculty, {through: 'admins'});
Faculty.belongsToMany(User, {through: 'admins'});

AvailableFaculty.hasMany(Faculty);

User.belongsToMany(Course, {through: 'user_plan'});
Course.belongsToMany(User, {through: 'user_plan'});

Faculty.hasMany(Course, {onDelete: 'CASCADE'});
Course.hasMany(CourseDetail, {onDelete: 'CASCADE'});
Course.hasMany(Exchanged, {foreignKey: 'whatId', onDelete: 'CASCADE'});
Course.hasMany(Exchanged, {foreignKey: 'forId', onDelete: 'CASCADE'});
Course.hasMany(ExchangeIntention, {foreignKey: 'whatId', onDelete: 'CASCADE'});
Course.hasMany(ExchangeIntention, {foreignKey: 'forId', onDelete: 'CASCADE'});

User.hasMany(ExchangeIntention, {foreignKey: 'userFrom', onDelete: 'CASCADE'});
User.hasMany(Exchanged, {foreignKey: 'userFrom', onDelete: 'CASCADE'});
User.hasMany(Exchanged, {foreignKey: 'userTo', onDelete: 'CASCADE'});


// db.sync({force: true});

module.exports = {
    User,
    ExchangeIntention,
    Faculty,
    AvailableFaculty,
    Course,
    CourseDetail,
    Exchanged
};
