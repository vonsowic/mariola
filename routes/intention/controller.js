const router = require('express').Router();
const service = require('./service');
const ensureFacultyMember = require('utils/guards').ensureFacultyMember;

router.get('/:facultyId', ensureFacultyMember(), (req, res, next) => {
    service.findAllIntentionsByFacultyId(req.params.facultyId)
        .then(exchanges => res.send(exchanges))
        .catch(err => next(err))
});


router.get('/:facultyId/:intentionId', ensureFacultyMember(), (req, res, next) => {
    service.findOneIntentionById(req.params.facultyId, req.params.intentionId)
        .then(result => res.send(result))
        .catch(err => next(err))
});

// TODO: ensure faculty member in trigger
router.post('/', (req, res, next) => {
    service.create(req.body.forId, req.user.id)
        .then(ex => res.send({id: ex.id}))
        .catch(err => next(err))
});

// TODO: all
router.post('/specific', (req, res, next) => {
   service.exchange(req.body.intentionId, req.user.id)
        .then(() => res
            .status(201)
            .end())
        .catch(err => next(err))
});

// TODO: trigger ensureOwner
router.delete('/:intentionId', (req, res, next) => {
    service.remove(req.params.intentionId)
        .then(() => res
            .status(204)
            .end())
        .catch(err => next(err))
});


module.exports = router;
