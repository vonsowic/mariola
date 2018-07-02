const app = require('../../app');
const chai= require('chai');
const chaiHttp = require('chai-http');
const db = require('database');
const {
    createUser,
    initializeDatabase,
    createAvailableFaculty,
    addUserToFaculty,
    createFaculty
} = require('../dbhelper');

chai.use(chaiHttp);

const {request, assert} = chai;


describe('Faculty endpoints', () => {

    let tester;
    beforeEach(async () => {
        await initializeDatabase();
        tester = await createUser()
    });

    describe('GET /available', () => {
        describe('When no records are available', () => {
            it('Should return empty list', done => {
                request(app)
                    .get('/api/faculties/available')
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.length, 0, "Expected empty list");
                        done();
                    })
            });
        });

        describe('When one record is available', () => {
            beforeEach(async () => {
                await createAvailableFaculty()
            });

            it('Should return list with one element', done => {
                request(app)
                    .get('/api/faculties/available')
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.length, 1, "List with one element");
                        done()
                    })
            });
        })

    });

    describe('GET /', () => {
        let usersFaculty, otherFaculty;

        beforeEach(async () => {
            usersFaculty = await createFaculty("Informatyka", "unnecessary url 1");
            await addUserToFaculty(tester.id, usersFaculty.id);
            otherFaculty = await createFaculty("Automatyka", "unnecessary url 2");
        });

        const fetch = (query={}) => request(app)
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
        let faculty;

        beforeEach(async () => {
            faculty = await createAvailableFaculty();

            await request(app)
                .post('/api/faculties/create')
                .send({
                    facultyId: faculty.id,
                    initialGroup: "4b"
                })
        });

        it('Should return list with 8 elements', done => {
            request(app)
                .get(`/api/faculties/${faculty.id}/groups`)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.length, 8, "Expected list with 8 elements, not " + res.body.length);
                    done()
                })
        });


    });

    describe('POST /create', () => {
        let faculty;

        beforeEach(async () => {
            faculty = await createAvailableFaculty();
        });

        it('Should create new faculty based on available faculty; download faculty courses and make user an admin', done => {
            request(app)
                .post('/api/faculties/create')
                .send({
                    facultyId: faculty.id,
                    initialGroup: "4b"
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);

                    db.Course
                        .findAll({
                            where: {
                                facultyId: res.body.id
                            }
                        })
                        .then(cs => {
                            assert.equal(cs.length, 48);
                        })
                        .then(() => {
                            db.UserFaculty
                                .findOne({
                                    where: {
                                        facultyId: res.body.id
                                    }})
                                .then(uf => {
                                    assert(uf.isAdmin, "user should be an admin");
                                    done()
                                })
                        })
                    })
        })

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
                request(app)
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
                request(app)
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
            request(app)
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
                request(app)
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
                request(app)
                    .delete(`/api/faculties/${faculty.id}`)
                    .end((err, res) => {
                        assert.equal(res.status, 403);
                        done()
                    })
            });
        });
    });

    describe('DELETE /:facultyId/leave', () => {
        let faculty;
        beforeEach(async () => {
            faculty = await createFaculty();
            await addUserToFaculty(tester.id, faculty.id)
        });

        it('Should leave faculty', done => {
            request(app)
                .delete(`/api/faculties/${faculty.id}/leave`)
                .end((err, res) => {
                    assert.equal(res.status, 204);
                    done()
                })
        });
    });
});