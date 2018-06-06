const app = require('../../app');
const chai= require('chai');
const chaiHttp = require('chai-http');
const jwt = require('passport-mariola/jwt');

chai.use(chaiHttp);
const request = chai.request;
const assert = chai.assert;

const dbhelper = require('../dbhelper');

describe('Intention and exchanges test', function () {

    let db;
    let tester;
    let token;
    let user;
    let faculty;
    let forCourse;
    let whatCourse;

    const init = async() => {
        db = await dbhelper.initializeDatabase();
        faculty= await dbhelper.createFaculty('Informatyka');

        tester = await dbhelper.createUserInFaculty(faculty.id, 'name', 'lasnname', 1);
        token = jwt(tester);
        user = await dbhelper.createUserInFaculty(faculty.id);

        forCourse = await dbhelper.createCourse(faculty.id);
        whatCourse = await dbhelper.createCourse(faculty.id);

        await dbhelper.userCourse(tester.id, whatCourse.id);
        await dbhelper.userCourse(user.id, forCourse.id);
    };

    beforeEach('Prepare test data', function (done) {
        init().then(done)
    });


    describe('GET /api/exchanges', function () {
        it('Should return empty list', function () {
            request(app)
                .get(`/api/exchanges/${faculty.id}`)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    assert.equal(200, res.status);
                    assert.equal(0, res.body.length, "Expected empty list")
                })
        });
    });

    describe('POST /api/exchanges', function () {
        it('Should create new intention', function () {
            request(app)
                .post('/api/exchanges')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    forId: forCourse.id
                })
                .end((err, res) => {
                    assert.equal(200, res.status);
                })
        });

        it('Should not create second identical intention', async function () {
            await dbhelper.createIntention(whatCourse.id, forCourse.id, tester.id);

            request(app)
                .post('/api/exchanges')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    forId: forCourse.id
                })
                .end((err, res) => {
                    assert.equal(409, res.status, "User should not be able to create identical intention");
                })
        });

        it('Should not be allowed to create intention in faculty that he is not a member of', async function () {
            let anotherFaculty = await dbhelper.createFaculty('Informatyka Wiet');
            let anotherCourse = await dbhelper.createCourse(anotherFaculty.id);

            request(app)
                .post('/api/exchanges')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    forId: anotherCourse.id
                })
                .end((err, res) => {
                    assert.equal(403, res.status);
                })
        });
    })
});