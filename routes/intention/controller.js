const {NotFound, NotAllowed} = require('utils/errors');

const router = require('express').Router();
const db = require('database');
const guards = require('utils/guards');

const ensureFacultyMember=guards.ensureFacultyMember(req => req.query.facultyId);


const withCourse = (as, facultyId) => ({
    attributes: ['id', 'name', 'group'],
    model: db.Course,
    where: {
        facultyId
    },
    as
});

const withUser = () => ({
    attributes: ['id', 'name', 'lastName'],
    model: db.User,
    as: 'from'
});


router.get('/', ensureFacultyMember, (req, res, next) => {
    db.Intention
        .findAll({
            attributes: ['id', 'createdAt'],
            include: [
                withUser(),
                withCourse('what', req.query.facultyId),
                withCourse('for', req.query.facultyId)
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            limit: req.query.limit,
            offset: req.query.offset,
        })
        .then(result => {
            if( !result ) {
                throw new NotFound()
            }

            res.send(result)
        })
        .catch(err => next(err))
});


router.get('/:intentionId', ensureFacultyMember, (req, res, next) => {
    db.Intention
        .findOne({
            attributes: ['id', 'createdAt'],
            where: {
                fromId: req.user.id,
                id: req.params.intentionId
            },
            include: [
                withUser(),
                withCourse('what', req.query.facultyId),
                withCourse('for', req.query.facultyId)
            ]
        })
        .then(result => {
            if( !result ) {
                throw new NotFound()
            }
            res.send(result)
        })
        .catch(err => next(err))
});


router.post('/', (req, res, next) => {
    db.Intention
        .create({
            forId: req.body.forId,
            fromId: req.user.id
        })
        .then(ex => res.send({id: ex.id}))
        .catch(err => next(err))
});


router.delete('/:intentionId', (req, res, next) => {
    db.Intention
        .findById(req.params.intentionId)
        .then(intention => {
            if (intention.fromId !== req.user.id) {
                throw new NotAllowed()
            }

            return intention.destroy()
        })
        .then(() => res
            .status(204)
            .end())
        .catch(err => next(err))
});


module.exports = router;
