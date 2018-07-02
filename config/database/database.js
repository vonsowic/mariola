const Sequelize = require('sequelize');

const user = require('./models/user');
const userFaculty = require('./models/user-faculty');
const courseDetail = require('./models/course-detail');
const faculty = require('./models/faculty');
const availableFaculty = require('./models/available-faculties');
const course = require('./models/course');
const intentionTriggers = require('./triggers/intention');
const courseTriggers = require('./triggers/course');
const userFacultyTriggers = require('./triggers/user-faculty');

const db = new Sequelize(
    process.env.DATABASE_URL,
    Object.assign(
        { logging: process.env.DATABASE_LOGGING === 'true' ? console.log : false },
        { timezone: 'Europe/Warsaw' })
);


// TABLES
const User = db.define('users', user);
const ExchangeIntention = db.define('exchange_intentions', {});
const Faculty = db.define('faculties', faculty);
const AvailableFaculty = db.define('available_faculties', availableFaculty);
const Course = db.define('courses', course);
const UserCourse = db.define('user_course', {});
const CourseDetail = db.define('courses_details', courseDetail);
const Exchanged = db.define('exchanges', {});
const UserFaculty = db.define('user_faculty', userFaculty);


// RELATIONS
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


module.exports = {
    Op: Sequelize.Op,
    connection: db,
    sequelize : Sequelize,
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


// TRIGGERS
ExchangeIntention.beforeValidate(intentionTriggers.ensureIntentionIsOk(module.exports));
ExchangeIntention.beforeCreate(intentionTriggers.exchangeIfMatched(module.exports));

Exchanged.beforeValidate(intentionTriggers.ensureExchangeIsOk());
Exchanged.afterCreate(intentionTriggers.removeIntentionAfterExchanged(module.exports, Sequelize.Op));
Exchanged.afterCreate(intentionTriggers.exchangeCourses(module.exports));

Course.beforeValidate(courseTriggers.insertDefaultMaxStudentsNumber);

UserFaculty.afterDestroy(userFacultyTriggers.removeUsersDataAfterLeaving(db));
