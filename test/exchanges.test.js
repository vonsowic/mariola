const {
    createUser,
    initializeDatabase,
    addUserToFaculty,
    createFaculty,
    createCourse,
    assignCourse,
    createIntention
} = require('./dbhelper');

const {
    NoContent
} = require('utils/errors');

const {Exchanged} = require('database');
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

    it('User1 and tester should exchange their Study of Ancient Runes course', async () => {
        try {
            await createIntention(user1, c1g1);
            await createIntention(user2, c1g1);
            await createIntention(testerId, c1g2);
        } catch (err) {
            assert(err instanceof NoContent)
        }

        const e = await Exchanged.findOne();


        // assert.equal(e.userFrom, user1);
        // assert.equal(e.userTo, testerId);
        // assert.equal(e.whatId, c1g2);
        // assert.equal(e.forId, c1g1)
    });

    it('No exchages', async () => {
        try {
            await createIntention(user1, c1g1);
            await createIntention(user2, c1g1);
            await createIntention(testerId, c2g2);
        } catch (err) {
            assert(err instanceof NoContent)
        }

        const {count} = await Exchanged.findAndCountAll();
        // assert.equal(count, 0, `There should be no exchages, not ${count}`)
    });

    it('User2 and tester should exchange their Alchemy course', async () => {
        try {
            await createIntention(user1, c1g1);
            await createIntention(user2, c1g1);
            await createIntention(user2, c2g1);
            await createIntention(testerId, c2g2);
        } catch (err) {
            assert(err instanceof NoContent)
        }



        // assert.equal(e.userFrom, user2);
        // assert.equal(e.userTo, testerId);
        // assert.equal(e.whatId, c2g2);
        // assert.equal(e.forId, c2g1);
        // assert.equal(count, 1)
    });
});