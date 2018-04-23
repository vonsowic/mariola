const router = require('express').Router();
const service = require('./service');

router.get('/:facultyId', (req, res) => {
    service.findAllIntentionsByFacultyId(req.params.facultyId)
        .then(exchanges => res.send(exchanges))
});

router.post('/', (req, res, next) => {
    service.create(req.body.forId, req.user.id)
        .then(ex => res.send({id: ex.id}))
        .catch(err => next(err))
});

router.post('/specific', (req, res, next) => {
   service.exchange(req.body.intentionId)
        .then(() => res
            .status(201)
            .end())
        // .catch(err => next(err))
});

router.delete('/:intentionId', (req, res, next) => {
    service.remove(req.params.intentionId)
        .then(() => res
            .status(204)
            .end())
        .catch(err => next(err))
});



module.exports = router;
