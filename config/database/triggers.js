const db = require('database');

function userJoinedFaculty(userFacultyRecord) {
    db.Course.findAll({
        where: { facultyId: userFacultyRecord.facultyId }
    })
        .then(async courseItems => courseItems
            .map(item => ({
                userId: userFacultyRecord.userId,
                courseId: item.id
            })))
        .then(userCourseItems =>
            db.UserCourse.bulkCreate(userCourseItems))
}

module.exports={
    userJoinedFaculty
};