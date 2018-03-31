const router = require('express').Router();
const db = require('database');


router.get('/:facultyId/my', (req, res)=>{
    findAllCourses(
        req.params.facultyId,
        [
            withUser(req.user.id),
            withDetails()
        ])
        .then(items => res.send(items))
});

router.get('/:facultyId/my/general', (req, res)=>{
    findAllCourses(
        req.params.facultyId,
        [
            withUser(req.user.id)
        ])
        .then(items => res.send(items))
});

router.get('/:facultyId', (req, res) => {
    findAllCourses(
        req.params.facultyId,
        [
            withDetails()
        ])
        .then(items => res.send(items))
});

router.get('/:facultyId/general', (req, res) => {
    findAllCourses(req.params.facultyId)
        .then(items => res.send(items))
});


const findAllCourses=(facultyId, include=[]) =>
    db.Course
        .findAll({
            where: {
                facultyId
            },
            attributes: ['id', 'name', 'lecturer', 'group', 'place' ],
            include: include
        });

const withUser=(userId)=>({
    model: db.User,
    attributes: [],
    where: {id: userId}
});

const withDetails=()=>({
    model: db.CourseDetail,
    attributes: ['start', 'end']
});

module.exports=router;