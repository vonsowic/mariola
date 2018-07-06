const router = require('express').Router();
const service = require('./service');
const db = require('database');
const {getMondayDate, getSundayDate} = require('utils/datetime');
let { ensureFacultyMember } = require('utils/guards');

const normalizeDate = dateStr => dateStr
    ? dateStr.replace('"', '')
    : dateStr;

ensureFacultyMember = ensureFacultyMember(req => req.query.facultyId);

router.get('/my', (req, res, next) => {
    db.Course
        .findAll({
            attributes: ['id', 'name', 'group', 'facultyId'],
            include: [{
                model: db.CourseDetail,
                attributes: ['start', 'end'],
                where: {
                    start: {
                        [db.Op.gt]: normalizeDate(req.query.start) || getMondayDate(),
                        [db.Op.lt]: normalizeDate(req.query.end) || getSundayDate()
                    }
                }
            }, {
                model: db.User,
                where: {
                    id: req.user.id
                },
                through: false
            }],
            raw: true
        })
        .then(result => res.send(result))
        .catch(err => next(err))
});

router.get('/my/ids', (req, res, next) => {
    service.findCoursesIdsByUserId(req.user.id)
        .then(ids => res.send(ids))
        .catch(err => next(err))
});


router.get('/', ensureFacultyMember, (req, res, next) => {
    service.findAllByFaculty(
        req.query.facultyId,
        [
            service.withDetails(req.query)
        ])
        .then(items => res.send(items))
        .catch(err => next(err))
});

router.get('/general', ensureFacultyMember, (req, res, next) => {
    service.findWithNumberOfDetailsAndStudents(req.query.facultyId)
        .then(result => res.send(result))
        .catch(err => next(err))
});


module.exports=router;