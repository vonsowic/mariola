const router = require('express').Router();
const service = require('./service');

router.get('/:facultyId/my', (req, res)=>{
    service.findAllByFaculty(
        req.params.facultyId,
        [
            service.withUser(req.user.id),
            service.withDetails(req.query)
        ])
        .then(items => res.send(items))
});


router.get('/:facultyId/my/general', (req, res)=>{
    service.findAllByFaculty(
        req.params.facultyId,
        [
            service.withUser(req.user.id)
        ])
        .then(items => res.send(items))
});


router.get('/:facultyId', (req, res) => {
    service.findAllByFaculty(
        req.params.facultyId,
        [
            service.withDetails(req.query)
        ])
        .then(items => res.send(items))
});

router.get('/:facultyId/general', (req, res, next) => {
    service.findWithNumberOfDetailsAndStudents(req.params.facultyId)
        .then(result => res.send(result[0]))
        .catch(err => next(err))
});

router.get('/my/general', (req, res)=>{
    service.findAll()
        .then(items => res.send(items))
});


module.exports=router;