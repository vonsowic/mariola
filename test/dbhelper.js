const db = require('database');


const initializeDatabase = () => db
    .connection
    .sync({force: true});

const createAvailableFaculty = (name, url) =>
    db.AvailableFaculty.create({
        name,
        semester: 0,
        url: url || 'http://student.agh.edu.pl/~miwas/plan-mocks.json'
    });

const createFaculty = (name, url) =>
    createAvailableFaculty(name, url)
        .then(af => db.Faculty
        .create({
            availableFacultyId: af.id,
            name
        }));

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

const createIntention = (userFrom, forId) =>
    db.ExchangeIntention
        .create({
            userFrom,
            forId
        });


module.exports={
    initializeDatabase,
    createAvailableFaculty,
    createFaculty,
    createUser,
    addUserToFaculty,
    createCourse,
    assignCourse,
    createIntention
};