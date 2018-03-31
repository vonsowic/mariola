const router = require('express').Router();
const db = require('database');
const NotFound = require('utils/errors').NotFound;
const eaiibDownloader = require('utils/eaiib');

router.post('/create', async (req, res, next) => {
    let createdFaculty;
    try {
        createdFaculty = await db.Faculty
            .create({
                name: req.body.name,
                availableFacultyId: req.body.facultyId
            })
    } catch (err){
        next(new NotFound('Faculty does not exist'))
    }

    db.UserFaculty.create({
        userId: req.user.id,
        facultyId: createdFaculty.id,
        isAdmin: true
    });

    db.AvailableFaculty.findById(createdFaculty.availableFacultyId)
        .then(async result => {
            for(let courseItem of await eaiibDownloader(result.url)){
                courseItem.facultyId = createdFaculty.id;
                db.Course.create(courseItem)
                    .then(course => {
                        db.CourseDetails.bulkCreate(
                            courseItem
                                .courseDetails
                                .map(detail => ({
                                    start: detail.start,
                                    end: detail.end,
                                    courseId: course.id
                                })))
                    })
            }
        });

    res
        .status(201)
        .send(createdFaculty)
});

router.get('/', (req, res) => {
    db.Faculty
        .findAll({
            attributes: ['id', 'name'],
            include: [{
                model: db.User,
                // where: { isAdmin: true }
            }]
        })
        .then(result => res.send(result))
});

router.get('/available', (req, res) => {
    db.AvailableFaculty
        .findAll()
        .then(result => res.send(result))
});

router.post('/:facultyId/join', (req, res, next) => {
    db.UserFaculty.create({userId: req.user.id, facultyId: req.params.facultyId})
        .then(result => res
            .status(201)
            .send(result))
        .catch(() => next(new NotFound("Faculty does not exist")))
});

router.delete('/:facultyId', (req, res) => {
    db.Faculty.destroy({ where: {id: req.params.facultyId}});

    res
        .status(204)
        .end()
});

const isAdmin = (req, res, next) => {
    // if(req.user.faculties req.params.facultyId)
};



module.exports = router;
