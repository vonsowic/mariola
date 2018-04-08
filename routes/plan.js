const router = require('express').Router();
const db = require('database');
const date = require('utils/datetime');

router.get('/my/general', (req, res)=>{
    findAll()
        .then(items => res.send(items))
});


router.get('/:facultyId/my', (req, res)=>{
    findAllByFaculty(
        req.params.facultyId,
        [
            withUser(req.user.id),
            withDetails(req.query)
        ])
        .then(items => res.send(items))
});


router.get('/:facultyId/my/general', (req, res)=>{
    findAllByFaculty(
        req.params.facultyId,
        [
            withUser(req.user.id)
        ])
        .then(items => res.send(items))
});


router.get('/:facultyId', (req, res) => {
    findAllByFaculty(
        req.params.facultyId,
        [
            withDetails(req.query)
        ])
        .then(items => res.send(items))
});


router.get('/:facultyId/general', (req, res) => {
    findAllByFaculty(req.params.facultyId)
        .then(items => res.send(items))
});


const findAll=(where={}, include=[]) =>
    db.Course.findAll({
        attributes: ['id', 'name', 'lecturer', 'group', 'place' ],
        include,
        where: where
    });


const findAllByFaculty=(facultyId, include=[]) =>
    findAll({facultyId}, include);


const withUser=(userId)=>({
    model: db.User,
    attributes: [],
    where: {id: userId}
});

const withDetails=(interval)=>({
    model: db.CourseDetail,
    attributes: ['start', 'end'],
    where: {
        start: {
            [db.Op.gt]: interval.start || date.getMondayDate()
        },
        end: {
            [db.Op.lt]: interval.end || date.getSundayDate()
        }
    }
});



module.exports=router;