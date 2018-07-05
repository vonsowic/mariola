const eaiibDownloader = require('./eaiib');

module.exports = db => async faculty => {
    for(let courseItem of await eaiibDownloader(faculty.url)){
        courseItem.facultyId = faculty.id;

        db.Course
            .create(courseItem)
            .then(savedCourse => courseItem
                .courseDetails
                .map(detail => ({
                    start: detail.start,
                    end: detail.end,
                    courseId: savedCourse.id
                })))
            .then(details => db.CourseDetail.bulkCreate(details))
    }
};