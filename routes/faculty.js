const router = require('express').Router();
const db = require('database');
const error = require('utils/errors');
const eaiibDownloader = require('utils/eaiib');
const Recruiter = require('utils/Recruiter');


router.post('/create', async (req, res, next) => {
    let createdFaculty;
    try {
        createdFaculty = await db.Faculty
            .create({
                name: req.body.name,
                availableFacultyId: req.body.facultyId
            })
    } catch (err){
        next(new error.NotFound('Faculty does not exist'))
    }

    await db.AvailableFaculty.findById(createdFaculty.availableFacultyId)
        .then(async result => {
            for(let courseItem of await eaiibDownloader(result.url)){
                courseItem.facultyId = createdFaculty.id;
                db.Course.create(courseItem)
                    .then(savedCourse => courseItem
                        .courseDetails
                        .map(detail => ({
                            start: detail.start,
                            end: detail.end,
                            courseId: savedCourse.id
                        })))
                    .then(details => db.CourseDetail.bulkCreate(details))
            }
        });

    await db.UserFaculty.create({
        userId: req.user.id,
        facultyId: createdFaculty.id,
        isAdmin: true
    });

    await Recruiter.begin()
        .withUser(req.user.id)
        .toFaculty(createdFaculty.id)
        .inGroup(req.body.initialGroup)

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
                attributes: ['name', 'lastName'],
                through: {
                    model: db.UserFaculty,
                    where: { isAdmin: true },
                    attributes: []
                }
            }]
        })
        .then(result => res.send(result))
});


router.get('/available', (req, res) => {
    db.AvailableFaculty
        .findAll()
        .then(result => res.send(result))
});


router.post('/join', (req, res, next) => {
    Recruiter.begin()
        .withUser(req.user.id)
        .toFaculty(req.body.facultyId)
        .inGroup(req.body.initialGroup)
        .then(() => res
            .status(201)
            .end())
        .catch(() => { next(new error.Conflict("You are already member of faculty or faculty does not exist")) })
});


router.delete('/:facultyId', ensureIsAdmin, (req, res) => {
    db.Faculty.destroy({ where: {id: req.params.facultyId}});

    res
        .status(204)
        .end()
});


const isAdmin=(req)=>
    req
        .user
        .faculties
        .find(f => f.id.toString() === req.params.facultyId)
        ["user_faculty"]
        ["isAdmin"];


function ensureIsAdmin(req, res, next) {
    if(isAdmin(req)){
        next()
    } else {
        res
            .status(403)
            .send({message: "You are not the root!"})
    }
}



module.exports = router;
