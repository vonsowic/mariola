const Sequelize = require('sequelize');

const user = require('./models/user');
const userFaculty = require('./models/user-faculty');
const courseDetail = require('./models/course-detail');
const faculty = require('./models/faculty');
const course = require('./models/course');
const notification = require('./models/notification');
const intentionTriggers = require('./triggers/intention');
const exchangeTriggers = require('./triggers/exchange');
const courseTriggers = require('./triggers/course');
const userFacultyTriggers = require('./triggers/user-faculty');
const userCourseTriggers = require('./triggers/user-course');
const facultyTriggers = require('./triggers/faculty');
const updateFacultyPlansCron = require('./cron-jobs/update-faculty-plans').createCronJob;
const { importPlan }= require('utils/import-plan');

const db = new Sequelize(
    process.env.DATABASE_URL,
    Object.assign(
        { logging: process.env.DATABASE_LOGGING === 'true' ? console.log : false },
        { timezone: 'Europe/Warsaw' })
);


// TABLES
const User = db.define('user', user);
const Intention = db.define('intention', {});
const Faculty = db.define('faculty', faculty);
const Course = db.define('course', course, {
    indexes: [
        {
            unique: true,
            fields: ['name', 'group', 'facultyId']
        }
    ]
});
const UserCourse = db.define('user_course', {});
const CourseDetail = db.define('courses_detail', courseDetail);
const Exchanged = db.define('exchange', {});
const UserFaculty = db.define('user_faculty', userFaculty);
const Notification = db.define('notification', notification);


// RELATIONS
User.belongsToMany(Faculty, {through: UserFaculty});
Faculty.belongsToMany(User, {through: UserFaculty});

User.belongsToMany(Course, {through: UserCourse});
Course.belongsToMany(User, {through: UserCourse});

Faculty.hasMany(Course, {onDelete: 'CASCADE'});
Course.hasMany(CourseDetail, {foreignKey: 'courseId', onDelete: 'CASCADE'});

Intention.belongsTo(Course, {as: 'what', onDelete: 'CASCADE'});
Intention.belongsTo(Course, {as: 'for', onDelete: 'CASCADE'});
Intention.belongsTo(User, {as: 'from', onDelete: 'CASCADE'});

Exchanged.belongsTo(User, {as: 'from', onDelete: 'CASCADE'});
Exchanged.belongsTo(User, {as: 'to', onDelete: 'CASCADE'});
Exchanged.belongsTo(Course, {as: 'what', onDelete: 'CASCADE'});
Exchanged.belongsTo(Course, {as: 'for', onDelete: 'CASCADE'});

Notification.belongsTo(Exchanged, {as: 'exchange', onDelete: 'CASCADE'});
Notification.belongsTo(User, {as: 'user', onDelete: 'CASCADE'});

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
    Notification
};


// TRIGGERS
Faculty.afterCreate(importPlan(module.exports));
Faculty.afterUpdate(facultyTriggers.transferAllWithoutExchangeIfPossible(module.exports));
UserCourse.afterUpdate(userCourseTriggers.transferStudentIfHisDreamedGroupBecameAvailable(module.exports));

Intention.beforeValidate(intentionTriggers.ensureExchangesEnabled(module.exports));
Intention.beforeValidate(intentionTriggers.ensureUserAllowedToCreateIntention(module.exports));
Intention.beforeValidate(intentionTriggers.ensureIntentionIsOk(module.exports));
Intention.beforeCreate(intentionTriggers.exchangeIfMatched(module.exports));
Intention.beforeCreate(intentionTriggers.transferWithoutExchangeIfPossible(module.exports));

Exchanged.beforeValidate(exchangeTriggers.ensureExchangeIsOk());
Exchanged.afterCreate(exchangeTriggers.exchangeCourses(module.exports));
Exchanged.afterCreate(exchangeTriggers.removeIntentionAfterExchanged(module.exports));
Exchanged.afterCreate(exchangeTriggers.createNotifications(module.exports));

Course.beforeValidate(courseTriggers.insertDefaultMaxStudentsNumber());
Course.beforeUpdate(courseTriggers.ensureMaxNumberOfStudentsCanBeUpdated(module.exports));

UserFaculty.afterDestroy(userFacultyTriggers.removeUsersDataAfterLeaving(module.exports));
UserFaculty.beforeUpdate(userFacultyTriggers.ensureAdminWontBeBanned());


// install cron jobs
updateFacultyPlansCron(module.exports);