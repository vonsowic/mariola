const router = require('express').Router();
const db = require('database');

router.get('/:facultyId', (req, res) => {
    db.ExchangeIntention
        .findAll({
            attributes: ['id', 'whatId', 'forId', 'userFrom'],
            through: {
                model: db.Course,
                attributes: [],
                where: {
                    facultyId: req.params.facultyId
                }
            }
        })
        .then(exchanges => res.send(exchanges))
});

router.post('/', (req, res, next) => {
    db.ExchangeIntention
        .create({
            whatId: req.body.whatId,
            forId: req.body.forId,
            userFrom: req.user.id
        })
        .then(ex => res.send({id: ex.id}))
        .catch(err => next(err))
});

router.post('/specific', (req, res, next) => {
    db.ExchangeIntention
        .findById(req.body.intentionId)
        .then(ex => db.Exchanged
            .create({
                userTo: req.user.id,
                userFrom: ex.userFrom,
                whatId: ex.whatId,
                forId: ex.forId
            }))
        .then(() => res
            .status(201)
            .end())
        // .catch(err => next(err))
});

router.delete('/:intentionId', (req, res, next) => {
    db.ExchangeIntention
        .destroy({
            where: {id: req.params.intentionId}
        })
        .then(() => res
            .status(204)
            .end())
        .catch(err => next(err))
});



module.exports = router;
