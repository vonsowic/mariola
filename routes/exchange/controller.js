const router = require('express').Router();
const db = require('database');
const guards = require('utils/guards');
const { NotAllowed } = require('utils/errors');

const ensuresIsAdmin=guards.ensureIsAdmin(req => req.query.facultyId);


const withCourse = (as, facultyId) => ({
    attributes: ['id', 'name', 'group'],
    model: db.Course,
    where: {
        facultyId
    },
    as
});

const withUser = as => ({
    attributes: ['id', 'name', 'lastName'],
    model: db.User,
    as
});


router.get('/:exchangeId', (req, res, next) => {
    db.Exchanged
        .findById(req.params.exchangeId)
        .then(exchanged => {
            if (exchanged.fromId !== req.user.id && exchanged.toId !== req.user.id) {
                throw new NotAllowed()
            }

            return db.Course
                .findOne({
                    attributes: ['id', 'name', 'group', ],
                    where: {
                        id: exchanged.userFrom === req.user.id
                            ? exchanged.forId
                            : exchanged.whatId
                    }
                })
                .then(c => ({
                    id: c.id,
                    name: c.name,
                    group: c.group,
                    previousId: exchanged.userFrom === req.user.id
                        ? exchanged.whatId
                        : exchanged.forId}))
        })
        .then(result => res.send(result))
        .catch(err => next(err))
});


router.get('/', ensuresIsAdmin, (req, res, next) => {
    db.Exchanged
        .findAll({
            attributes: ['id', 'createdAt'],
            include: [
                withCourse('what', req.query.facultyId),
                withCourse('for', req.query.facultyId),
                withUser('from'),
                withUser('to')
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            limit: req.query.limit,
            offset: req.query.offset
        })
        .then(result => res.send(result))
        .catch(err => next(err))
});


module.exports=router;