const Recruiter = require('utils/Recruiter');
const db = require('database');
const eaiibDownloader = require('utils/eaiib');


const createFaculty = async (name, availableFacultyId, userId, initialGroup) => {
    let createdFaculty = await db.Faculty
        .create({
            name,
            availableFacultyId
        });


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

    await Recruiter.begin()
        .withUser(userId)
        .toFaculty(createdFaculty.id)
        .asAdmin()
        .inGroup(initialGroup)
        .end();


    return createdFaculty
};

module.exports={
    createFaculty
};