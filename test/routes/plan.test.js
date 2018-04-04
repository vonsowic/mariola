const expect = require('chai').expect;
const request = require('chai-http').request;
const dbInit = require('../prepare-database');
const db = require('database');


describe('Route /api/plan. Endpoints for getting course records. Details in this route is list of js object with start and end datetime.', function() {
    beforeEach('Create database and mock data', function(done){
        dbInit().then(done)
    });

    describe(`GET /:facultyId/my 
    Query params: 
    - start: 
        type: datetime
        default: previous Monday
    - end: 
        type: datetime
        default: next Sunday`, function () {
        it('Should return list of courses with details for which student, who makes request, attends', function() {

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
        let facultyId = db.Faculty({where: {name: 'Sojusz rebeli'}}).then(f => f.id);

        it('', function () {
            request.get(`/api/${facultyId}`)
        });
    });
});