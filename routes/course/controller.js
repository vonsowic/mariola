const router = require('express').Router();
const service = require('./service');
const ensureFacultyMember = require('utils/guards').ensureFacultyMember;
const db = require('database');
const {getMondayDate, getSundayDate} = require('utils/datetime');

const normalizeDate = dateStr => dateStr
    ? dateStr.replace('"', '')
    : dateStr;

router.get('/my', (req, res, next) => {
    db.Course
        .findAll({
            attributes: ['id', 'name', 'group', 'facultyId'],
            where: db.connection.literal(`courses.id IN (SELECT "courseId" FROM user_courses WHERE "userId"=${req.user.id})`),
            include: [{
                model: db.CourseDetail,
                attributes: ['start', 'end'],
                where: {
                    start: {
                        [db.Op.gt]: normalizeDate(req.query.start) || getMondayDate(),
                        [db.Op.lt]: normalizeDate(req.query.end) || getSundayDate()
                    }
                }
            }],
            raw: true
        })
        .then(result => res.send(result))
        .catch(err => next(err))
});


router.get('/:facultyId/my/general', ensureFacultyMember(), (req, res, next)=>{
    service.findAllByFaculty(
        req.params.facultyId,
        [
            service.withUser(req.user.id)
        ])
        .then(items => res.send(items))
        .catch(err => next(err))
});

router.get('/my/ids', (req, res, next) => {
    service.findCoursesIdsByUserId(req.user.id)
        .then(ids => res.send(ids))
        .catch(err => next(err))
});


router.get('/:facultyId', ensureFacultyMember(), (req, res, next) => {
    service.findAllByFaculty(
        req.params.facultyId,
        [
            service.withDetails(req.query)
        ])
        .then(items => res.send(items))
        .catch(err => next(err))
});

router.get('/:facultyId/general', ensureFacultyMember(), (req, res, next) => {
    service.findWithNumberOfDetailsAndStudents(req.params.facultyId)
        .then(result => res.send(result[0]))
        .catch(err => next(err))
});

router.get('/my/general', (req, res, next)=>{
    service.findAll()
        .then(items => res.send(items))
        .catch(err => next(err))
});


module.exports=router;