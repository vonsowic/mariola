const db = require('database');


const initializeDatabase = async () => {
    await db.connection.sync({force: true});
    return db
};


const createFaculty = name =>
    db.AvailableFaculty.create({
        name,
        semester: 0,
        url: 'http://student.agh.edu.pl/~miwas/plan-mocks.json'
    }).then(af => db.Faculty
        .create({
            availableFacultyId: af.id,
            name
        }));

let x = 0;
const createUserInFaculty = (facultyId, name='name' + x, lastName='lastName'+x, fbProfileId=String(x++)) =>
    db.User.create({
        name,
        lastName,
        fbProfileId
    }).then(async user => {
        await db.UserFaculty
            .create({
                userId: user.id,
                facultyId
            });

        return user
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
    createFaculty,
    createUserInFaculty,
    createCourse,
    userCourse,
    createIntention
};