const {BadRequest, Locked} = require('utils/errors');
const service = require('./service');
const Recruiter = require('utils/Recruiter');
const db = require('database');
const { ensureIsAdmin, ensureFacultyMember, unauthenticate } = require('utils/guards');
const { Conflict } = require('utils/errors');
const router = require('express').Router();


router.post('/create', (req, res, next) => {
    // disable endpoint
    next(new Locked());

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


router.get('/', (req, res, next) => {
    db.connection.query(`
        SELECT id, name
        FROM faculties 
        ${whereSelector(req.query.onlyMy, req.user.id)};`)
        .then(result => res.send(result[0]))
        .catch(err => next(err))
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

router.get('/:facultyId', ensureFacultyMember(), (req, res, next) => {
    db.Faculty
        .findById(req.params.facultyId, {
            attributes: ['id', 'name', 'exchangesEnabled', 'transferWithoutExchangeEnabled']
        })
        .then(f => res.send(f))
        .catch(err => next(err))
});

router.get('/:facultyId/admin', (req, res, next) => {
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
        .then(admin => res.send(admin))
        .catch(err => next(err))
});

router.get('/:facultyId/groups', (req, res, next) => {
    db.Course.findAll({
        where: {facultyId: req.params.facultyId},
        attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('group')), 'group']]
    })
        .map(g => g.group)
        .filter(g => g.length === 2)
        .then(groups => res.send(groups))
        .catch(err => next(err))
});

// ADMIN ENDPOINTS
router.get('/:facultyId/members', ensureIsAdmin(), (req, res, next) => {
    db.Faculty
        .findById(req.params.facultyId, {
            attributes: [],
            include: [{
                model: db.User,
                attributes: ['id', 'name', 'lastName']
            }]
        })
        .then(({users}) => res.send(users))
        .catch(err => next(err))
});

router.patch('/:facultyId/:userId/ban', ensureIsAdmin(), (req, res, next) => {
    db.UserFaculty
        .update({
            isBanned: req.body.isBanned
        }, {
            userId: req.params.userId,
            facultyId: req.params.facultyId
        })
        .then(result => res.send(result))
        .catch(err => next(err))
});

router.patch('/:facultyId', ensureIsAdmin(), (req, res, next) => {
    db.Faculty
        .update(
            Object.assign({},
                req.body.exchangesEnabled !== undefined ?
                    {exchangesEnabled: req.body.exchangesEnabled}
                    : {},
                req.body.transferWithoutExchangeEnabled !== undefined
                    ? {transferWithoutExchangeEnabled: req.body.transferWithoutExchangeEnabled}
                    : {}), {
                where: {
                    id: req.params.facultyId
                }
            })
        .then(result => res.send(result))
        .catch(err => next(err))
});


router.delete('/:facultyId', ensureIsAdmin(), (req, res) => {
    db.Faculty.destroy({ where: {id: req.params.facultyId}});

    res
        .status(204)
        .end()
});

module.exports = router;
