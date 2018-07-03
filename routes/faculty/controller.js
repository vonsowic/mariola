const {BadRequest} = require('utils/errors');
const service = require('./service');
const Recruiter = require('utils/Recruiter');
const db = require('database');
const { ensureIsAdmin, unauthenticate } = require('utils/guards');
const { Conflict } = require('utils/errors');
const router = require('express').Router();



router.get('/available', (req, res, next) => {
    db.AvailableFaculty
        .findAll()
        .then(result => res.send(result))
        .catch(err => next(err))
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
router.use(ensureIsAdmin());

router.get('/:facultyId/members', (req, res, next) => {
    db.User
        .findAll({
            attributes: ['id', 'name', 'lastName'],
            where: {
                // TODO
            }
        })
        .then(members => res.send(members))
        .catch(err => next(err))
});

router.patch('/:facultyId/:userId/ban', (req, res, next) => {
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

router.patch('/:facultyId/transferWithoutExchange', (req, res, next) => {
    db.Faculty
        .update({
            transferWithoutExchangeEnabled: req.body.transferWithoutExchange
        }, {
            id: req.params.facultyId
        })
        .then(result => res.send(result))
        .catch(err => next(err))
});

router.patch('/:facultyId/:courseName/maxStudentsNumber', (req, res, next) => {
    db.Course
        .update({
            maxStudentsNumber: req.body.maxStudentsNumber
        }, {
            facultyId: req.params.facultyId,
            name: req.params.courseName
        })
        .then(result => res.send(result))
        .catch(err => next(err))
});

router.delete('/:facultyId', (req, res) => {
    db.Faculty.destroy({ where: {id: req.params.facultyId}});

    res
        .status(204)
        .end()
});

module.exports = router;
