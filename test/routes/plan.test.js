const expect = require('chai').expect;
const request = require('chai-http').request;
const dbInit = require('../prepare-database');
const db = require('database');
const generateToken = require('passport-mariola/jwt');
// const app = require('../../app');


describe('Route /api/plan. Endpoints for getting course records. Details in this route is list of js object with start and end datetime.', function() {
    beforeEach('Create database and mock data', function(done){
        dbInit(db)
            .then(done)
    });

    after('End connection to database', () => {
        db.connection.close();
    });


    describe(`GET /:facultyId/my
    Query params:
    - start:
        type: datetime
        default: previous Monday
    - end:
        type: datetime
        default: next Sunday`, function () {
        it('Should return list of courses with details for which student, who makes request, attends', () => {

        });
    });

    describe('GET /:facultyId/my/general', () => {
        it('', () => {

        });
    });

    describe(`GET /:facultyId
    Query params:
    - start:
        type: datetime
        default: previous Monday
    - end:
        type: datetime
        default: next Sunday`, () => {
        it('', () => {

        });
    });

    describe('GET /:facultyId/general', async function (done) {
        let facultyId = await db.Faculty
            .findOne({where: {name: 'Sojusz rebeli'}})
            .then(f => f.id);

        let tester = await db.User
            .findOne({ where: {name: 'Luke'}});

        // it('', function() {
        //     request.get(app)
        //         .get(`/api/${facultyId}/general`)
        //         .end((err, res) => {
        //             done();
        //             assert(!err)
        //         })
        // });
    });
});