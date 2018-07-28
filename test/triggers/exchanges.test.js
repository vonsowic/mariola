const db = require('database');

const { BadRequest }= require("utils/errors");

const {
    createUser,
    initializeDatabase,
    addUserToFaculty,
    createFaculty,
    createCourse,
    assignCourse,
    createIntention
} = require('../dbhelper');


const {assert} = require('chai');

describe('Exchanges tests', () => {

    let testerId, user1, user2,
        facultyId, otherFacultyId,
        c1g0, c1g1, c1g2, c2g1, c2g2,
        f2c1g1;

    beforeEach('Create courses and assign them to users', async () => {
        await initializeDatabase();
        testerId = (await createUser()).id;
        user1 = (await createUser('1')).id;
        user2 = (await createUser('2')).id;


        facultyId = (await createFaculty()).id;
        await addUserToFaculty(testerId, facultyId);
        await addUserToFaculty(user1, facultyId);
        await addUserToFaculty(user2, facultyId);

        otherFacultyId = (await createFaculty('Automatyka')).id;
        await addUserToFaculty(user2, otherFacultyId);

        c1g0 = (await createCourse(facultyId, 'Study of Ancient Runes', '0')).id;
        c1g1 = (await createCourse(facultyId, 'Study of Ancient Runes', '1a')).id;
        c1g2 = (await createCourse(facultyId, 'Study of Ancient Runes', '1b')).id;
        c2g1 = (await createCourse(facultyId, 'Alchemy', '1a')).id;
        c2g2 = (await createCourse(facultyId, 'Alchemy', '1b')).id;

        f2c1g1 = (await createCourse(otherFacultyId, 'Alchemy', '1a')).id;

        await assignCourse(testerId, c1g0);
        await assignCourse(testerId, c1g1);
        await assignCourse(testerId, c2g1);

        await assignCourse(user1, c1g0);
        await assignCourse(user1, c1g2);
        await assignCourse(user1, c2g2);

        await assignCourse(user2, c1g0);
        await assignCourse(user2, c1g2);
        await assignCourse(user2, c2g2);
    });

    describe('ensureExchangeIsOk', () => {
        it('there should be no exception when fromId does not equal to toId',  async () => {
            await db.Exchanged
                .create({
                    fromId: user1,
                    toId: user2,
                });

            assert(true, 'There should be no exception')
        });

        it('there should be BadRequest exception when fromId equals to toId',  done => {
            db.Exchanged
                .create({
                    fromId: testerId,
                    whatId: c1g1,
                    toId: testerId,
                    forId: c1g1
                })
                .then(() => assert(false, 'BadRequest should be thrown'))
                .catch(() => assert(true))
                .finally(done)
        });
    });

    describe('exchangeCourses', () => {
        it('should update user_courses table', async () => {
            await db.Exchanged
                .create({
                    fromId: testerId,
                    whatId: c1g1,
                    toId: user2,
                    forId: c1g2
                });

            const testerCourse = await db.UserCourse
                .findOne({
                    where: {
                        userId: testerId,
                        courseId: c1g2
                    }
                });

            const user2Course = await db.UserCourse
                .findOne({
                    where: {
                        userId: user2,
                        courseId: c1g1
                    }
                });

            assert(testerCourse, 'tester should be assigned to c1g2');
            assert(user2Course, 'user2 should be assigned to c1g1')
        });
    });

    describe('removeIntentionAfterExchanged', () => {
        let i1, i2;
        beforeEach('', async () => {
            i1 = await createIntention(user1, c1g1);
            i2 = await createIntention(user2, c2g1)
        });


        it('should remove unnecessary intention', async () => {
            await db.Exchanged
                .create({
                    fromId: testerId,
                    whatId: c1g1,
                    toId: user1,
                    forId: c1g2
                });

            assert(await db.Intention.findById(i1.id) !== null);
            assert(await db.Intention.findById(i2.id))
        })
    });

    describe('createNotifications', () => {
        it('', async () => {
            await db.Exchanged
                .create({
                    fromId: testerId,
                    whatId: c1g1,
                    toId: user1,
                    forId: c1g2
                });

            assert(await db.Notification.findOne({
                where: {
                    userId: testerId
                }
            }));

            assert(await db.Notification.findOne({
                where: {
                    userId: user1
                }
            }))
        })
    })
});