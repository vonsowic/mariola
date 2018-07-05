const eaiibDownloader = require('./eaiib');

/**
 * This function is also installed as database hook, so leave it as closure.
 */
module.exports = db => faculty =>
    eaiibDownloader(faculty.url)
        .then(items => items
            .map(item => Object.assign({}, item, {facultyId: faculty.id}))
            .map(item => db.Course
                .create(item)
                .then(savedCourse => items
                    .map(item => Object.assign({}, item, {
                        coursesDetails: item
                            .coursesDetails
                            .map(cd => Object.assign({}, cd, {courseId: savedCourse.id}))
                    }))
                    .map(item => db
                        .CourseDetail
                        .bulkCreate(item.coursesDetails)
                        .then(() => ({created: true}))))));
