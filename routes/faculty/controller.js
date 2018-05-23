const router = require('express').Router();
const error = require('utils/errors');
const ensureIsAdmin = require('utils/guards').ensureIsAdmin;
const ensureFacultyMember = require('utils/guards').ensureFacultyMember;
const service = require('./service');
const Recruiter = require('utils/Recruiter');
const db = require('database');
const unauthenticate = require('utils/guards').unauthenticate;


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
    db.Faculty
        .findAll({
            attributes: ['id', 'name'],
            include: [{
                model: db.User,
                attributes: [],
                required: req.query.onlyMy === 'true',
                through: {
                    model: db.UserFaculty,
                    where: { userId: req.user.id },
                    attributes: [],
                }
            }]
        })
        .then(result => res.send(result))
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
