const eaiibDownloader = require('./eaiib');

/**
 * This function is also installed as database hook, so leave it as closure.
 */
const importPlan = db => faculty =>
    eaiibDownloader(faculty.url)
        .then(items => items
            .map(item => Object.assign({}, item, {facultyId: faculty.id}))
            .map(item => db.Course
                .create(item)
                .then(savedCourse =>
                    saveDetailsForCourse(db, savedCourse, item.coursesDetails)
                        .then(() => ({created: true})))));


const saveDetailsForCourse = (db, savedCourse, details) => db
    .CourseDetail
    .bulkCreate(details
        .map(cd => Object.assign({}, cd, { courseId: savedCourse.id })));


module.exports={
    importPlan,
    saveDetailsForCourse
};