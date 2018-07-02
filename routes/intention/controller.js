const router = require('express').Router();
const service = require('./service');
const { ensureFacultyMember } = require('utils/guards');
const { NotAllowed } = require('utils/errors');

router.get('/:facultyId', ensureFacultyMember(), (req, res, next) => {
    service.findAllIntentionsByFacultyId(req.params.facultyId)
        .then(exchanges => res.send(exchanges))
        .catch(err => next(err))
});


router.get('/:facultyId/:intentionId', ensureFacultyMember(), (req, res, next) => {
    service.findOneIntentionById(req.params.intentionId, req.params.facultyId)
        .then(result => res.send(result))
        .catch(err => next(err))
});

// TODO: ensure faculty member in trigger
router.post('/', (req, res, next) => {
    service.create(req.body.forId, req.user.id)
        .then(ex => res.send({id: ex.id}))
        .catch(err => next(err))
});


router.delete('/:intentionId', async (req, res, next) => {
    try {
        const ei = await service.findOneIntentionById(req.params.intentionId);

        if( ei.userId !== req.user.id) {
            throw new NotAllowed()
        }

        service.remove(req.params.intentionId)
            .then(() => res
                .status(204)
                .end())
    } catch (err) {
        next(err)
    }
});


module.exports = router;
