const Sequelize = require('sequelize');

const user = require('./models/user');
const userFaculty = require('./models/user-faculty');
const courseDetail = require('./models/course-detail');
const faculty = require('./models/faculty');
const course = require('./models/course');
const intentionTriggers = require('./triggers/intention');
const exchangeTriggers = require('./triggers/exchange');
const courseTriggers = require('./triggers/course');
const userFacultyTriggers = require('./triggers/user-faculty');
const importPlan = require('utils/import-plan');

const db = new Sequelize(
    process.env.DATABASE_URL,
    Object.assign(
        { logging: process.env.DATABASE_LOGGING === 'true' ? console.log : false },
        { timezone: 'Europe/Warsaw' })
);


// TABLES
const User = db.define('users', user);
const Intention = db.define('intentions', {});
const Faculty = db.define('faculties', faculty);
const Course = db.define('courses', course);
const UserCourse = db.define('user_course', {});
const CourseDetail = db.define('courses_details', courseDetail);
const Exchanged = db.define('exchanges', {});
const UserFaculty = db.define('user_faculty', userFaculty);


// RELATIONS
User.belongsToMany(Faculty, {through: UserFaculty});
Faculty.belongsToMany(User, {through: UserFaculty});

User.belongsToMany(Course, {through: UserCourse});
Course.belongsToMany(User, {through: UserCourse});

Faculty.hasMany(Course, {onDelete: 'CASCADE'});
Course.hasMany(CourseDetail, {foreignKey: 'courseId', onDelete: 'CASCADE'});
Course.hasMany(Exchanged, {foreignKey: 'whatId', onDelete: 'CASCADE'});
Course.hasMany(Exchanged, {foreignKey: 'forId', onDelete: 'CASCADE'});
Course.hasMany(Intention, {foreignKey: 'whatId', onDelete: 'CASCADE'});
Course.hasMany(Intention, {foreignKey: 'forId', onDelete: 'CASCADE'});

User.hasMany(Intention, {foreignKey: 'userFrom', onDelete: 'CASCADE'});
User.hasMany(Exchanged, {foreignKey: 'userFrom', onDelete: 'CASCADE'});
User.hasMany(Exchanged, {foreignKey: 'userTo', onDelete: 'CASCADE'});


module.exports = {
    Op: Sequelize.Op,
    connection: db,
    sequelize: Sequelize,
    User,
    Intention,
    Faculty,
    Course,
    CourseDetail,
    Exchanged,
    UserFaculty,
    UserCourse,
};


// TRIGGERS
Faculty.afterCreate(importPlan(module.exports));

Intention.beforeValidate(intentionTriggers.checkIfExchangesEnabled(module.exports));
Intention.beforeValidate(intentionTriggers.ensureIntentionIsOk(module.exports));
Intention.beforeCreate(intentionTriggers.exchangeIfMatched(module.exports));
Intention.beforeCreate(intentionTriggers.transferWithoutExchangeIfPossible(module.exports));

Exchanged.beforeValidate(exchangeTriggers.ensureExchangeIsOk());
Exchanged.afterCreate(exchangeTriggers.exchangeCourses(module.exports));
Exchanged.afterCreate(exchangeTriggers.removeIntentionAfterExchanged(module.exports, Sequelize.Op));

Course.beforeValidate(courseTriggers.insertDefaultMaxStudentsNumber);

UserFaculty.afterDestroy(userFacultyTriggers.removeUsersDataAfterLeaving(db));
