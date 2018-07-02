const db = require('database');


const initializeDatabase = () => db.connection.sync({
    force: true
});

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

let x = 0;
const createUser = (fbProfileId=process.env.RUN_AS, name='name' + x, lastName='lastName'+x) =>
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

const createCourse = (facultyId, group='1', name='Lightsaber basics', frequency=14) =>
    db.Course.create({
        facultyId,
        group,
        name,
        lecturer: 'Obi-Wan Kenobi',
        place: 'Millenium Falcon'
    }).then(async course => {
        let now = new Date;
        let details = Array(frequency)
            .fill(0)
            .map(() => {
                now.setDate(now.getDate() + 7);
                let end = new Date(now.getTime());
                end.setMinutes(now.getMinutes() + 90);
                return {
                    start: now,
                    end,
                    courseId: course.id
                }
            });

        await db
            .CourseDetail
            .bulkCreate(details)

        return course
    });


const userCourse = (userId, courseId) =>
    db.UserCourse
        .create({
            userId,
            courseId
        });

const createIntention = (whatId, forId, userFrom) =>
    db.ExchangeIntention
        .create({
            whatId,
            forId,
            userFrom
        });


module.exports={
    initializeDatabase,
    createAvailableFaculty,
    createFaculty,
    createUser,
    addUserToFaculty,
    createCourse,
    userCourse,
    createIntention
};