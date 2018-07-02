const {
    createUser,
    initializeDatabase,
    addUserToFaculty,
    createFaculty,
    createCourse,
    assignCourse
} = require('../dbhelper');

const {ExchangeIntention} = require('database');
const request = require('../request');
const {assert} = require('chai');

describe('Faculty endpoints', () => {

    let tester, otherUser,
        faculty, otherFaculty,
        c1g0, c1g1, c1g2, c2g1, c2g2,
        f2c1g1;

    beforeEach(async () => {
        await initializeDatabase();
        tester = await createUser();
        otherUser = await createUser('123');

        faculty = await createFaculty();
        await addUserToFaculty(tester.id, faculty.id);

        otherFaculty = await createFaculty('Automatyka', 'dummy url');
        await addUserToFaculty(otherUser.id, faculty.id);

        c1g0 = await createCourse(faculty.id, 'Study of Ancient Runes', '0');
        c1g1 = await createCourse(faculty.id, 'Study of Ancient Runes', '1a');
        c1g2 = await createCourse(faculty.id, 'Study of Ancient Runes', '1b');
        c2g1 = await createCourse(faculty.id, 'Alchemy', '1a');
        c2g2 = await createCourse(faculty.id, 'Alchemy', '1b');

        f2c1g1 = await createCourse(otherFaculty.id, 'Alchemy', '1a');

        assignCourse(tester.id, c1g1.id);
        assignCourse(tester.id, c2g1.id);

        assignCourse(otherUser.id, c1g2.id);
        assignCourse(otherUser.id, c2g2.id);
    });

    describe('GET /:facultyId', () => {
        beforeEach(async () => {
            await ExchangeIntention
                .create({
                    whatId: c1g1.id,
                    forId: c1g2.id,
                    userFrom: tester.id,
                })
        });

        it('Should return list with one exchange intention', done => {
            request()
                .get(`/api/intentions/${faculty.id}`)
                .end((err, res) => {
                    assert.equal(res.body.length, 1, 'There should be only one intention');
                    done()
                })
        });
    });

    describe('GET /:facultyId/:intentionId', () => {
        let intention;
        beforeEach(async () => {
            intention = await ExchangeIntention
                .create({
                    whatId: c1g1.id,
                    forId: c1g2.id,
                    userFrom: tester.id,
                })
        });

        it('Should return list with one exchange intention', done => {
            request()
                .get(`/api/intentions/${faculty.id}/${intention.id}`)
                .end((err, res) => {
                    assert.equal(res.body.id, intention.id);
                    done()
                })
        });
    });

    describe('POST /:facultyId', () => {
        const fetch = forId => request()
            .post('/api/intentions')
            .send({forId});

        it('Should create new intention', done => {
            fetch(c1g2.id)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    done()
                })
        });

        describe('When user has already declared this intention', () => {
            beforeEach(async () => {
                await ExchangeIntention
                    .create({
                        forId: c1g2.id,
                        userFrom: tester.id
                    })
            });

            it('Intention should not be created', done => {
                fetch(c1g2.id)
                    .end((err, res) => {
                        assert.equal(res.status, 409);
                        done()
                    })
            })
        });

        describe('When user is not member of this faculty', () => {
            it('Intention should not be created', done => {
                fetch(f2c1g1.id)
                    .end((err, res) => {
                        assert.equal(res.status, 400);
                        done()
                    })
            })
        });

        describe('When course does not exist', () => {
            it('Intention should not be created', done => {
                fetch(0)
                    .end((err, res) => {
                        assert.equal(res.status, 404);
                        done()
                    })
            })
        });

        describe('When course is lecture', () => {
            it('Intention should not be created', done => {
                fetch(c1g0.id)
                    .end((err, res) => {
                        assert.equal(res.status, 400);
                        done()
                    })
            })
        })
    });

    describe('DELETE /:intentionId', () => {
        describe('When user is creator of intention', () => {
            let intention;
            beforeEach(async () => {
                intention = await ExchangeIntention
                    .create({
                        whatId: c1g1.id,
                        forId: c1g2.id,
                        userFrom: tester.id,
                    })
            });

            it('Exchange intention should be removed', done => {
                request()
                    .delete(`/api/intentions/${intention.id}`)
                    .end((err, res) => {
                        assert.equal(res.status, 204);

                        ExchangeIntention
                            .findById(intention.id)
                            .then(ei => {
                                assert(ei === null, 'Exchange intention should be removed');
                                done()
                            })
                    })
            })
        });

        describe('When user is not creator of intention', () => {
            let intention;
            beforeEach(async () => {
                intention = await ExchangeIntention
                    .create({
                        whatId: c1g2.id,
                        forId: c1g1.id,
                        userFrom: otherUser.id,
                    })
            });

            it('Exchange intention should be removed', done => {
                request()
                    .delete(`/api/intentions/${intention.id}`)
                    .end((err, res) => {
                        assert.equal(res.status, 403);
                        done()
                    })
            })
        })
    })
});