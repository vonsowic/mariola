const {
    createUser,
    initializeDatabase,
    addUserToFaculty,
    createFaculty
} = require('../dbhelper');


const {assert} = require('chai');
const request = require('../request');


describe('Faculty endpoints', () => {

    let tester;
    beforeEach(async () => {
        await initializeDatabase();
        tester = await createUser()
    });

    describe('GET /', () => {
        let usersFaculty, otherFaculty;

        beforeEach(async () => {
            usersFaculty = await createFaculty("Informatyka");
            await addUserToFaculty(tester.id, usersFaculty.id);
            otherFaculty = await createFaculty("Automatyka");
        });

        const fetch = (query={}) => request()
            .get('/api/faculties')
            .query(query);

        it('Should return all faculties', done => {
            fetch()
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.length, 2, "List with 2 elements");
                    done()
                })
        });

        it('Should return user\' faculties', done => {
            fetch({onlyMy: true})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.length, 1, "List with 1 element");
                    assert(usersFaculty.id === res.body[0].id, "Should be id of faculty, that user is member of");
                    done()
                })
        });

        it('Should all but users faculties', done => {
            fetch({onlyMy: false})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.length, 1, "List with 1 element");
                    assert(otherFaculty.id === res.body[0].id, "Should be id of faculty, that user is not a member of");
                    done()
                })
        });
    });

    describe('GET /:facultyId/groups', () => {
        it('Should return list with 8 elements', async () => {
            const faculty = await createFaculty();

            request()
                .get(`/api/faculties/${faculty.id}/groups`)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.length, 8, "Expected list with 8 elements, not " + res.body.length);
                })
        });


    });

    describe('GET /:facultyId/admin', () => {
        it('Should ', done => {
            done()
        });
    });

    describe('POST /join', () => {
        let faculty;

        beforeEach(async () => {
            faculty = await createFaculty();
        });


        describe('When user is member of faculty', () => {
            beforeEach(async () => {
                await addUserToFaculty(tester.id, faculty.id)
            });

            it('User should not be able to join ', done => {
                request()
                    .post('/api/faculties/join')
                    .send({
                        facultyId: faculty.id,
                        initialGroup: "4b"
                    })
                    .end((err, res) => {
                        assert.equal(res.status, 409);
                        done()
                    })
            });

        });

        describe('When user is not a member of faculty', () => {
            it('User should be able to join, but only once', done => {
                request()
                    .post('/api/faculties/join')
                    .send({
                        facultyId: faculty.id,
                        initialGroup: "4b"
                    })
                    .end((err, res) => {
                        assert.equal(res.status, 201);
                        done();
                    })
            });
        });

        it('User should not be able to join unexisting faculty', done => {
            request()
                .post('/api/faculties/join')
                .send({
                    facultyId: faculty.id + 1,
                    initialGroup: "4b"
                })
                .end((err, res) => {
                    assert.equal(res.status, 409);
                    done()
                })
        });
    });

    describe('DELETE /:facultyId', () => {
        let faculty;

        beforeEach(async () => {
            faculty = await createFaculty();
        });

        describe('When user is admin', () => {
            beforeEach(async () => {
                await addUserToFaculty(tester.id, faculty.id, true)
            });

            it('Faculty should be deleted', done => {
                request()
                    .delete(`/api/faculties/${faculty.id}`)
                    .end((err, res) => {
                        assert.equal(res.status, 204);
                        done()
                    })
            });
        });

        describe('When user is not admin', () => {
            beforeEach(async () => {
                await addUserToFaculty(tester.id, faculty.id)
            });

            it('Faculty should not be deleted', done => {
                request()
                    .delete(`/api/faculties/${faculty.id}`)
                    .end((err, res) => {
                        assert.equal(res.status, 403);
                        done()
                    })
            });
        });
    });
});