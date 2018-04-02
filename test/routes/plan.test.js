const expect = require('chai').expect;


describe('Route /api/plan. Endpoints for getting course records. Details in this route is list of js object with start and end datetime.', () => {
    describe(`GET /:facultyId/my 
    Query params: 
    - start: 
        type: datetime
        default: previous Monday
    - end: 
        type: datetime
        default: next Sunday`, () => {
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

    describe('GET /:facultyId/general', () => {
        it('', () => {

        });
    });
});