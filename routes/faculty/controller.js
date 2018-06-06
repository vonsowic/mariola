const router = require('express').Router();
const error = require('utils/errors');
const service = require('./service');
const Recruiter = require('utils/Recruiter');
const db = require('database');
const { ensureIsAdmin, unauthenticate, ensureFacultyMember } = require('utils/guards');


router.post('/create', (req, res, next) => {
    service.createFaculty(
        req.body.name,
        req.body.facultyId,
        req.user.id,
        req.body.initialGroup
    )
        .then(createdFaculty => {
            unauthenticate(req.user);
            res.send(201, {id: createdFaculty.id})
        })
        .catch(() => next(new error.NotFound('Faculty does not exist')))
});


router.get('/', (req, res) => {
    db.connection.query(`
        SELECT id, name
        FROM faculties 
        ${req.query.onlyMy !== 'true' 
        ? ''
        : `WHERE id IN (SELECT "facultyId" FROM user_faculties WHERE "userId"=${req.user.id})`}
    ;`)
        .then(result => res.send(result[0]))
});


router.get('/available', (req, res) => {
    db.AvailableFaculty
        .findAll()
        .then(result => res.send(result))
});


router.post('/join', (req, res, next) => {
    Recruiter.begin()
        .withUser(req.user.id)
        .toFaculty(req.body.facultyId)
        .inGroup(req.body.initialGroup)
        .end()
        .then(() => {
            unauthenticate(req.user);
            res
                .status(201)
                .end()
        })
        .catch(() => { next(new error.Conflict("You are already member of faculty or faculty does not exist")) })
});


router.delete('/:facultyId', ensureIsAdmin(), (req, res) => {
    db.Faculty.destroy({ where: {id: req.params.facultyId}});

    res
        .status(204)
        .end()
});

router.get('/:facultyId/groups', ensureFacultyMember(), (req, res) => {
    db.Course.findAll({
        where: {facultyId: req.params.facultyId},
        attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('group')), 'group']]})
        .map(g => g.group)
        .filter(g => g.length === 2)
        .then(groups => res.send(groups));
});



module.exports = router;
