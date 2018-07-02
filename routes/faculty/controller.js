const {BadRequest} = require('utils/errors');
const service = require('./service');
const Recruiter = require('utils/Recruiter');
const db = require('database');
const { ensureIsAdmin, unauthenticate, ensureFacultyMember } = require('utils/guards');
const { Conflict } = require('utils/errors');
const router = require('express').Router();



router.get('/available', (req, res) => {
    db.AvailableFaculty
        .findAll()
        .then(result => res.send(result))
});


router.post('/create', (req, res, next) => {
    if( !req.body.facultyId || !req.body.initialGroup){
        next(new BadRequest("FacultyId of initialGroup missing"))
    }

    service.createFaculty(
        req.body.name,
        req.body.facultyId,
        req.user.id,
        req.body.initialGroup)
        .then(createdFaculty => {
            unauthenticate(req.user);
            res
                .send(createdFaculty)
        })
        .catch(err => next(err))
});


router.get('/', (req, res) => {
    db.connection.query(`
        SELECT id, name
        FROM faculties 
        ${whereSelector(req.query.onlyMy, req.user.id)};`)
        .then(result => res.send(result[0]))
});

const whereSelector = (onlyMy, userId) =>
    onlyMy
        ? `WHERE id ${onlyMy === 'true' ? '' : 'NOT'} IN (SELECT "facultyId" FROM user_faculties WHERE "userId"=${userId})`
        : '';


router.post('/join', (req, res, next) => {
    if( !req.body.facultyId || !req.body.initialGroup){
        next(new BadRequest("FacultyId of initialGroup missing"))
    }

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
        .catch(() => next(new Conflict("you are already member of this faculty")))
});


router.delete('/:facultyId', ensureIsAdmin(), (req, res) => {
    db.Faculty.destroy({ where: {id: req.params.facultyId}});

    res
        .status(204)
        .end()
});

router.get('/:facultyId/admin', (req, res) => {
    db.User
        .findOne({
            attributes: ["name", "lastName"],
            where: db.connection.literal(`id in (
                SELECT "userId" 
                FROM user_faculties 
                WHERE "facultyId"=${req.params.facultyId}
                AND "isAdmin"='t'
                ORDER BY "updatedAt"
                LIMIT 1)`)
        })
        .then(admin => res.send(admin));
});

router.delete('/:facultyId/leave', ensureFacultyMember(), (req, res, next) => {
    db.UserFaculty
        .destroy({
            where: {
                userId: req.user.id,
                facultyId: req.params.facultyId
            }
        })
        .then(() => {
            unauthenticate(req.user);
            res
                .status(204)
                .end()
        })
});

router.get('/:facultyId/groups', (req, res) => {
    db.Course.findAll({
        where: {facultyId: req.params.facultyId},
        attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('group')), 'group']]
    })
        .map(g => g.group)
        .filter(g => g.length === 2)
        .then(groups => res.send(groups));
});

module.exports = router;
