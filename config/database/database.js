const Sequelize = require('sequelize');

const user = require('./models/user');
const userFaculty = require('./models/user-faculty');
const courseDetail = require('./models/course-detail');
const faculty = require('./models/faculty');
const availableFaculty = require('./models/available-faculties');
const course = require('./models/course');
const triggers = require('./triggers/intention');
const courseTriggers = require('./triggers/course');

const db = new Sequelize(
    process.env.DATABASE_URL,
    Object.assign({
        logging: process.env.DATABASE_LOGGING === 'true' ? console.log : false
    }, (process.env.DATABASE_URL.includes('postgres'))
        ? {timezone: 'Europe/Warsaw'} // POSTGRES
        : {})                           // OTHER DB
);



const User = db.define('users', user);
const ExchangeIntention = db.define('exchange_intentions', {});
const Faculty = db.define('faculties', faculty);
const AvailableFaculty = db.define('available_faculties', availableFaculty);
const Course = db.define('courses', course);
const UserCourse = db.define('user_course');
const CourseDetail = db.define('courses_details', courseDetail);
const Exchanged = db.define('exchanges', {});
const UserFaculty = db.define('user_faculty', userFaculty);

User.belongsToMany(Faculty, {through: UserFaculty});
Faculty.belongsToMany(User, {through: UserFaculty});

AvailableFaculty.hasMany(Faculty);

User.belongsToMany(Course, {through: UserCourse});
Course.belongsToMany(User, {through: UserCourse});

Faculty.hasMany(Course, {onDelete: 'CASCADE'});
Course.hasMany(CourseDetail, {onDelete: 'CASCADE'});
Course.hasMany(Exchanged, {foreignKey: 'whatId', onDelete: 'CASCADE'});
Course.hasMany(Exchanged, {foreignKey: 'forId', onDelete: 'CASCADE'});
Course.hasMany(ExchangeIntention, {foreignKey: 'whatId', onDelete: 'CASCADE'});
Course.hasMany(ExchangeIntention, {foreignKey: 'forId', onDelete: 'CASCADE'});

User.hasMany(ExchangeIntention, {foreignKey: 'userFrom', onDelete: 'CASCADE'});
User.hasMany(Exchanged, {foreignKey: 'userFrom', onDelete: 'CASCADE'});
User.hasMany(Exchanged, {foreignKey: 'userTo', onDelete: 'CASCADE'});

const models = {
    User,
    ExchangeIntention,
    Faculty,
    AvailableFaculty,
    Course,
    CourseDetail,
    Exchanged,
    UserFaculty,
    UserCourse,
};

ExchangeIntention.beforeValidate(triggers.ensureIntentionIsOk(models));
ExchangeIntention.beforeCreate(triggers.exchangeIfMatched(models));

Exchanged.beforeValidate(triggers.ensureExchangeIsOk());
Exchanged.afterCreate(triggers.removeIntentionAfterExchanged(models, Sequelize.Op));
Exchanged.afterCreate(triggers.exchangeCourses(models));

Course.beforeValidate(courseTriggers.insertDefaultMaxStudentsNumber);

module.exports = Object.assign(
    models, {
    Op: Sequelize.Op,
    connection: db,
    sequelize : Sequelize
});
