const db = require('database');


const initializeDatabase = () => db
    .connection
    .sync({force: true});

const createFaculty = (name, url, exchangesEnabled=true) =>
    db.Faculty
        .create({
            name,
            url: url || 'http://student.agh.edu.pl/~miwas/empty.json',
            exchangesEnabled
        });

const createUser = (fbProfileId=process.env.RUN_AS, name='name', lastName='lastName') =>
    db.User.create({
        name,
        lastName,
        fbProfileId
    });

const addUserToFaculty = (userId, facultyId, isAdmin=false) =>
    db.UserFaculty
        .create({
            userId,
            facultyId,
            isAdmin
        });

const createCourse = (facultyId, name='course name', group='1') =>
    db.Course
        .create({
            facultyId,
            group,
            name
        });

const assignCourse = (userId, courseId) =>
    db.UserCourse
        .create({
            userId,
            courseId
        });

const createIntention = (fromId, forId) =>
    db.Intention
        .create({
            fromId,
            forId
        });


module.exports={
    initializeDatabase,
    createFaculty,
    createUser,
    addUserToFaculty,
    createCourse,
    assignCourse,
    createIntention
};