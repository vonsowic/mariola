const { CronJob } = require('cron');
const eaiibDownloader = require('utils/eaiib');
const { saveDetailsForCourse } = require('utils/import-plan');

const createCronJob = db =>
    new CronJob(
        '0 3 4 * * *', // at 4:30 am every day Warsaw time
        () => updateFacultiesPlans(db),
        () => console.log(`${new Date}: updating stoped.`), // executed when job stops
        false, // do not execute on start
        'Europe/Warsaw' // timezone
    );


const updateFacultiesPlans = db => {
    db.Faculty
        .findAll({
            attributes: ['id', 'url']
        })
        .then(faculties => faculties
            .map(faculty =>
                eaiibDownloader(faculty.url)
                    .then(items => assignFacultyIdTo(items, faculty.id))
                    .then(items => items
                        .map(item => db.Course
                            .upsert(item, {
                                returning: true
                            })
                            .then(savedCourse => db.CourseDetail
                                .destroy({
                                    where: {
                                        courseId: savedCourse[0].id
                                    }
                                })
                                .then(() => savedCourse))

                            .then(savedCourse => saveDetailsForCourse(db, savedCourse[0], item.coursesDetails))))))
};

const assignFacultyIdTo = (items, facultyId) =>
    items.map(item => Object.assign({}, item, {facultyId}));

module.exports={
    createCronJob,
    updateFacultiesPlans
};